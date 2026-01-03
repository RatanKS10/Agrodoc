
import React from 'react';
import { BRAND_LOGOS } from '../constants.tsx';

export const BrandCarousel: React.FC = () => {
  const brands = Object.entries(BRAND_LOGOS);
  
  return (
    <div className="w-full overflow-hidden bg-white/30 py-12 border-y border-emerald-100/50">
      <div className="flex whitespace-nowrap animate-scroll">
        {[...Array(2)].map((_, groupIdx) => (
          <div key={groupIdx} className="flex gap-20 items-center px-10">
            {brands.map(([name, path]) => (
              <div key={name} className="flex flex-col items-center gap-2 group cursor-pointer grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <img 
                  src={path} 
                  alt={name} 
                  className="h-12 w-auto object-contain drop-shadow-sm" 
                  onError={(e) => {
                    // Fallback to text if local image is missing
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.innerText = name;
                      span.className = 'font-black text-slate-400 uppercase tracking-widest text-lg';
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
