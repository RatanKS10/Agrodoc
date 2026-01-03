// Fixed missing React import for React.FC namespace
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, Modality, Blob, LiveServerMessage } from '@google/genai';
import { LIVE_MODEL, LIVE_SYSTEM_INSTRUCTION, Icons, TRANSLATIONS } from '../constants.tsx';

interface LiveAssistantProps {
  lang: 'en' | 'hi';
  onClose: () => void;
  context?: string;
}

// Implement base64 decoding as per standard guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Implement base64 encoding as per standard guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Manual audio decoding logic for raw PCM streams
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Create PCM blob for streaming to Live API
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const LiveAssistant: React.FC<LiveAssistantProps> = ({ lang, onClose, context }) => {
  const t = TRANSLATIONS[lang];
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const [vols, setVols] = useState<number[]>(new Array(10).fill(0));

  const cleanup = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close().catch(() => {});
      outputAudioContextRef.current = null;
    }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
  }, []);

  const startSession = useCallback(async () => {
    try {
      // Validate key presence
      if (!process.env.API_KEY || process.env.API_KEY.trim() === '') {
        throw new Error("API Key is not configured correctly in the environment.");
      }

      setIsConnecting(true);
      setError(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      audioContextRef.current = inputAudioContext;
      outputAudioContextRef.current = outputAudioContext;

      const analyzer = outputAudioContext.createAnalyser();
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: lang === 'hi' ? 'Kore' : 'Zephyr' } },
          },
          systemInstruction: `${LIVE_SYSTEM_INSTRUCTION} Preferred Language: ${lang === 'hi' ? 'Hindi' : 'English'}. Context: ${context || 'N/A'}.`,
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            
            if (base64EncodedAudioString) {
              const ctx = outputAudioContextRef.current!;
              if (ctx.state === 'suspended') await ctx.resume();

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                ctx,
                24000,
                1
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              
              source.connect(analyzer);
              analyzer.connect(ctx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live AI Error:", e);
            setError("Expert connection interrupted. Please try again.");
            setIsConnecting(false);
          },
          onclose: () => {
            onClose();
          },
        }
      });
      
    } catch (err: any) {
      console.error("Session initialization failed:", err);
      setError(err.message || "Could not start audio session.");
      setIsConnecting(false);
    }
  }, [lang, context, onClose]);

  useEffect(() => {
    startSession();
    
    const interval = setInterval(() => {
      if (analyzerRef.current) {
        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);
        const newVols = [];
        for (let i = 0; i < 10; i++) {
          newVols.push(dataArray[i * 2] / 255);
        }
        setVols(newVols);
      }
    }, 50);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, [startSession, cleanup]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-emerald-950/95 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl glass-card border-white/20 rounded-[4rem] p-12 text-center shadow-2xl overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>

        <div className="relative z-10 space-y-12">
          {error ? (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
                <Icons.Alert />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Expert Offline</h3>
              <p className="text-emerald-200/60 font-medium">{error}</p>
              <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all">
                Close
              </button>
            </div>
          ) : (
            <>
              <div>
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20 text-white">
                   <Icons.Voice />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">
                  {isConnecting ? t.connecting : t.active}
                </h3>
                <p className="text-emerald-200/60 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Agrix Expert Live</p>
              </div>

              <div className="flex justify-center items-center h-24 gap-2">
                {vols.map((v, i) => (
                  <div 
                    key={i} 
                    className="w-2.5 bg-emerald-400 rounded-full transition-all duration-75"
                    style={{ 
                      height: `${15 + v * 100}%`, 
                      opacity: 0.2 + v * 0.8,
                      boxShadow: v > 0.3 ? '0 0 15px rgba(52, 211, 153, 0.5)' : 'none'
                    }}
                  ></div>
                ))}
              </div>

              <div className="pt-8">
                <button
                  onClick={onClose}
                  className="px-10 py-5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-full transition-all shadow-xl shadow-rose-900/40 uppercase text-[10px] tracking-widest active:scale-95 flex items-center gap-3 mx-auto border-2 border-rose-400/20"
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  {t.stop}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};