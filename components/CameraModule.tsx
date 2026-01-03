
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Icons } from '../constants.tsx';

interface CameraModuleProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

export const CameraModule: React.FC<CameraModuleProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    setIsInitializing(true);
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser.");
      }

      let mediaStream: MediaStream;
      try {
        // Preferred for mobile: back camera (environment)
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false
        });
      } catch (e) {
        // Fallback: any available camera (desktop or front cam)
        console.warn("Environment camera failed, falling back to default camera", e);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      let msg = "Unable to access camera.";
      // Handle specific browser error cases
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission dismissed')) {
        msg = "Camera permission was dismissed or denied. Please enable camera access in your browser settings to continue.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = "No camera found on this device.";
      } else {
        msg = err.message || "An unexpected error occurred while accessing the camera.";
      }
      setError(msg);
      console.error("Camera access error:", err);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
    };
  }, [startCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        stopStream();
        onCapture(dataUrl);
      }
    }
  };

  const handleRetry = () => {
    startCamera();
  };

  if (error) {
    return (
      <div className="glass-card border-rose-100 p-8 rounded-[2.5rem] text-center space-y-4 shadow-xl animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Icons.Alert />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Camera Restricted</h3>
        <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm">{error}</p>
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={handleRetry}
            className="px-6 py-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 uppercase text-xs tracking-widest active:scale-95"
          >
            Grant Permission
          </button>
          <button 
            onClick={onCancel}
            className="px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden aspect-[3/4] sm:aspect-video shadow-2xl border-4 border-white">
      {isInitializing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-30">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-xs font-black uppercase tracking-widest animate-pulse">Initializing Lens...</p>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 ${isInitializing ? 'opacity-0' : 'opacity-100'}`}
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Viewfinder Overlay */}
      <div className="absolute inset-0 border-[2rem] border-black/10 pointer-events-none">
        <div className="w-full h-full border border-white/20 rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 border-t-2 border-l-2 border-white/60 absolute top-4 left-4 rounded-tl-lg"></div>
          <div className="w-8 h-8 border-t-2 border-r-2 border-white/60 absolute top-4 right-4 rounded-tr-lg"></div>
          <div className="w-8 h-8 border-b-2 border-l-2 border-white/60 absolute bottom-4 left-4 rounded-bl-lg"></div>
          <div className="w-8 h-8 border-b-2 border-r-2 border-white/60 absolute bottom-4 right-4 rounded-br-lg"></div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-10 z-20">
        <button
          onClick={onCancel}
          className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all flex items-center justify-center border border-white/20 shadow-lg active:scale-90"
          title="Cancel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        
        <button
          onClick={capturePhoto}
          disabled={isInitializing}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-[6px] border-slate-900 hover:scale-105 active:scale-95 transition-all group disabled:opacity-50 disabled:scale-100"
        >
          <div className="w-14 h-14 rounded-full border-4 border-emerald-500 group-hover:bg-emerald-50 transition-colors flex items-center justify-center">
            <div className="w-4 h-4 bg-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </button>
        
        <div className="w-12" /> {/* Layout Balance Spacer */}
      </div>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-full">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">Focus on leaf surface</p>
      </div>
    </div>
  );
};
