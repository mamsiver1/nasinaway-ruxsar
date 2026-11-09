import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-emerald-950/60 bg-[#070d0b] py-8 mt-16 text-center">
      <div className="max-w-7xl mx-auto px-4 space-y-2">
        {/* Minimal Chic SIVER IT Branding */}
        <div className="opacity-40 hover:opacity-80 transition-opacity duration-300">
          <p className="text-[11px] sm:text-xs font-light text-zinc-400 tracking-wide">
            دروستکراو لەلایەن سیڤەر ئایتی
          </p>
          <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-emerald-400/90 font-medium uppercase mt-0.5">
            SIVER IT
          </p>
        </div>

        <div className="opacity-25 text-[10px] text-zinc-500">
          ناسينەوەی ڕووخسار • هەڵسەنگاندنی بینراوی پارێزراو بەبێ هەژمار
        </div>
      </div>
    </footer>
  );
};
