import React from 'react';
import { TRANSLATIONS, Icons } from '../constants';
import { BrandCarousel } from './BrandCarousel';

interface LayoutProps {
  children: React.ReactNode;
  lang: 'en' | 'hi';
  onLangToggle: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, lang, onLangToggle }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden">
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div className="max-w-4xl mx-auto glass-card h-16 px-6 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-900/5">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 2 8a7 7 0 0 1-7 7c-1.1 0-2.1-.2-3-.6M11 20l1-5M11 20l-4-4"/></svg>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{t.title}<span className="text-emerald-600">{t.subtitle}</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onLangToggle}
              className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:shadow-md transition-all group overflow-hidden"
            >
              <div className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${lang === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>EN</div>
              <div className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${lang === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>हि</div>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 relative z-10">
        {children}
      </main>

      <div className="w-full mt-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 mb-6">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-center">{t.partners}</h4>
        </div>
        <BrandCarousel />
      </div>

      <footer className="py-12 mt-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
            <div className="w-8 h-[1px] bg-slate-200"></div>
            {t.footerTagline}
            <div className="w-8 h-[1px] bg-slate-200"></div>
          </div>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
            {t.footerSubTagline}
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <a 
              href="mailto:agrix.mail@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg transition-all active:scale-95 group"
            >
              <div className="text-slate-400 group-hover:text-emerald-500 transition-colors">
                <Icons.Mail />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{t.contactUs}</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};