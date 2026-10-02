/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { VaultView } from './components/VaultView';
import { InvestView } from './components/InvestView';
import { TransferView } from './components/TransferView';
import { PortfolioView } from './components/PortfolioView';
import { NotificationToast } from './components/NotificationToast';
import { Wifi, Battery, Signal, Lock, TrendingUp, Send, Wallet, ShieldAlert } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, viewMode, setViewMode } = useApp();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'vault':
        return <VaultView />;
      case 'invest':
        return <InvestView />;
      case 'transfer':
        return <TransferView />;
      case 'portfolio':
        return <PortfolioView />;
      default:
        return <VaultView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <NotificationToast />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 w-full max-w-7xl mx-auto">
        {viewMode === 'mobile' ? (
          /* Mobile React Native Frame Simulation */
          <div className="w-full flex flex-col items-center my-auto py-2">
            <div className="w-full max-w-[420px] rounded-[44px] bg-slate-900 border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[850px] max-h-[92vh] relative ring-1 ring-slate-700/50">
              
              {/* Phone Status Bar (Dynamic Island & Carrier Icons) */}
              <div className="bg-slate-900 px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none z-20 shrink-0">
                <span className="font-mono text-white text-[12px]">{currentTime || '09:41'}</span>
                
                {/* Dynamic Island Pill */}
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-300 font-mono">ApexVault</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Scrollable Mobile App Screen */}
              <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24 scrollbar-none bg-slate-950">
                {renderActiveTab()}
              </div>

              {/* Native Bottom Tab Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 pt-1 pb-4 px-2">
                <BottomNav />
                {/* iOS Home Indicator Bar */}
                <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
              </div>
            </div>

            {/* Quick helper tip below mobile phone */}
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span>React Native Mobile View Simulator</span>
              <span>•</span>
              <button
                onClick={() => setViewMode('expanded')}
                className="text-emerald-400 hover:underline font-medium"
              >
                Switch to Expanded Desktop View
              </button>
            </div>
          </div>
        ) : (
          /* Expanded Full-Width Desktop / Tablet View */
          <div className="w-full max-w-5xl space-y-6">
            {/* Desktop Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {[
                  { id: 'vault' as const, label: '30-Day Lock Vault', icon: Lock, badge: 'Strict 10% Rule' },
                  { id: 'invest' as const, label: 'Stock Investing', icon: TrendingUp, badge: 'NVIDIA NVDA' },
                  { id: 'transfer' as const, label: 'Wish & Axx Transfers', icon: Send },
                  { id: 'portfolio' as const, label: 'Wallet & Ledger', icon: Wallet }
                ].map(t => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                      {t.badge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {t.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <span className="text-xs text-slate-400 hidden lg:inline">
                Discipline-first Fintech Architecture
              </span>
            </div>

            <div className="min-h-[600px]">
              {renderActiveTab()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
