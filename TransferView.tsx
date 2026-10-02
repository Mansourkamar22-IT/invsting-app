import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  User, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  Search,
  Sparkles
} from 'lucide-react';

export const TransferView: React.FC = () => {
  const { wallet, contacts, sendTransfer, transactions } = useApp();

  const [recipientTag, setRecipientTag] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('50');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const numAmount = parseFloat(amount) || 0;

  const handleCopyTag = () => {
    navigator.clipboard.writeText(wallet.wishTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectContact = (contact: typeof contacts[0]) => {
    setRecipientTag(contact.tag);
    setRecipientName(contact.name);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientTag.trim()) {
      alert('Please specify a Wish Tag, Axx ID, or contact.');
      return;
    }
    if (numAmount <= 0 || numAmount > wallet.availableCash) {
      alert(`Invalid amount. You have $${wallet.availableCash.toFixed(2)} available.`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = sendTransfer(recipientTag, recipientName, numAmount, note);
      setIsProcessing(false);
      if (res.success) {
        setAmount('50');
        setNote('');
      } else if (res.error) {
        alert(res.error);
      }
    }, 400);
  };

  const transferTxs = transactions.filter(t => t.type.includes('transfer'));

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* User's Wish & Axx Identity Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900/60 via-slate-900 to-slate-950 border border-teal-500/30 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-teal-500/20">
              {wallet.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">{wallet.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Wish Verified
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-sm text-teal-300 font-semibold">{wallet.wishTag}</span>
                <button
                  type="button"
                  onClick={handleCopyTag}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all shadow-sm"
            >
              <QrCode className="w-4 h-4 text-teal-300" />
              <span>Receive / QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Send Money Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Send Money (Wish & Axx Pay)</h3>
              <p className="text-xs text-slate-400">Available balance: <span className="text-emerald-400 font-mono font-semibold">${wallet.availableCash.toFixed(2)}</span></p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            0% Transfer Fee
          </span>
        </div>

        {/* Quick Contact Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Recent Wish & Axx Contacts
          </label>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {contacts.map(c => (
              <button
                key={c.tag}
                type="button"
                onClick={() => handleSelectContact(c)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0 transition-all text-left ${
                  recipientTag === c.tag
                    ? 'bg-teal-500/20 border-teal-500 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{c.avatar}</span>
                <div>
                  <span className="font-semibold text-xs block text-white">{c.name}</span>
                  <span className="text-[10px] font-mono text-teal-300">{c.tag}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSend} className="space-y-4 pt-1">
          {/* Recipient Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Recipient Tag or Phone
            </label>
            <input
              type="text"
              placeholder="@wish_username, @axx_tag, or phone"
              value={recipientTag}
              onChange={e => setRecipientTag(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
              <input
                type="number"
                min="1"
                max={wallet.availableCash}
                step="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white text-lg font-mono font-bold focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Quick Pills */}
            <div className="flex gap-2 mt-2">
              {[15, 30, 50, 100, 250].map(val => (
                <button
                  type="button"
                  key={val}
                  disabled={val > wallet.availableCash}
                  onClick={() => setAmount(val.toString())}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 font-mono"
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Memo / Purpose
            </label>
            <input
              type="text"
              placeholder="e.g. Dinner, Rent contribution, Wish Money gift"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Delivery speed guarantee */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Transfer Speed:
            </span>
            <span className="font-semibold text-emerald-400">Instant Peer-to-Peer</span>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isProcessing || numAmount <= 0 || numAmount > wallet.availableCash || !recipientTag.trim()}
            className="w-full bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 text-sm tracking-wide uppercase transition-all"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            {isProcessing ? 'Transmitting...' : `Send $${numAmount.toFixed(2)} to ${recipientTag || 'Recipient'}`}
          </button>
        </form>
      </div>

      {/* Transfer History Activity */}
      <div className="space-y-3">
        <h3 className="font-bold text-white text-base">Recent Wish & Axx Transfers</h3>
        {transferTxs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-500">
            No transfer activity yet. Send money to any Wish or Axx tag above.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {transferTxs.map(tx => (
              <div
                key={tx.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">{tx.target}</span>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(tx.timestamp).toLocaleDateString()} • {tx.note || 'Wish Transfer'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-white text-sm block">
                    -${tx.amount.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal for Receive */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-teal-500/40 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Receive with Wish / Axx</h3>
            <p className="text-xs text-slate-400">
              Scan this QR code from any Wish Money or Axx terminal to send funds directly to your wallet.
            </p>

            {/* Generated QR Code Graphic */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-xl mx-auto">
              <div className="w-44 h-44 bg-slate-950 rounded-xl flex flex-col items-center justify-center p-3 relative">
                {/* SVG QR Code Simulation */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2">
                  {[...Array(36)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        (i % 2 === 0 || i % 7 === 0 || i < 6 || i > 30) ? 'bg-white' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-lg bg-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                    AV
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-teal-300">
              {wallet.wishTag}
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
