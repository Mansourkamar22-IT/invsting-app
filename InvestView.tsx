import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StockQuote } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Cpu, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Zap,
  Building,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';

export const InvestView: React.FC = () => {
  const { 
    wallet, 
    stocks, 
    holdings, 
    buyStock, 
    sellStock, 
    selectedStock, 
    setSelectedStock,
    totalInvestedStockValue,
    totalStockGainLoss,
    totalStockGainLossPercent
  } = useApp();

  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Trade Modal
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState<string>('100');
  const [tradeShares, setTradeShares] = useState<string>('');

  const currentStock = selectedStock || stocks[0]; // defaults to NVIDIA
  const userHolding = holdings.find(h => h.symbol === currentStock.symbol);

  // Filter stocks
  const filteredStocks = stocks.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Calculate SVG chart coordinates for currentStock
  const historyPoints = currentStock.history[timeframe] || currentStock.history['1D'];
  const minPrice = Math.min(...historyPoints) * 0.995;
  const maxPrice = Math.max(...historyPoints) * 1.005;
  const priceRange = maxPrice - minPrice || 1;

  const chartWidth = 500;
  const chartHeight = 180;
  
  const points = historyPoints.map((val, idx) => {
    const x = (idx / (historyPoints.length - 1)) * chartWidth;
    const y = chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  const isPositive = currentStock.change >= 0;

  // Handle Trade Execution
  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeMode === 'buy') {
      const amt = parseFloat(tradeAmount) || 0;
      const res = buyStock(currentStock.symbol, amt);
      if (res.success) {
        setTradeModalOpen(false);
      } else if (res.error) {
        alert(res.error);
      }
    } else {
      const shares = parseFloat(tradeShares) || 0;
      const res = sellStock(currentStock.symbol, shares);
      if (res.success) {
        setTradeModalOpen(false);
      } else if (res.error) {
        alert(res.error);
      }
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Portfolio Quick Overview Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Stock Investment Portfolio
          </span>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
              ${totalInvestedStockValue.toFixed(2)}
            </span>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
              totalStockGainLoss >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {totalStockGainLoss >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {totalStockGainLoss >= 0 ? '+' : ''}${totalStockGainLoss.toFixed(2)} ({totalStockGainLossPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTradeMode('buy');
              setTradeModalOpen(true);
            }}
            className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            Buy {currentStock.symbol}
          </button>
          {userHolding && userHolding.shares > 0 && (
            <button
              onClick={() => {
                setTradeMode('sell');
                setTradeShares((userHolding.shares / 2).toFixed(4));
                setTradeModalOpen(true);
              }}
              className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700"
            >
              <ArrowDownRight className="w-4 h-4" />
              Sell
            </button>
          )}
        </div>
      </div>

      {/* Featured Stock Detail Card (NVIDIA spotlight) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        {/* Header of selected stock */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
              currentStock.symbol === 'NVDA' 
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' 
                : 'bg-slate-800 text-emerald-400 border border-slate-700'
            }`}>
              {currentStock.symbol === 'NVDA' ? <Cpu className="w-6 h-6" /> : currentStock.symbol.slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight">{currentStock.name}</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {currentStock.symbol}
                </span>
                {currentStock.symbol === 'NVDA' && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    AI Leader
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentStock.category} • NASDAQ Listed</p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-3xl font-black font-mono text-white block">
              ${currentStock.price.toFixed(2)}
            </span>
            <div className={`text-xs font-bold font-mono inline-flex items-center gap-1 ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isPositive ? '+' : ''}${currentStock.change.toFixed(2)} ({isPositive ? '+' : ''}{currentStock.changePercent.toFixed(2)}%) Today
            </div>
          </div>
        </div>

        {/* Interactive Stock Chart */}
        <div className="pt-2">
          {/* Timeframe pill selector */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Performance History</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['1D', '1W', '1M', '1Y'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                    timeframe === tf
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Chart */}
          <div className="w-full bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 overflow-hidden">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-36 sm:h-44 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <polygon
                points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
                fill="url(#stockGradient)"
              />

              {/* Stroke line */}
              <polyline
                fill="none"
                stroke={isPositive ? '#10b981' : '#f43f5e'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 px-1">
              <span>Low: ${minPrice.toFixed(2)}</span>
              <span className="text-emerald-400/80">Real-time Live Tick Active</span>
              <span>High: ${maxPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* User's position in this stock */}
        {userHolding && (
          <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Your Holdings</span>
              <span className="font-bold text-white font-mono text-sm">
                {userHolding.shares.toFixed(4)} Shares (${(userHolding.shares * currentStock.price).toFixed(2)})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Average Buy Price</span>
              <span className="font-bold text-white font-mono">${userHolding.avgBuyPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Unrealized Return</span>
              <span className={`font-bold font-mono ${
                (currentStock.price - userHolding.avgBuyPrice) >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {((currentStock.price - userHolding.avgBuyPrice) * userHolding.shares) >= 0 ? '+' : ''}
                ${((currentStock.price - userHolding.avgBuyPrice) * userHolding.shares).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Key Company Fundamentals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] block">Market Cap</span>
            <span className="font-bold text-white font-mono">{currentStock.marketCap}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] block">P/E Ratio</span>
            <span className="font-bold text-white font-mono">{currentStock.peRatio}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] block">52-Week Range</span>
            <span className="font-bold text-white font-mono">${currentStock.low52w} - ${currentStock.high52w}</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] block">Volume (24h)</span>
            <span className="font-bold text-white font-mono">{currentStock.volume}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {currentStock.description}
        </p>
      </div>

      {/* Explore & Search Other Companies */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <h3 className="font-bold text-white text-base">Top Companies & Stocks</h3>
          
          {/* Search bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search NVIDIA, Apple, Tesla..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Stock List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredStocks.map(stock => {
            const isSel = selectedStock?.symbol === stock.symbol;
            const holding = holdings.find(h => h.symbol === stock.symbol);

            return (
              <div
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSel
                    ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      stock.symbol === 'NVDA' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-white'
                    }`}>
                      {stock.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{stock.symbol}</span>
                        {holding && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded">
                            Owned
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 block truncate max-w-[140px]">{stock.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-white text-sm block">
                      ${stock.price.toFixed(2)}
                    </span>
                    <span className={`text-[11px] font-mono font-medium flex items-center justify-end gap-0.5 ${
                      stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trade Modal (Buy or Sell) */}
      {tradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  {currentStock.symbol.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Trade {currentStock.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">${currentStock.price.toFixed(2)} / share</span>
                </div>
              </div>

              {/* Buy / Sell Tabs */}
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex">
                <button
                  type="button"
                  onClick={() => setTradeMode('buy')}
                  className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                    tradeMode === 'buy'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setTradeMode('sell')}
                  disabled={!userHolding || userHolding.shares <= 0}
                  className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                    tradeMode === 'sell'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white disabled:opacity-30'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            <form onSubmit={handleExecuteTrade} className="space-y-4">
              {tradeMode === 'buy' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Amount to Invest (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        min="5"
                        max={wallet.availableCash}
                        step="1"
                        value={tradeAmount}
                        onChange={e => setTradeAmount(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-white font-mono font-bold text-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex gap-2 mt-2">
                      {[25, 50, 100, 250, 500].map(val => (
                        <button
                          type="button"
                          key={val}
                          disabled={val > wallet.availableCash}
                          onClick={() => setTradeAmount(val.toString())}
                          className="text-xs px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 font-mono"
                        >
                          ${val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Available Cash:</span>
                      <span className="font-mono text-emerald-400">${wallet.availableCash.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimated Shares:</span>
                      <span className="font-mono text-white">
                        {((parseFloat(tradeAmount) || 0) / currentStock.price).toFixed(4)} {currentStock.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Trading Fee:</span>
                      <span className="font-mono text-emerald-400">$0.00 (Zero Commission)</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setTradeModalOpen(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={parseFloat(tradeAmount) > wallet.availableCash || (parseFloat(tradeAmount) || 0) <= 0}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase"
                    >
                      Confirm Purchase
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Shares to Sell (You own {userHolding?.shares || 0})
                    </label>
                    <input
                      type="number"
                      min="0.0001"
                      max={userHolding?.shares || 0}
                      step="any"
                      value={tradeShares}
                      onChange={e => setTradeShares(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono font-bold text-lg focus:outline-none focus:border-rose-500"
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setTradeShares(((userHolding?.shares || 0) * 0.25).toFixed(4))}
                        className="text-xs px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                      >
                        25%
                      </button>
                      <button
                        type="button"
                        onClick={() => setTradeShares(((userHolding?.shares || 0) * 0.5).toFixed(4))}
                        className="text-xs px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                      >
                        50%
                      </button>
                      <button
                        type="button"
                        onClick={() => setTradeShares((userHolding?.shares || 0).toString())}
                        className="text-xs px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-rose-400 font-mono font-semibold"
                      >
                        100% (All)
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Proceeds to Cash:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        ${((parseFloat(tradeShares) || 0) * currentStock.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setTradeModalOpen(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={(parseFloat(tradeShares) || 0) <= 0 || (parseFloat(tradeShares) || 0) > (userHolding?.shares || 0)}
                      className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase"
                    >
                      Confirm Sell
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
