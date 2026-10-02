import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LockedVault } from '../types';
import { 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Calendar, 
  HelpCircle,
  CheckCircle2,
  FastForward,
  Info,
  DollarSign,
  ChevronRight
} from 'lucide-react';

export const VaultView: React.FC = () => {
  const { 
    wallet, 
    vaults, 
    lockFunds, 
    earlyUnlockVault, 
    claimMatureVault, 
    fastForwardVault 
  } = useApp();

  // Create form state
  const [amount, setAmount] = useState<string>('500');
  const [title, setTitle] = useState<string>('');
  const [durationDays, setDurationDays] = useState<number>(30); // 30-day minimum!
  const [category, setCategory] = useState<LockedVault['category']>('Discipline');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Early unlock confirmation modal
  const [vaultToUnlockEarly, setVaultToUnlockEarly] = useState<LockedVault | null>(null);

  const numAmount = parseFloat(amount) || 0;
  const earlyPenaltyAmount = +(numAmount * 0.10).toFixed(2);
  const earlyPayoutEstimate = +(numAmount - earlyPenaltyAmount).toFixed(2);

  const apyRate = durationDays >= 365 ? 10.0 : durationDays >= 180 ? 8.5 : durationDays >= 90 ? 7.5 : 6.5;
  const estimatedInterest = +((numAmount * (apyRate / 100) * (durationDays / 365))).toFixed(2);

  // Calculate target unlock date
  const targetDate = new Date(Date.now() + durationDays * 24 * 3600 * 1000);

  const handleCreateLock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('You must accept the strict 30-day lock-in terms and the 10% early withdrawal penalty.');
      return;
    }
    const res = lockFunds(numAmount, title || `${category} Lock Vault`, durationDays, category);
    if (res.success) {
      setTitle('');
      setAgreeTerms(false);
      setShowConfirmModal(false);
    } else if (res.error) {
      alert(res.error);
    }
  };

  const activeVaults = vaults.filter(v => v.status === 'locked');
  const pastVaults = vaults.filter(v => v.status !== 'locked');

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Hero Banner: 30-Day Rule & 10% Penalty Explained */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 p-5 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Strict Discipline Protocol
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              30-Day Time-Locked Savings
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Lock in your funds for a minimum of <span className="text-white font-semibold underline decoration-emerald-400">1 month (30 days)</span> to build unbreakable saving discipline. If you break the lock early, a <span className="text-rose-400 font-bold">10% penalty fee</span> is strictly forfeited.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 sm:text-right min-w-[160px]">
            <span className="text-xs text-slate-400 block font-medium">Currently Locked</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              ${wallet.lockedInVaults.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center sm:justify-end gap-1">
              <span>{activeVaults.length} Active Vault{activeVaults.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800 text-xs">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-white font-semibold block">Minimum 1 Month</span>
              <span className="text-slate-400 text-[11px]">Strict 30-day time lock</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-white font-semibold block">10% Early Exit Fee</span>
              <span className="text-slate-400 text-[11px]">Deducted if unlocked early</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800 text-xs">
            <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-white font-semibold block">6.5% - 10.0% APY</span>
              <span className="text-slate-400 text-[11px]">Full yield upon maturity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Creation Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Lock In Money</h3>
              <p className="text-xs text-slate-400">Available to lock: <span className="font-mono text-emerald-400 font-semibold">${wallet.availableCash.toFixed(2)}</span></p>
            </div>
          </div>

          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Min. 30 Days
          </span>
        </div>

        <form onSubmit={handleCreateLock} className="space-y-4">
          {/* Amount input & presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Deposit Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
              <input
                type="number"
                min="10"
                max={wallet.availableCash}
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white text-lg font-mono font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* Quick amount presets */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[100, 250, 500, 1000, 2000].map(val => (
                <button
                  type="button"
                  key={val}
                  disabled={val > wallet.availableCash}
                  onClick={() => setAmount(val.toString())}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${
                    amount === val.toString()
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none'
                  }`}
                >
                  ${val}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(Math.floor(wallet.availableCash).toString())}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950/60 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Max Cash
              </button>
            </div>
          </div>

          {/* Goal Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Vault Purpose (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. NVIDIA Dip Fund, Emergency Reserve"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Discipline">Discipline Vault (No Impulse Spending)</option>
                <option value="Emergency">Emergency Reserve</option>
                <option value="High Yield">High-Yield Growth</option>
                <option value="Milestone">Milestone Goal</option>
                <option value="Custom">Custom Target</option>
              </select>
            </div>
          </div>

          {/* Lock Duration (Minimum 30 Days mandatory) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Lock Duration (Minimum 30 Days Required)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { days: 30, label: '30 Days', sub: '1 Month (Min)', apy: '6.5%' },
                { days: 90, label: '90 Days', sub: '3 Months', apy: '7.5%' },
                { days: 180, label: '180 Days', sub: '6 Months', apy: '8.5%' },
                { days: 365, label: '1 Year', sub: '12 Months', apy: '10.0%' },
              ].map(opt => (
                <button
                  type="button"
                  key={opt.days}
                  onClick={() => setDurationDays(opt.days)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    durationDays === opt.days
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{opt.label}</span>
                    <span className="text-[10px] font-bold text-emerald-400">{opt.apy}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Math & Strict Warning Breakdown */}
          <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" /> Maturity Date:
              </span>
              <span className="font-semibold text-white">
                {targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({durationDays} days)
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" /> Full Maturity Payout:
              </span>
              <span className="font-mono font-bold text-emerald-400">
                ${(numAmount + estimatedInterest).toFixed(2)} (Principal + ${estimatedInterest.toFixed(2)} interest)
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-rose-300/90 bg-rose-950/20 p-2 rounded-lg border border-rose-900/30">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-400 block">Strict 10% Early Exit Rule:</span>
                <span>
                  If unlocked before {targetDate.toLocaleDateString()}, you forfeit <strong className="text-rose-300">10% (-${earlyPenaltyAmount.toFixed(2)})</strong> and recover only <strong className="text-white">${earlyPayoutEstimate.toFixed(2)}</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Mandatory Agreement Checkbox */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 focus:ring-offset-slate-950"
            />
            <span className="text-xs text-slate-300 leading-relaxed">
              I agree to lock <span className="font-semibold text-white font-mono">${numAmount || 0}</span> for at least <span className="font-semibold text-white">30 days</span>. I acknowledge and accept that breaking this lock early will automatically forfeit <span className="font-bold text-rose-400">10% (-${earlyPenaltyAmount.toFixed(2)})</span> of my principal.
            </span>
          </label>

          {/* Lock Action Button */}
          <button
            type="submit"
            disabled={!agreeTerms || numAmount <= 0 || numAmount > wallet.availableCash}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all text-sm tracking-wide uppercase"
          >
            <Lock className="w-4 h-4 stroke-[2.5]" />
            Lock In ${numAmount > 0 ? numAmount.toFixed(2) : '0.00'} For {durationDays} Days
          </button>
        </form>
      </div>

      {/* Active Locks Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Your Active Locked Vaults</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              {activeVaults.length} Active
            </span>
          </div>
          <span className="text-xs text-slate-400">Auto-updating countdowns</span>
        </div>

        {activeVaults.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Lock className="w-6 h-6" />
            </div>
            <p className="text-slate-300 font-semibold text-sm">No active locked vaults</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start locking in funds above to eliminate impulse spending and earn guaranteed yield.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeVaults.map(vault => {
              const now = Date.now();
              const lockedTime = new Date(vault.lockedAt).getTime();
              const unlockTime = new Date(vault.unlockDate).getTime();
              const totalDurationMs = unlockTime - lockedTime;
              const elapsedMs = Math.max(0, now - lockedTime);
              const progressPct = Math.min(100, Math.floor((elapsedMs / totalDurationMs) * 100));

              const isMatured = now >= unlockTime;
              const remainingMs = Math.max(0, unlockTime - now);
              const remainingDays = Math.ceil(remainingMs / (24 * 3600 * 1000));
              const remainingHours = Math.floor((remainingMs % (24 * 3600 * 1000)) / (3600 * 1000));

              const penalty10Pct = +(vault.principal * 0.10).toFixed(2);
              const earlyPayout = +(vault.principal - penalty10Pct).toFixed(2);

              return (
                <div
                  key={vault.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg transition-all hover:border-slate-700"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base tracking-tight">{vault.title}</h4>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {vault.category}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">
                        Locked on {new Date(vault.lockedAt).toLocaleDateString()} • Matures on {new Date(vault.unlockDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between items-center">
                      <span className="text-xs text-slate-400">Principal Locked</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">
                        ${vault.principal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Progress & Countdown */}
                  <div className="py-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {isMatured ? (
                          <span className="text-emerald-400 font-bold">Matured & Ready!</span>
                        ) : (
                          <span>
                            Remaining: <strong className="text-white font-mono">{remainingDays}d {remainingHours}h</strong>
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-slate-400 text-xs">{progressPct}% elapsed</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isMatured ? 'bg-emerald-400' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Penalty Status Card */}
                  <div className={`p-3 rounded-xl border text-xs mb-3.5 ${
                    isMatured
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                  }`}>
                    {isMatured ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-bold block">30-Day Lock Complete! Zero Penalty (0%).</span>
                          <span className="text-slate-300 text-[11px]">You can now claim your principal plus full accrued interest penalty-free.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-rose-400 block">Strict 10% Penalty Active</span>
                          <span className="text-slate-300 text-[11px]">
                            If unlocked today, you forfeit <strong className="text-rose-400">10% (-${penalty10Pct.toFixed(2)})</strong> and recover <strong className="text-white">${earlyPayout.toFixed(2)}</strong>.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Simulation Tool */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {/* Test tool: fast forward 30 days */}
                    <button
                      type="button"
                      onClick={() => fastForwardVault(vault.id, 30)}
                      title="Fast-forward time by 30 days to test zero-penalty maturity claim"
                      className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
                    >
                      <FastForward className="w-3.5 h-3.5 text-cyan-400" />
                      <span>+30 Days (Demo)</span>
                    </button>

                    <div className="flex items-center gap-2 ml-auto">
                      {isMatured ? (
                        <button
                          type="button"
                          onClick={() => claimMatureVault(vault.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          Claim Full Payout (${vault.principal.toFixed(2)} + Yield)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setVaultToUnlockEarly(vault)}
                          className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          Break Lock Early (-10% Penalty)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Vault History (Matured & Early Unlocked) */}
      {pastVaults.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="font-bold text-white text-base">Completed Vaults History</h3>
          <div className="grid grid-cols-1 gap-2.5">
            {pastVaults.map(v => (
              <div
                key={v.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                    v.status === 'matured' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {v.status === 'matured' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-semibold text-white block">{v.title}</span>
                    <span className="text-slate-400 text-[11px]">
                      {v.status === 'matured' ? 'Held for 30+ days without breach' : 'Unlocked early before 30 days'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-white block">
                    ${v.payoutAmount?.toFixed(2) || v.principal.toFixed(2)}
                  </span>
                  <span className={`text-[10px] font-semibold ${
                    v.status === 'matured' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {v.status === 'matured' ? 'Zero Penalty' : `-10% Penalty (-$${v.penaltyPaid?.toFixed(2)})`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Confirm Early Unlock with 10% Penalty */}
      {vaultToUnlockEarly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Early Withdrawal</h3>
                <span className="text-xs text-rose-400">Strict 10% Penalty Will Apply</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You committed to locking <strong className="text-white">${vaultToUnlockEarly.principal.toFixed(2)}</strong> for at least 30 days to build financial discipline. Withdrawing today will break your streak and forfeit <strong className="text-rose-400">10%</strong>.
            </p>

            {/* Breakdown box */}
            <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Principal Amount:</span>
                <span className="text-white">${vaultToUnlockEarly.principal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-400 font-semibold">
                <span>Early Exit Penalty (10%):</span>
                <span>-${(vaultToUnlockEarly.principal * 0.10).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-emerald-400 font-bold text-sm">
                <span>Net Recovered Cash:</span>
                <span>${(vaultToUnlockEarly.principal * 0.90).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVaultToUnlockEarly(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors"
              >
                Keep Money Locked
              </button>
              <button
                type="button"
                onClick={() => {
                  earlyUnlockVault(vaultToUnlockEarly.id);
                  setVaultToUnlockEarly(null);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-rose-600/30"
              >
                Accept -10% & Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
