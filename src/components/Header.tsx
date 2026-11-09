import React from 'react';
import { ScanFace, GitCompare, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'analyze' | 'compare';
  setActiveTab: (tab: 'analyze' | 'compare') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-emerald-950/70 bg-[#09100d]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and App Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-900/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b1410] rounded-[15px] flex items-center justify-center">
                <ScanFace className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  ناسينەوەی ڕووخسار
                  <span className="hidden sm:inline-flex text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Vision AI
                  </span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/60 font-normal">
                شیکردنەوەی ڕووخسار و هەڵسوکەوتی بینراو لە وێنە
              </p>
            </div>
          </div>

          {/* Center / Navigation Tabs */}
          <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-[#060c0a] border border-emerald-900/40">
            <button
              type="button"
              onClick={() => setActiveTab('analyze')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'analyze'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <ScanFace className="w-4 h-4" />
              <span>شیکردنەوە</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'compare'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>بەراوردکردن</span>
            </button>
          </nav>

          {/* Privacy & No-Login Badge */}
          <div className="hidden md:flex items-center gap-2 text-xs text-emerald-300/80 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">دەستپێکردنی ڕاستەوخۆ (بێ هەژمار)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
