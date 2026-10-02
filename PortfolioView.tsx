import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import { 
  Wallet, 
  Lock, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  PlusCircle, 
  Building, 
  ShieldCheck, 
  Award, 
  Clock, 
  Filter, 
  Search,
  CheckCircle2,
  AlertTriangle,
  Receipt
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { 
    wallet, 
    totalNetWorth, 
    totalInvestedStockValue, 
    transactions, 
    depositFunds, 
    withdrawFunds 
  } = useApp();

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('500');
  const [depositMethod, setDepositMethod] = useState('Wish Money Cash-In');
  const [withdrawAmount, setWithdrawAmount] = useState('200');
  const [withdrawBank, setWithdrawBank] = useState('Chase Bank (•••• 4921)');
  const [txFilter, setTxFilter] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount) || 0;
    if (val > 0) {
      depositFunds(val, depositMethod);
      setDepositModalOpen(false);
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount) || 0;
    const res = withdrawFunds(val, withdrawBank);
    if (res.success) {
      setWithdrawModalOpen(false);
    } else if (res.error) {
      alert(res.error);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (txFilter === 'all') return true;
    if (txFilter === 'vault') return t.type.includes('vault');
    if (txFilter === 'stock') return t.type.includes('stock');
    if (txFilter === 'transfer') return t.type.includes('transfer');
    if (txFilter === 'deposit') return t.type === 'deposit' || t.type === 'withdrawal';
    return true;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Net Worth Card & Asset Distribution */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Total Consolidated Net Worth
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1">
              ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-emerald-400 font-medium mt-0.5 block">
              ● All assets secured under 30-day discipline protocol
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDepositModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              Deposit
            </button>
            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Cash Out
            </button>
          </div>
        </div>

        {/* Visual Allocation Bar */}
        <div className="pt-2">
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            <div
              style={{ width: `${(wallet.availableCash / totalNetWorth) * 100}%` }}
              className="bg-teal-400 h-full"
              title={`Cash: ${((wallet.availableCash / totalNetWorth) * 100).toFixed(1)}%`}
            />
            <div
              style={{ width: `${(wallet.lockedInVaults / totalNetWorth) * 100}%` }}
              className="bg-emerald-500 h-full"
              title={`Locked Vaults: ${((wallet.lockedInVaults / totalNetWorth) * 100).toFixed(1)}%`}
            />
            <div
              style={{ width: `${(totalInvestedStockValue / totalNetWorth) * 100}%` }}
              className="bg-cyan-500 h-full"
              title={`Stocks: ${((totalInvestedStockValue / totalNetWorth) * 100).toFixed(1)}%`}
            />
          </div>

          {/* Allocation Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
                <span>Available Cash</span>
              </div>
              <span className="text-lg font-bold font-mono text-white">
                ${wallet.availableCash.toFixed(2)}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>30-Day Locked Vaults</span>
              </div>
              <span className="text-lg font-bold font-mono text-emerald-400">
                ${wallet.lockedInVaults.toFixed(2)}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                <span>Stocks & NVIDIA</span>
              </div>
              <span className="text-lg font-bold font-mono text-cyan-400">
                ${totalInvestedStockValue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discipline & Financial Health Scorecard */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Financial Discipline Rating</h4>
            <p className="text-xs text-slate-400">
              Active savings lock streak: <span className="text-emerald-400 font-bold">{wallet.streakDays} Days</span> without penalty forfeits.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Discipline Score</span>
            <span className="text-2xl font-black font-mono text-emerald-400">{wallet.disciplineScore} / 100</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 flex items-center justify-center font-bold text-xs text-white">
            Top 5%
          </div>
        </div>
      </div>

      {/* Complete Financial Ledger / Transaction History */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <h3 className="font-bold text-white text-base">All Ledger Activity</h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'vault', label: 'Vaults (Locks)' },
              { id: 'stock', label: 'Stock Trades' },
              { id: 'transfer', label: 'Wish Transfers' },
              { id: 'deposit', label: 'Cash Flow' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTxFilter(f.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium shrink-0 transition-all ${
                  txFilter === f.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Items */}
        <div className="grid grid-cols-1 gap-2.5">
          {filteredTransactions.map(tx => {
            const isNegative = tx.type === 'vault_lock' || tx.type === 'stock_buy' || tx.type === 'transfer_send' || tx.type === 'withdrawal';
            const isPenaltyTx = tx.type === 'vault_early_unlock';

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    isPenaltyTx ? 'bg-rose-500/20 text-rose-400' :
                    tx.type.includes('vault') ? 'bg-emerald-500/20 text-emerald-400' :
                    tx.type.includes('stock') ? 'bg-cyan-500/20 text-cyan-400' :
                    tx.type.includes('transfer') ? 'bg-teal-500/20 text-teal-400' :
                    'bg-slate-800 text-white'
                  }`}>
                    {isPenaltyTx ? <AlertTriangle className="w-4 h-4" /> :
                     tx.type.includes('vault') ? <Lock className="w-4 h-4" /> :
                     tx.type.includes('stock') ? <TrendingUp className="w-4 h-4" /> :
                     <Receipt className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white text-sm">{tx.target}</span>
                      {isPenaltyTx && (
                        <span className="text-[10px] font-bold px-1.5 rounded bg-rose-500/20 text-rose-400">
                          -10% Penalty Applied
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      {new Date(tx.timestamp).toLocaleString()} • {tx.note || tx.type}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-mono font-bold text-sm block ${
                    isNegative ? 'text-white' : 'text-emerald-400'
                  }`}>
                    {isNegative ? '-' : '+'}${tx.amount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Deposit Cash</h3>
            <form onSubmit={handleDeposit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Payment Method
                </label>
                <select
                  value={depositMethod}
                  onChange={e => setDepositMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Wish Money Cash-In">Wish Money Cash-In (Instant)</option>
                  <option value="Debit Card (•••• 8821)">Debit Card (•••• 8821)</option>
                  <option value="Bank Wire / ACH">Bank Wire / ACH</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositModalOpen(false)}
                  className="flex-1 bg-slate-800 text-white font-semibold py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-slate-950 font-bold py-2 rounded-xl text-xs"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Withdraw Cash</h3>
            <p className="text-xs text-slate-400">Available: ${wallet.availableCash.toFixed(2)}</p>
            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  min="10"
                  max={wallet.availableCash}
                  step="10"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Target Account
                </label>
                <select
                  value={withdrawBank}
                  onChange={e => setWithdrawBank(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Chase Bank (•••• 4921)">Chase Bank (•••• 4921)</option>
                  <option value="Bank of America (•••• 1029)">Bank of America (•••• 1029)</option>
                  <option value="Wish Merchant Outlet">Wish Merchant Outlet</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="flex-1 bg-slate-800 text-white font-semibold py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-slate-950 font-bold py-2 rounded-xl text-xs"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl">
            <div className="text-center pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Transaction Receipt</span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                ${selectedTx.amount.toFixed(2)}
              </div>
              <span className="text-xs text-emerald-400 font-semibold">{selectedTx.target}</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Receipt ID:</span>
                <span className="text-white">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Timestamp:</span>
                <span className="text-white">{new Date(selectedTx.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Category:</span>
                <span className="text-white uppercase">{selectedTx.type}</span>
              </div>
              {selectedTx.penalty && selectedTx.penalty > 0 && (
                <div className="flex justify-between text-rose-400 font-bold">
                  <span>Early Penalty (10%):</span>
                  <span>-${selectedTx.penalty.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Note:</span>
                <span className="text-white font-sans">{selectedTx.note || 'None'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
