import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { UserWallet, LockedVault, StockHolding, StockQuote, Transaction, WishContact } from '../types';
import { INITIAL_STOCKS, WISH_AXX_CONTACTS } from '../data/stocksData';
import confetti from 'canvas-confetti';
import { db, testFirebaseConnection } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AppContextType {
  wallet: UserWallet;
  vaults: LockedVault[];
  stocks: StockQuote[];
  holdings: StockHolding[];
  transactions: Transaction[];
  contacts: WishContact[];
  selectedStock: StockQuote | null;
  setSelectedStock: (stock: StockQuote | null) => void;
  activeTab: 'vault' | 'invest' | 'transfer' | 'portfolio';
  setActiveTab: (tab: 'vault' | 'invest' | 'transfer' | 'portfolio') => void;
  viewMode: 'mobile' | 'expanded';
  setViewMode: (mode: 'mobile' | 'expanded') => void;

  // Actions
  lockFunds: (amount: number, title: string, durationDays: number, category: LockedVault['category'], note?: string) => { success: boolean; error?: string };
  earlyUnlockVault: (vaultId: string) => { success: boolean; penaltyAmount: number; netPayout: number; error?: string };
  claimMatureVault: (vaultId: string) => { success: boolean; payoutAmount: number; interestEarned: number; error?: string };
  fastForwardVault: (vaultId: string, days: number) => void;
  buyStock: (symbol: string, dollarAmount: number) => { success: boolean; error?: string };
  sellStock: (symbol: string, sharesToSell: number) => { success: boolean; error?: string };
  sendTransfer: (recipientTag: string, recipientName: string, amount: number, note?: string) => { success: boolean; error?: string };
  depositFunds: (amount: number, method: string) => void;
  withdrawFunds: (amount: number, bank: string) => { success: boolean; error?: string };
  resetDemoData: () => void;

  // Computed
  totalNetWorth: number;
  totalInvestedStockValue: number;
  totalStockGainLoss: number;
  totalStockGainLossPercent: number;

  // Feedback notifications
  notification: { title: string; message: string; type: 'success' | 'warning' | 'info' | 'error' } | null;
  setNotification: (notif: { title: string; message: string; type: 'success' | 'warning' | 'info' | 'error' } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'apexvault_app_state_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Test Firebase on load
  useEffect(() => {
    testFirebaseConnection();
  }, []);

  // UI state
  const [activeTab, setActiveTab] = useState<'vault' | 'invest' | 'transfer' | 'portfolio'>('vault');
  const [viewMode, setViewMode] = useState<'mobile' | 'expanded'>('mobile');
  const [stocks, setStocks] = useState<StockQuote[]>(INITIAL_STOCKS);
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(INITIAL_STOCKS[0]); // Default to NVIDIA
  const [contacts] = useState<WishContact[]>(WISH_AXX_CONTACTS);
  const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'warning' | 'info' | 'error' } | null>(null);

  // Core financial state with localStorage initialization
  const [wallet, setWallet] = useState<UserWallet>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_wallet`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      userId: 'user_mansour_080',
      name: 'Mansour K.',
      email: 'mansourkamardine080@gmail.com',
      wishTag: '@mansour_axx',
      availableCash: 2850.00,
      lockedInVaults: 1000.00,
      investedInStocks: 1968.60,
      disciplineScore: 94,
      streakDays: 42,
    };
  });

  const [vaults, setVaults] = useState<LockedVault[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_vaults`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    const now = Date.now();
    const twelveDaysAgo = new Date(now - 12 * 24 * 3600 * 1000).toISOString();
    const eighteenDaysFromNow = new Date(now + 18 * 24 * 3600 * 1000).toISOString();
    return [
      {
        id: 'vault_demo_1',
        userId: 'user_mansour_080',
        title: '30-Day Tech Discipline Lock',
        principal: 1000.00,
        lockedAt: twelveDaysAgo,
        unlockDate: eighteenDaysFromNow,
        apy: 6.8,
        status: 'locked',
        penaltyRate: 0.10, // Strict 10% penalty
        category: 'Discipline',
        note: 'Committed funds for 30-day savings goal with 10% early exit fee.'
      }
    ];
  });

  const [holdings, setHoldings] = useState<StockHolding[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_holdings`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        symbol: 'NVDA',
        companyName: 'NVIDIA Corporation',
        shares: 9.0,
        avgBuyPrice: 134.20,
        totalCost: 1207.80,
      },
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        shares: 3.0,
        avgBuyPrice: 228.00,
        totalCost: 684.00,
      }
    ];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tx`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'tx_init_1',
        type: 'vault_lock',
        amount: 1000.00,
        penalty: 0,
        target: '30-Day Tech Discipline Lock',
        timestamp: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
        note: 'Locked with 10% early penalty condition',
        status: 'completed'
      },
      {
        id: 'tx_init_2',
        type: 'stock_buy',
        amount: 1207.80,
        target: 'NVIDIA (NVDA)',
        timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        note: 'Purchased 9 shares @ $134.20',
        status: 'completed'
      },
      {
        id: 'tx_init_3',
        type: 'transfer_send',
        amount: 45.00,
        target: '@wish_alex (Alex Carter)',
        timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        note: 'Dinner & coffee split via Wish Money',
        status: 'completed'
      }
    ];
  });

  // Keep state synced to localStorage and Firestore
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_wallet`, JSON.stringify(wallet));
    localStorage.setItem(`${STORAGE_KEY}_vaults`, JSON.stringify(vaults));
    localStorage.setItem(`${STORAGE_KEY}_holdings`, JSON.stringify(holdings));
    localStorage.setItem(`${STORAGE_KEY}_tx`, JSON.stringify(transactions));

    // Async save to Firestore in background if online
    if (db) {
      try {
        const userRef = doc(db, 'users', wallet.userId);
        setDoc(userRef, {
          userId: wallet.userId,
          name: wallet.name,
          email: wallet.email,
          wishTag: wallet.wishTag,
          availableCash: wallet.availableCash,
          lockedInVaults: wallet.lockedInVaults,
          investedInStocks: wallet.investedInStocks,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(() => { /* silent fallback */ });
      } catch (e) {
        // Offline fallback
      }
    }
  }, [wallet, vaults, holdings, transactions]);

  // Real-time market tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          // slight random tick between -0.4% and +0.4%
          const pct = (Math.random() - 0.49) * 0.005;
          const newPrice = +(stock.price * (1 + pct)).toFixed(2);
          const newChange = +(newPrice - (stock.price - stock.change)).toFixed(2);
          const newPct = +((newChange / (newPrice - newChange)) * 100).toFixed(2);

          const updatedHist = [...stock.history['1D']];
          if (updatedHist.length > 15) updatedHist.shift();
          updatedHist.push(newPrice);

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newPct,
            history: {
              ...stock.history,
              '1D': updatedHist
            }
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Sync selectedStock with latest stock price
  useEffect(() => {
    if (selectedStock) {
      const updated = stocks.find(s => s.symbol === selectedStock.symbol);
      if (updated && updated.price !== selectedStock.price) {
        setSelectedStock(updated);
      }
    }
  }, [stocks]);

  // Calculations for portfolio
  const { totalInvestedStockValue, totalStockGainLoss, totalStockGainLossPercent } = useMemo(() => {
    let totalVal = 0;
    let totalCost = 0;

    holdings.forEach(h => {
      const liveStock = stocks.find(s => s.symbol === h.symbol);
      const curPrice = liveStock ? liveStock.price : h.avgBuyPrice;
      totalVal += curPrice * h.shares;
      totalCost += h.totalCost;
    });

    const gainLoss = totalVal - totalCost;
    const gainPct = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

    return {
      totalInvestedStockValue: +totalVal.toFixed(2),
      totalStockGainLoss: +gainLoss.toFixed(2),
      totalStockGainLossPercent: +gainPct.toFixed(2)
    };
  }, [holdings, stocks]);

  const totalNetWorth = useMemo(() => {
    return +(wallet.availableCash + wallet.lockedInVaults + totalInvestedStockValue).toFixed(2);
  }, [wallet.availableCash, wallet.lockedInVaults, totalInvestedStockValue]);

  // Keep wallet.investedInStocks in sync with live valuations
  useEffect(() => {
    setWallet(w => {
      if (w.investedInStocks !== totalInvestedStockValue) {
        return { ...w, investedInStocks: totalInvestedStockValue };
      }
      return w;
    });
  }, [totalInvestedStockValue]);

  // --- ACTIONS ---

  // 1. Lock Funds (Strict minimum 30 days lock, with 10% penalty warning)
  const lockFunds = (
    amount: number,
    title: string,
    durationDays: number,
    category: LockedVault['category'],
    note?: string
  ) => {
    if (amount <= 0) {
      return { success: false, error: 'Please enter a valid amount to lock.' };
    }
    if (amount > wallet.availableCash) {
      return { success: false, error: `Insufficient available cash. You have $${wallet.availableCash.toFixed(2)}.` };
    }
    if (durationDays < 30) {
      return { success: false, error: 'Minimum lock duration is 30 days (1 month).' };
    }

    const now = new Date();
    const unlockDate = new Date(now.getTime() + durationDays * 24 * 3600 * 1000);

    // Yield rates by duration
    let apy = 6.5;
    if (durationDays >= 365) apy = 10.0;
    else if (durationDays >= 180) apy = 8.5;
    else if (durationDays >= 90) apy = 7.5;

    const newVault: LockedVault = {
      id: `vault_${Date.now()}`,
      userId: wallet.userId,
      title: title.trim() || 'Discipline Savings Lock',
      principal: +amount.toFixed(2),
      lockedAt: now.toISOString(),
      unlockDate: unlockDate.toISOString(),
      apy,
      status: 'locked',
      penaltyRate: 0.10, // 10% penalty
      category,
      note: note || `Strict ${durationDays}-day savings lock with 10% early exit protection.`
    };

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'vault_lock',
      amount: +amount.toFixed(2),
      target: newVault.title,
      timestamp: now.toISOString(),
      note: `Committed to 30-day lock. 10% penalty applies on early unlock.`,
      status: 'completed'
    };

    setWallet(w => ({
      ...w,
      availableCash: +(w.availableCash - amount).toFixed(2),
      lockedInVaults: +(w.lockedInVaults + amount).toFixed(2),
      disciplineScore: Math.min(100, w.disciplineScore + 3)
    }));

    setVaults(v => [newVault, ...v]);
    setTransactions(t => [newTx, ...t]);

    // Celebration
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });

    setNotification({
      title: 'Funds Locked Successfully! 🔒',
      message: `$${amount.toFixed(2)} is locked until ${unlockDate.toLocaleDateString()} (10% penalty applies if withdrawn early).`,
      type: 'success'
    });

    return { success: true };
  };

  // 2. Early Unlock Vault (Strict 10% penalty deducted!)
  const earlyUnlockVault = (vaultId: string) => {
    const vault = vaults.find(v => v.id === vaultId);
    if (!vault) {
      return { success: false, penaltyAmount: 0, netPayout: 0, error: 'Vault not found' };
    }
    if (vault.status !== 'locked') {
      return { success: false, penaltyAmount: 0, netPayout: 0, error: 'Vault is already unlocked' };
    }

    const now = new Date();
    const unlockTime = new Date(vault.unlockDate).getTime();
    const isMatured = now.getTime() >= unlockTime;

    if (isMatured) {
      // If already matured, claim mature vault and format return
      const res = claimMatureVault(vaultId);
      return { 
        success: res.success, 
        penaltyAmount: 0, 
        netPayout: res.payoutAmount, 
        error: res.error 
      };
    }

    // STRICT 10% PENALTY CALCULATION
    const penaltyRate = 0.10;
    const penaltyAmount = +(vault.principal * penaltyRate).toFixed(2);
    const netPayout = +(vault.principal - penaltyAmount).toFixed(2);

    const nowIso = now.toISOString();

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'vault_early_unlock',
      amount: netPayout,
      penalty: penaltyAmount,
      target: `${vault.title} (Early Exit -10%)`,
      timestamp: nowIso,
      note: `10% early withdrawal penalty of -$${penaltyAmount.toFixed(2)} applied. Recovered $${netPayout.toFixed(2)}.`,
      status: 'completed'
    };

    setWallet(w => ({
      ...w,
      availableCash: +(w.availableCash + netPayout).toFixed(2),
      lockedInVaults: +(w.lockedInVaults - vault.principal).toFixed(2),
      disciplineScore: Math.max(50, w.disciplineScore - 8)
    }));

    setVaults(prev =>
      prev.map(v =>
        v.id === vaultId
          ? {
              ...v,
              status: 'unlocked_early',
              penaltyPaid: penaltyAmount,
              payoutAmount: netPayout
            }
          : v
      )
    );

    setTransactions(t => [newTx, ...t]);

    setNotification({
      title: 'Early Exit Processed (10% Penalty Applied)',
      message: `Deducted 10% penalty (-$${penaltyAmount.toFixed(2)}). $${netPayout.toFixed(2)} returned to your available cash.`,
      type: 'warning'
    });

    return { success: true, penaltyAmount, netPayout };
  };

  // 3. Claim Mature Vault (Penalty-free + accrued interest!)
  const claimMatureVault = (vaultId: string) => {
    const vault = vaults.find(v => v.id === vaultId);
    if (!vault) {
      return { success: false, payoutAmount: 0, interestEarned: 0, error: 'Vault not found' };
    }

    const lockedTime = new Date(vault.lockedAt).getTime();
    const unlockTime = new Date(vault.unlockDate).getTime();
    const durationDays = Math.max(30, (unlockTime - lockedTime) / (24 * 3600 * 1000));

    // Calculate accrued APY interest: principal * (apy / 100) * (durationDays / 365)
    const interestEarned = +(vault.principal * (vault.apy / 100) * (durationDays / 365)).toFixed(2);
    const payoutAmount = +(vault.principal + interestEarned).toFixed(2);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'vault_mature_claim',
      amount: payoutAmount,
      target: `${vault.title} (Matured 100%)`,
      timestamp: new Date().toISOString(),
      note: `Full lock completed! Principal $${vault.principal.toFixed(2)} + $${interestEarned.toFixed(2)} interest accrued. Zero penalty!`,
      status: 'completed'
    };

    setWallet(w => ({
      ...w,
      availableCash: +(w.availableCash + payoutAmount).toFixed(2),
      lockedInVaults: +(w.lockedInVaults - vault.principal).toFixed(2),
      disciplineScore: Math.min(100, w.disciplineScore + 5),
      streakDays: w.streakDays + 30
    }));

    setVaults(prev =>
      prev.map(v =>
        v.id === vaultId
          ? {
              ...v,
              status: 'matured',
              payoutAmount,
              penaltyPaid: 0
            }
          : v
      )
    );

    setTransactions(t => [newTx, ...t]);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    setNotification({
      title: 'Vault Matured! Full Payout Claimed 🎉',
      message: `Zero penalty! Claimed $${payoutAmount.toFixed(2)} ($${vault.principal.toFixed(2)} principal + $${interestEarned.toFixed(2)} yield).`,
      type: 'success'
    });

    return { success: true, payoutAmount, interestEarned };
  };

  // 4. Test Helper: Fast-forward a vault by X days
  const fastForwardVault = (vaultId: string, days: number) => {
    setVaults(prev =>
      prev.map(v => {
        if (v.id === vaultId) {
          // Shift lockedAt backwards so more days have elapsed
          const oldLockedAt = new Date(v.lockedAt).getTime();
          const newLockedAt = new Date(oldLockedAt - days * 24 * 3600 * 1000).toISOString();
          const oldUnlock = new Date(v.unlockDate).getTime();
          const newUnlock = new Date(oldUnlock - days * 24 * 3600 * 1000).toISOString();
          return {
            ...v,
            lockedAt: newLockedAt,
            unlockDate: newUnlock
          };
        }
        return v;
      })
    );

    setNotification({
      title: 'Time Machine Fast-Forward ⏩',
      message: `Advanced vault timeline by ${days} days to test lock/maturity conditions!`,
      type: 'info'
    });
  };

  // 5. Buy Stock (e.g. NVIDIA or others)
  const buyStock = (symbol: string, dollarAmount: number) => {
    if (dollarAmount <= 0) {
      return { success: false, error: 'Enter a valid investment amount.' };
    }
    if (dollarAmount > wallet.availableCash) {
      return { success: false, error: `Insufficient cash. Available: $${wallet.availableCash.toFixed(2)}.` };
    }

    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) {
      return { success: false, error: 'Stock not found' };
    }

    const sharesPurchased = +(dollarAmount / stock.price).toFixed(4);

    setWallet(w => ({
      ...w,
      availableCash: +(w.availableCash - dollarAmount).toFixed(2),
      investedInStocks: +(w.investedInStocks + dollarAmount).toFixed(2)
    }));

    setHoldings(prev => {
      const existing = prev.find(h => h.symbol === symbol);
      if (existing) {
        const totalShares = +(existing.shares + sharesPurchased).toFixed(4);
        const totalCost = +(existing.totalCost + dollarAmount).toFixed(2);
        const avgBuyPrice = +(totalCost / totalShares).toFixed(2);
        return prev.map(h =>
          h.symbol === symbol
            ? { ...h, shares: totalShares, totalCost, avgBuyPrice }
            : h
        );
      } else {
        return [
          ...prev,
          {
            symbol,
            companyName: stock.name,
            shares: sharesPurchased,
            avgBuyPrice: stock.price,
            totalCost: +dollarAmount.toFixed(2)
          }
        ];
      }
    });

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'stock_buy',
      amount: +dollarAmount.toFixed(2),
      target: `${stock.name} (${stock.symbol})`,
      timestamp: new Date().toISOString(),
      note: `Bought ${sharesPurchased} shares @ $${stock.price.toFixed(2)}`,
      status: 'completed'
    };

    setTransactions(t => [newTx, ...t]);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    setNotification({
      title: `Invested in ${stock.symbol} 📈`,
      message: `Purchased ${sharesPurchased} shares of ${stock.name} for $${dollarAmount.toFixed(2)}.`,
      type: 'success'
    });

    return { success: true };
  };

  // 6. Sell Stock
  const sellStock = (symbol: string, sharesToSell: number) => {
    const holding = holdings.find(h => h.symbol === symbol);
    if (!holding || holding.shares <= 0) {
      return { success: false, error: 'You do not own any shares of this stock.' };
    }
    if (sharesToSell <= 0 || sharesToSell > holding.shares) {
      return { success: false, error: `Invalid share amount. You own ${holding.shares} shares.` };
    }

    const stock = stocks.find(s => s.symbol === symbol);
    const price = stock ? stock.price : holding.avgBuyPrice;
    const proceeds = +(sharesToSell * price).toFixed(2);

    setWallet(w => ({
      ...w,
      availableCash: +(w.availableCash + proceeds).toFixed(2),
      investedInStocks: Math.max(0, +(w.investedInStocks - proceeds).toFixed(2))
    }));

    setHoldings(prev =>
      prev
        .map(h => {
          if (h.symbol === symbol) {
            const remShares = +(h.shares - sharesToSell).toFixed(4);
            const remCost = +(h.avgBuyPrice * remShares).toFixed(2);
            return {
              ...h,
              shares: remShares,
              totalCost: remCost
            };
          }
          return h;
        })
        .filter(h => h.shares > 0.0001)
    );

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'stock_sell',
      amount: proceeds,
      target: `${holding.companyName} (${symbol})`,
      timestamp: new Date().toISOString(),
      note: `Sold ${sharesToSell} shares @ $${price.toFixed(2)}`,
      status: 'completed'
    };

    setTransactions(t => [newTx, ...t]);

    setNotification({
      title: `Sold ${symbol} Shares 💵`,
      message: `Sold ${sharesToSell} shares for $${proceeds.toFixed(2)}. Funds added to Cash.`,
      type: 'success'
    });

    return { success: true };
  };

  // 7. Send Instant Transfer (Wish Money / Axx)
  const sendTransfer = (
    recipientTag: string,
    recipientName: string,
    amount: number,
    note?: string
  ) => {
    if (amount <= 0) {
      return { success: false, error: 'Enter a valid amount to send.' };
    }
    if (amount > wallet.availableCash) {
      return { success: false, error: `Insufficient funds. Available: $${wallet.availableCash.toFixed(2)}.` };
    }

    const cleanTag = recipientTag.startsWith('@') ? recipientTag : `@${recipientTag}`;

    setWallet(w => ({
      ...w,
      availableCash: +(w.availableCash - amount).toFixed(2)
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'transfer_send',
      amount: +amount.toFixed(2),
      fee: 0, // Free P2P transfers
      target: `${cleanTag} (${recipientName || 'Wish Contact'})`,
      timestamp: new Date().toISOString(),
      note: note || 'Instant Wish Money transfer',
      status: 'completed'
    };

    setTransactions(t => [newTx, ...t]);

    setNotification({
      title: 'Money Sent via Wish / Axx 💸',
      message: `Successfully sent $${amount.toFixed(2)} to ${cleanTag}. Instant zero-fee delivery!`,
      type: 'success'
    });

    return { success: true };
  };

  // 8. Deposit Funds
  const depositFunds = (amount: number, method: string) => {
    if (amount <= 0) return;

    setWallet(w => ({
      ...w,
      availableCash: +(w.availableCash + amount).toFixed(2)
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount: +amount.toFixed(2),
      target: `Deposit (${method})`,
      timestamp: new Date().toISOString(),
      note: `Added funds via ${method}`,
      status: 'completed'
    };

    setTransactions(t => [newTx, ...t]);

    setNotification({
      title: 'Deposit Successful 💳',
      message: `Added $${amount.toFixed(2)} to your available cash.`,
      type: 'success'
    });
  };

  // 9. Withdraw Funds
  const withdrawFunds = (amount: number, bank: string) => {
    if (amount <= 0) return { success: false, error: 'Enter a valid withdrawal amount.' };
    if (amount > wallet.availableCash) return { success: false, error: 'Insufficient available cash.' };

    setWallet(w => ({
      ...w,
      availableCash: +(w.availableCash - amount).toFixed(2)
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'withdrawal',
      amount: +amount.toFixed(2),
      target: `Bank Withdrawal (${bank})`,
      timestamp: new Date().toISOString(),
      note: `Transferred to ${bank}`,
      status: 'completed'
    };

    setTransactions(t => [newTx, ...t]);

    setNotification({
      title: 'Withdrawal Initiated 🏦',
      message: `$${amount.toFixed(2)} transferred to ${bank}.`,
      type: 'success'
    });

    return { success: true };
  };

  // Reset Demo
  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_wallet`);
    localStorage.removeItem(`${STORAGE_KEY}_vaults`);
    localStorage.removeItem(`${STORAGE_KEY}_holdings`);
    localStorage.removeItem(`${STORAGE_KEY}_tx`);
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        wallet,
        vaults,
        stocks,
        holdings,
        transactions,
        contacts,
        selectedStock,
        setSelectedStock,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        lockFunds,
        earlyUnlockVault,
        claimMatureVault,
        fastForwardVault,
        buyStock,
        sellStock,
        sendTransfer,
        depositFunds,
        withdrawFunds,
        resetDemoData,
        totalNetWorth,
        totalInvestedStockValue,
        totalStockGainLoss,
        totalStockGainLossPercent,
        notification,
        setNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
