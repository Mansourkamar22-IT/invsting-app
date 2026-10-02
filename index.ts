export interface UserWallet {
  userId: string;
  name: string;
  email: string;
  wishTag: string;
  availableCash: number;
  lockedInVaults: number;
  investedInStocks: number;
  disciplineScore: number;
  streakDays: number;
}

export interface LockedVault {
  id: string;
  userId: string;
  title: string;
  principal: number;
  lockedAt: string; // ISO string
  unlockDate: string; // ISO string (at least 30 days)
  apy: number;
  status: 'locked' | 'matured' | 'unlocked_early';
  penaltyRate: number; // 0.10 (10%)
  penaltyPaid?: number;
  payoutAmount?: number;
  category: 'Discipline' | 'Emergency' | 'High Yield' | 'Milestone' | 'Custom';
  note?: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
  marketCap: string;
  peRatio: number;
  volume: string;
  category: string;
  description: string;
  history: {
    '1D': number[];
    '1W': number[];
    '1M': number[];
    '1Y': number[];
  };
}

export interface StockHolding {
  symbol: string;
  companyName: string;
  shares: number;
  avgBuyPrice: number;
  totalCost: number;
}

export interface Transaction {
  id: string;
  type: 
    | 'vault_lock' 
    | 'vault_early_unlock' 
    | 'vault_mature_claim' 
    | 'stock_buy' 
    | 'stock_sell' 
    | 'transfer_send' 
    | 'transfer_receive' 
    | 'deposit' 
    | 'withdrawal';
  amount: number;
  fee?: number;
  penalty?: number;
  target: string;
  timestamp: string;
  note?: string;
  status: 'completed' | 'pending';
}

export interface WishContact {
  tag: string;
  name: string;
  avatar: string;
  phone: string;
  network: string;
}
