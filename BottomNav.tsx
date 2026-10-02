import React from 'react';
import { useApp } from '../context/AppContext';
import { Lock, TrendingUp, Send, Wallet } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, vaults } = useApp();

  const activeLocksCount = vaults.filter(v => v.status === 'locked').length;

  const tabs = [
    {
      id: 'vault' as const,
      label: 'Lock Vault',
      icon: Lock,
      badge: activeLocksCount > 0 ? activeLocksCount : undefined,
      description: '30-Day Savings'
    },
    {
      id: 'invest' as const,
      label: 'Invest',
      icon: TrendingUp,
      badge: 'NVDA',
      description: 'NVIDIA & Stocks'
    },
    {
      id: 'transfer' as const,
      label: 'Transfer',
      icon: Send,
      description: 'Wish & Axx'
    },
    {
      id: 'portfolio' as const,
      label: 'Wallet',
      icon: Wallet,
      description: 'Net Worth'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1 max-w-lg mx-auto sm:max-w-xl md:max-w-none md:static md:bg-transparent md:border-none md:py-0">
      <div className="flex items-center justify-around md:justify-center md:gap-4 max-w-md mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {/* Active glow pill */}
              {isActive && (
                <span className="absolute inset-0 bg-emerald-500/10 rounded-xl border border-emerald-500/30" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-emerald-400 stroke-[2.2]' : ''}`} />
                {tab.badge && (
                  <span className={`absolute -top-1.5 -right-3 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                    typeof tab.badge === 'string'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-1 font-medium tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
