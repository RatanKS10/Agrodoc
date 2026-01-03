
import React, { useState } from 'react';
import { DiagnosisResult, RecommendedProduct } from '../types.ts';
import { Icons, TRANSLATIONS, BRAND_COLORS, BRAND_LOGOS } from '../constants.tsx';

interface ProductCardProps {
  product: RecommendedProduct;
  lang: 'en' | 'hi';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, lang }) => {
  const [imgError, setImgError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const t = TRANSLATIONS[lang];
  const brandColor = BRAND_COLORS[product.brandName] || '#10b981';
  const localLogo = BRAND_LOGOS[product.brandName];

  const handleViewDetails = () => {
    const query = encodeURIComponent(`${product.brandName} ${product.name}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 overflow-hidden">
      <div className="relative h-56 bg-slate-50 flex items-center justify-center p-8 transition-colors group-hover:bg-white">
        {!imgError && product.productImageUrl ? (
          <img 
            src={product.productImageUrl} 
            alt={product.name} 
            className="h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-200">
            <div className="scale-[2.5] opacity-50"><Icons.Leaf /></div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
          {localLogo ? (
            <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl border border-slate-200/50 shadow-sm">
              <img 
                src={localLogo} 
                alt={product.brandName} 
                className="h-4 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : !logoError && product.brandLogoUrl ? (
            <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl border border-slate-200/50 shadow-sm">
              <img 
                src={product.brandLogoUrl} 
                alt={product.brandName} 
                className="h-4 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div 
              className="px-3 py-1 rounded-lg text-[8px] font-black text-white shadow-lg uppercase tracking-widest"
              style={{ backgroundColor: brandColor }}
            >
              {product.brandName}
            </div>
          )}
        </div>

        <div className="absolute top-4 left-4">
          <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm ${
            product.type === 'Organic' ? 'bg-emerald-500 text-white' : 
            product.type === 'Biological' ? 'bg-sky-500 text-white' : 
            'bg-amber-500 text-white'
          }`}>
            {product.type}
          </span>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: brandColor }}>
          {product.brandName}
        </p>
        <h4 className="font-black text-slate-900 text-xl mb-3 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-3 mb-6">
          {product.reason}
        </p>
        
        <div className="mt-auto">
          <button 
            onClick={handleViewDetails}
            className="w-full py-4 bg-[#059669] border-2 border-black rounded-full flex items-center justify-center gap-2 text-white hover:bg-emerald-700 transition-all duration-300 shadow-md active:scale-95"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">{t.viewDetails}</span>
            <Icons.Star />
          </button>
        </div>
      </div>
    </div>
  );
};

interface DiagnosticDisplayProps {
  result: DiagnosisResult;
  image: string;
  onReset: () => void;
  lang: 'en' | 'hi';
}

export const DiagnosticDisplay: React.FC<DiagnosticDisplayProps> = ({ result, image, onReset, lang }) => {
  const t = TRANSLATIONS[lang];
  const { 
    diseaseName, 
    scientificName, 
    confidence, 
    isHealthy, 
    summary, 
    symptoms, 
    treatmentSteps, 
    preventiveMeasures,
    recommendedProducts,
    sources
  } = result;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="glass-card rounded-[3.5rem] shadow-2xl shadow-emerald-900/10 border-white/50 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/5 p-4">
            <div className="relative aspect-square rounded-[2.8rem] overflow-hidden shadow-inner bg-slate-50">
               <img src={image} alt="Target Plant" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
               <div className="absolute bottom-6 left-6">
                 <div className="px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                   {lang === 'en' ? 'Scanning Result' : 'स्कैनिंग परिणाम'}
                 </div>
               </div>
            </div>
          </div>
          <div className="md:w-3/5 p-8 sm:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              {isHealthy ? (
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Healthy' : 'स्वस्थ'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Treatment Needed' : 'उपचार आवश्यक'}</span>
                </div>
              )}
              <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-widest">Conf: {confidence}</div>
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight leading-none uppercase">{diseaseName}</h2>
            {scientificName && <p className="text-emerald-600/70 font-bold italic mb-6 tracking-wide">{scientificName}</p>}
            <p className="text-slate-500 font-medium leading-relaxed text-lg">{summary}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="glass-card p-10 rounded-[3rem] shadow-xl border-white/60">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{t.obs}</h3>
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center"><Icons.Alert /></div>
          </div>
          <ul className="space-y-4">
            {symptoms.map((s, idx) => (
              <li key={idx} className="flex gap-4 items-start group">
                <div className="mt-1.5 w-5 h-5 rounded-lg border-2 border-slate-200 group-hover:border-emerald-500 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 bg-slate-300 group-hover:bg-emerald-500 rounded-full"></div>
                </div>
                <span className="text-slate-600 font-medium text-base group-hover:text-slate-900 transition-colors">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-emerald-900 p-10 rounded-[3rem] shadow-2xl text-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black tracking-tight uppercase">{t.protocol}</h3>
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center"><Icons.Check /></div>
          </div>
          <div className="space-y-6">
            {treatmentSteps.map((step, idx) => (
              <div key={idx} className="flex gap-5 group">
                <span className="text-3xl font-black text-emerald-500 opacity-40 group-hover:opacity-100">{(idx + 1).toString().padStart(2, '0')}</span>
                <p className="text-emerald-100/90 font-medium text-base leading-snug pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass-card p-10 rounded-[3.5rem] shadow-xl border-white/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{t.products}</h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">{lang === 'en' ? 'Grounded & Validated Recommendations' : 'ग्राउंडेड और मान्य अनुशंसाएं'}</p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-[9px] font-black border border-emerald-100 uppercase tracking-widest shadow-sm">Verified Search</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {recommendedProducts.map((product, idx) => (
            <ProductCard key={idx} product={product} lang={lang} />
          ))}
        </div>

        {sources && sources.length > 0 && (
          <div className="pt-10 border-t border-slate-100">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">{lang === 'en' ? 'Verified Research Sources' : 'सत्यापित शोध स्रोत'}</h4>
            <div className="flex flex-wrap gap-4">
              {sources.map((src, i) => (
                <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-white transition-all group">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-500"></div>
                  <span className="text-xs font-black truncate max-w-[200px] tracking-tight">{src.title || 'Official Product Data'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-100"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="bg-slate-900 text-white p-10 sm:p-14 rounded-[4rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h3 className="text-3xl font-black mb-10 tracking-tight uppercase relative z-10">{t.prevention}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10 relative z-10">
          {preventiveMeasures.map((measure, idx) => (
            <div key={idx} className="flex gap-6 items-start group">
              <div className="w-12 h-12 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-all duration-700">
                <Icons.Check />
              </div>
              <p className="text-lg text-slate-400 group-hover:text-white transition-colors duration-500 leading-relaxed font-semibold">{measure}</p>
            </div>
          ))}
        </div>
      </section>

      <button onClick={onReset} className="w-full py-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-2xl rounded-[3rem] shadow-2xl shadow-emerald-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-6 uppercase tracking-tight">
        <div className="group-hover:rotate-180 transition-transform duration-1000"><Icons.Refresh /></div>
        {t.newDiag}
      </button>
    </div>
  );
};
