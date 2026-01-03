
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { CameraModule } from './components/CameraModule';
import { DiagnosticDisplay } from './components/DiagnosticDisplay';
import { LiveAssistant } from './components/LiveAssistant';
import { Icons, TRANSLATIONS } from './constants';
import { AppState } from './types';
import { diagnosePlant } from './geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [state, setState] = useState<AppState>({
    image: null,
    loading: false,
    result: null,
    error: null
  });
  const [showCamera, setShowCamera] = useState(false);
  const [showLiveExpert, setShowLiveExpert] = useState(false);

  const t = TRANSLATIONS[lang];

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = useCallback(async (base64: string) => {
    setState(prev => ({ ...prev, image: base64, loading: true, error: null, result: null }));
    setShowCamera(false);
    
    try {
      const diagnosis = await diagnosePlant(base64);
      setState(prev => ({ ...prev, loading: false, result: diagnosis }));
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message || "An unexpected error occurred." }));
    }
  }, []);

  const reset = () => {
    setState({
      image: null,
      loading: false,
      result: null,
      error: null
    });
    setShowCamera(false);
    setShowLiveExpert(false);
  };

  const getExpertContext = () => {
    if (state.result) {
      return `Plant has ${state.result.diseaseName}. Confidence: ${state.result.confidence}. Summary: ${state.result.summary}. Symptoms: ${state.result.symptoms.join(', ')}. Treatment: ${state.result.treatmentSteps.join(', ')}. Language: ${lang}.`;
    }
    return `User is asking for general agricultural advice. Language: ${lang}.`;
  };

  return (
    <Layout lang={lang} onLangToggle={() => setLang(l => l === 'en' ? 'hi' : 'en')}>
      {!state.image && !showCamera && (
        <div className="py-12 flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="text-center w-full max-w-2xl mb-12">
            <div className="relative mb-8 floating inline-block">
               <div className="absolute -inset-4 bg-emerald-400/20 blur-3xl rounded-full animate-pulse"></div>
               <div className="relative w-24 h-24 bg-white glass-card rounded-[2.5rem] flex items-center justify-center shadow-xl border border-white/50">
                 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 2 8a7 7 0 0 1-7 7c-1.1 0-2.1-.2-3-.6M11 20l1-5M11 20l-4-4"/></svg>
               </div>
            </div>
            
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-[1.1]">
              {t.heroTitle} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{t.heroGradient}</span>
            </h2>
            
            <p className="text-slate-500 max-w-md mx-auto mb-12 text-lg font-medium">
              {t.heroDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl mx-auto mb-12">
              <button
                onClick={() => setShowCamera(true)}
                className="group relative overflow-hidden flex flex-col items-center gap-4 p-10 glass-card rounded-[3rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-900/5 border-emerald-100/50"
              >
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-500">
                  <Icons.Camera />
                </div>
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                  <Icons.Camera />
                </div>
                <div className="text-center">
                  <p className="font-extrabold text-slate-900 text-xl tracking-tight">{t.smartScan}</p>
                  <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">{t.useCamera}</p>
                </div>
              </button>

              <label className="group cursor-pointer relative overflow-hidden flex flex-col items-center gap-4 p-10 glass-card rounded-[3rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-900/5 border-emerald-100/50">
                <input type="file" accept="image/*" onChange={handleImageInput} className="hidden" />
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-500">
                  <Icons.Upload />
                </div>
                <div className="w-14 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
                  <Icons.Upload />
                </div>
                <div className="text-center">
                  <p className="font-extrabold text-slate-900 text-xl tracking-tight">{t.uploadPhoto}</p>
                  <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">{t.fromFiles}</p>
                </div>
              </label>
            </div>

            <button
              onClick={() => setShowLiveExpert(true)}
              className="w-full max-w-xl p-8 glass-card border-emerald-200/50 rounded-[3rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-900/10 flex items-center gap-8 group mx-auto"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Icons.Voice />
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-2">{t.talkExpert}</p>
                <p className="text-sm font-bold text-emerald-600/60 uppercase tracking-widest">{t.expertDesc}</p>
              </div>
              <div className="ml-auto w-12 h-12 flex items-center justify-center text-emerald-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </button>
          </div>

          <div className="w-full mt-24 mb-12">
            <div className="text-center mb-16">
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">{t.testimonialsTitle}</h3>
               <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs">{t.testimonialsSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.testimonials.map((tm: any, i: number) => (
                <div key={i} className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.03] transition-all duration-500 border-white/50">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                     <Icons.Check />
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(s => <Icons.Star key={s} />)}
                  </div>
                  <p className="text-slate-600 font-medium mb-8 leading-relaxed italic">"{tm.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-lg">
                      {tm.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm leading-none mb-1">{tm.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tm.location}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                    {tm.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCamera && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">AI Viewfinder</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Environment Mode Active</p>
            </div>
            <button onClick={() => setShowCamera(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-slate-400 hover:text-rose-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <CameraModule onCapture={processImage} onCancel={() => setShowCamera(false)} />
        </div>
      )}

      {state.loading && state.image && (
        <div className="flex flex-col items-center justify-center py-10 space-y-10">
          <div className="relative w-full max-sm aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/20 border-8 border-white">
            <img src={state.image} alt="Processing" className="w-full h-full object-cover blur-[2px]" />
            <div className="absolute inset-0 bg-emerald-900/20"></div>
            <div className="scan-line"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-black text-slate-800 tracking-tight">{t.aiAnalyzing}</span>
                </div>
            </div>
          </div>
          <div className="text-center animate-pulse">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{t.scanningBio}</h3>
            <p className="text-slate-500 font-medium">{t.refDb}</p>
          </div>
        </div>
      )}

      {state.error && (
        <div className="glass-card border-rose-100 p-10 rounded-[3rem] text-center space-y-6 animate-in shake duration-500">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner shadow-rose-200">
            <Icons.Alert />
          </div>
          <div>
            <h3 className="text-2xl font-black text-rose-900 tracking-tight">{t.systemFault}</h3>
            <p className="text-rose-700/70 font-medium max-w-xs mx-auto mt-2">{state.error}</p>
          </div>
          <button
            onClick={reset}
            className="w-full sm:w-auto px-10 py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
          >
            {t.reboot}
          </button>
        </div>
      )}

      {state.result && state.image && (
        <div className="relative">
          <div className="fixed bottom-8 right-8 z-[60] group">
            <button 
              onClick={() => setShowLiveExpert(true)}
              className="w-16 h-16 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group-hover:rotate-12"
            >
              <Icons.Voice />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse"></div>
            </button>
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-xl border border-slate-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest">{t.talkExpert}</p>
            </div>
          </div>

          <DiagnosticDisplay 
            result={state.result} 
            image={state.image} 
            onReset={reset} 
            lang={lang}
          />
        </div>
      )}

      {showLiveExpert && (
        <LiveAssistant 
          lang={lang} 
          onClose={() => setShowLiveExpert(false)} 
          context={getExpertContext()}
        />
      )}
    </Layout>
  );
};

export default App;
