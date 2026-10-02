import React from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Monitor, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  const { wallet, totalNetWorth, viewMode, setViewMode, resetDemoData, setActiveTab } = useApp();

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand & User Tag */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('vault')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-slate-950 font-black text-xl tracking-tighter">AV</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight">ApexVault</span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                  30D LOCK
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <span className="text-emerald-400 font-mono font-medium">{wallet.wishTag}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400">Wish & Axx Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Quick Net Worth glance */}
        <div className="hidden sm:flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Total Net Worth</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white font-mono">
              ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> +4.2%
            </span>
          </div>
        </div>

        {/* Right: Controls & View switcher */}
        <div className="flex items-center gap-2">
          {/* View mode toggle: Mobile simulator vs Expanded desktop */}
          <div className="bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 flex items-center">
            <button
              onClick={() => setViewMode('mobile')}
              title="React Native Mobile View"
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'mobile'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
            <button
              onClick={() => setViewMode('expanded')}
              title="Expanded Desktop View"
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'expanded'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Expanded</span>
            </button>
          </div>

          <button
            onClick={resetDemoData}
            title="Reset to initial state"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
