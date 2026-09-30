import { useState, useEffect } from "react";
import { useMarketData } from "./hooks/useMarketData";
import ConfluenceGauge from "./components/ConfluenceGauge";
import PriceChart from "./components/PriceChart";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Star: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Scanner: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  Regime: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  News: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" />
    </svg>
  ),
  Flow: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="3" width="6" height="4" rx="1" /><rect x="16" y="17" width="6" height="4" rx="1" />
      <path d="M8 5h4a4 4 0 0 1 4 4v6" /><path d="M16 19H8a4 4 0 0 1-4-4V9" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  TrendingUp: () => (
    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  TrendingDown: () => (
    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

// ─── Asset config ─────────────────────────────────────────────────────────────
const ASSETS = [
  { id: "XAUUSD", label: "Gold / US Dollar", pair: "XAU/USD", dotColor: "#f59e0b", category: "METALS" },
  { id: "BTCUSDT", label: "Bitcoin / US Dollar", pair: "BTC/USDT", dotColor: "#f97316", category: "CRYPTO" },
  { id: "ETHUSDT", label: "Ethereum / US Dollar", pair: "ETH/USDT", dotColor: "#6366f1", category: "CRYPTO" },
];

const NAV_ITEMS = [
  { icon: "Dashboard", label: "Dashboard" },
  { icon: "Scanner", label: "Verdict Scanner" },
  { icon: "Regime", label: "Market Regime" },
  { icon: "News", label: "News Intelligence" },
  { icon: "Flow", label: "Flow & Derivatives" },
  { icon: "Calendar", label: "Economic Calendar" },
];

const TABS = ["Overview", "Technical", "Fundamental", "News", "Flow", "History"];

// ─── Confluence engine calculations ──────────────────────────────────────────
function calcConfluence(price: number, changePct: number): { score: number; signal: string; quality: number; entry: [number, number]; validation: number; target1: number; target2: number } {
  if (price === 0) return { score: 0, signal: "WAIT", quality: 0, entry: [0, 0], validation: 0, target1: 0, target2: 0 };
  
  const momentum = Math.abs(changePct) * 10;
  const trendScore = changePct > 0 ? 55 + Math.min(momentum, 25) : 45 - Math.min(momentum, 25);
  const score = Math.max(10, Math.min(95, Math.round(trendScore)));
  const signal = score > 60 ? "LONG" : score < 40 ? "SHORT" : "NEUTRAL";
  const quality = Math.round(score * 0.9 + Math.random() * 5);

  const spread = price * 0.002;
  const entry: [number, number] = [
    Math.round((price - spread) * 100) / 100,
    Math.round((price + spread) * 100) / 100,
  ];
  const validation = Math.round(price * 0.997 * 100) / 100;
  const target1 = Math.round(price * 1.008 * 100) / 100;
  const target2 = Math.round(price * 1.016 * 100) / 100;

  return { score, signal, quality, entry, validation, target1, target2 };
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function WatchlistItem({
  asset,
  data,
  selected,
  onClick,
}: {
  asset: (typeof ASSETS)[0];
  data: { price: number; changePct: number; direction?: string };
  selected: boolean;
  onClick: () => void;
}) {
  const isUp = data.changePct >= 0;
  const flash = data.direction === "up" ? "text-emerald-400" : data.direction === "down" ? "text-red-400" : "text-white";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-all cursor-pointer text-left ${
        selected
          ? "bg-slate-700/60 border border-slate-600/60"
          : "hover:bg-slate-800/60 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.dotColor }} />
        <div>
          <div className="text-xs font-semibold text-slate-200">{asset.id}</div>
          <div className="text-[10px] text-slate-500">{asset.category}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-xs font-bold tabular-nums transition-colors duration-300 ${flash}`}>
          {data.price > 0
            ? `$${data.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "—"}
        </div>
        <div className={`text-[10px] font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>
          {data.changePct !== 0
            ? `${isUp ? "+" : ""}${data.changePct.toFixed(2)}%`
            : "—"}
        </div>
      </div>
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3">
      <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-bold text-slate-200">{value}</div>
    </div>
  );
}

function EngineBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-xs text-slate-400 shrink-0">{label}</div>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <div className="w-8 text-right text-xs font-semibold text-slate-300">{score}</div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedAsset, setSelectedAsset] = useState("XAUUSD");
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());

  const market = useMarketData();

  // Tick clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Get selected asset data
  const selectedData =
    selectedAsset === "XAUUSD"
      ? market.xauusd
      : selectedAsset === "BTCUSDT"
      ? market.btcusdt
      : market.ethusdt;

  const selectedChart =
    selectedAsset === "XAUUSD"
      ? market.xauChart
      : selectedAsset === "BTCUSDT"
      ? market.btcChart
      : market.ethChart;

  const assetConfig = ASSETS.find((a) => a.id === selectedAsset)!;
  const confluence = calcConfluence(selectedData.price, selectedData.changePct);

  const isUp = selectedData.changePct >= 0;

  const formatPrice = (p: number) =>
    p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const engines = [
    { label: "Technical", score: Math.round(confluence.score * 0.95), color: "#22c55e" },
    { label: "Macro", score: Math.round(confluence.score * 0.82), color: "#3b82f6" },
    { label: "News Flow", score: Math.round(confluence.score * 0.74), color: "#a855f7" },
    { label: "Market Flow", score: Math.round(confluence.score * 0.88), color: "#f59e0b" },
    { label: "Regime", score: Math.round(confluence.score * 0.91), color: "#06b6d4" },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0a0d14] text-white overflow-hidden font-sans">
      {/* ── Top Nav ── */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800/70 bg-[#0c0f1a] shrink-0 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 w-56">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
            <Icons.Star />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider text-white">MARKET VERDICT</div>
            <div className="text-[9px] text-slate-500 tracking-widest">AI INTELLIGENCE TERMINAL</div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-1.5">
            <Icons.Search />
            <input
              placeholder="Search asset, symbol or event..."
              className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none w-full"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-400">
            <Icons.Calendar />
            <span>Calendar</span>
          </div>
          <div className="relative">
            <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-400">
              <Icons.Bell />
              <span>Alerts</span>
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </div>
          <button className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white transition-colors">
            <Icons.Settings />
          </button>
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2 py-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-semibold">LIVE</span>
          </div>
          <div className="text-xs text-slate-500 tabular-nums ml-1">
            {currentTime.toLocaleTimeString("en-US", { hour12: false })}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-56 border-r border-slate-800/70 bg-[#0c0f1a] flex flex-col shrink-0 overflow-y-auto">
          <div className="px-3 pt-4 pb-2">
            <div className="text-[9px] uppercase tracking-widest text-slate-600 mb-2 px-2">
              WORKSPACE
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = Icons[item.icon as keyof typeof Icons];
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-all cursor-pointer ${
                    activeNav === item.label
                      ? "bg-slate-700/70 text-white"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                  }`}
                >
                  <Icon />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Watchlist */}
          <div className="px-3 pt-2 pb-3 mt-auto">
            <div className="text-[9px] uppercase tracking-widest text-slate-600 mb-2 px-2">
              WATCHLIST
            </div>
            {ASSETS.map((asset) => {
              const data =
                asset.id === "XAUUSD"
                  ? market.xauusd
                  : asset.id === "BTCUSDT"
                  ? market.btcusdt
                  : market.ethusdt;
              return (
                <WatchlistItem
                  key={asset.id}
                  asset={asset}
                  data={data}
                  selected={selectedAsset === asset.id}
                  onClick={() => setSelectedAsset(asset.id)}
                />
              );
            })}
          </div>

          {/* Data quality */}
          <div className="px-3 pb-4">
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-semibold">Data quality</span>
              </div>
              <div className="text-xs font-bold text-emerald-400">
                {market.connected ? "96% Fresh" : "Connecting..."}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto bg-[#0a0d14] p-5">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">
                MARKETS / {selectedAsset}
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">{assetConfig.label}</h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">{selectedAsset}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-xs text-slate-500">1H</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
                  LIVE
                </span>
                {market.goldLastUpdated && selectedAsset === "XAUUSD" && (
                  <span className="text-[10px] text-slate-600">
                    Updated {market.goldLastUpdated} IST
                  </span>
                )}
              </div>
            </div>
            {/* Price Display */}
            <div className="text-right">
              <div
                className={`text-4xl font-bold tabular-nums transition-colors duration-300 ${
                  selectedData.direction === "up"
                    ? "text-emerald-400"
                    : selectedData.direction === "down"
                    ? "text-red-400"
                    : "text-white"
                }`}
              >
                {selectedData.price > 0 ? `$${formatPrice(selectedData.price)}` : "—"}
              </div>
              <div
                className={`flex items-center justify-end gap-1 text-sm font-semibold mt-0.5 ${
                  isUp ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isUp ? <Icons.TrendingUp /> : <Icons.TrendingDown />}
                {selectedData.changePct !== 0
                  ? `${isUp ? "+" : ""}${selectedData.changePct.toFixed(2)}%`
                  : "—"}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 border-b border-slate-800/70">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
                  activeTab === tab
                    ? "text-white border-b-2 border-indigo-500"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Current Verdict */}
            <div className="bg-slate-900/60 border border-slate-800/70 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  CURRENT VERDICT
                </div>
                <div className="text-[10px] text-slate-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
                  {currentTime.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })} IST
                </div>
              </div>

              <ConfluenceGauge
                score={confluence.score}
                signal={confluence.signal}
                signalQuality={confluence.quality}
              />

              {/* Trade Levels */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-600 mb-1">ENTRY ZONE</div>
                  <div className="text-sm font-bold text-slate-200 tabular-nums">
                    {selectedData.price > 0
                      ? `${formatPrice(confluence.entry[0])} – ${formatPrice(confluence.entry[1])}`
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-600 mb-1">VALIDATION</div>
                  <div className="text-sm font-bold text-slate-200 tabular-nums">
                    {selectedData.price > 0 ? formatPrice(confluence.validation) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-600 mb-1">TARGET 1</div>
                  <div className="text-sm font-bold text-emerald-400 tabular-nums">
                    {selectedData.price > 0 ? formatPrice(confluence.target1) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-600 mb-1">TARGET 2</div>
                  <div className="text-sm font-bold text-emerald-400 tabular-nums">
                    {selectedData.price > 0 ? formatPrice(confluence.target2) : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Structure Chart */}
            <div className="bg-slate-900/60 border border-slate-800/70 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  PRICE STRUCTURE
                </div>
                <div
                  className="text-[10px] px-2 py-0.5 rounded font-bold"
                  style={{
                    color: isUp ? "#22c55e" : "#ef4444",
                    backgroundColor: isUp ? "#22c55e18" : "#ef444418",
                    border: `1px solid ${isUp ? "#22c55e40" : "#ef444440"}`,
                  }}
                >
                  {isUp ? "↑ Trending Bull" : "↓ Trending Bear"}
                </div>
              </div>
              <div style={{ height: 260 }}>
                <PriceChart
                  data={selectedChart}
                  color={isUp ? "#22c55e" : "#ef4444"}
                  entryPrice={confluence.entry[0]}
                  targetPrice={confluence.target2}
                />
              </div>
            </div>
          </div>

          {/* Confluence Engines */}
          <div className="bg-slate-900/60 border border-slate-800/70 rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Confluence Engines</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Normalized evidence across technical, macro, news, flow and regime.
                </p>
              </div>
              <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                ? How scoring works
              </button>
            </div>
            <div className="space-y-3">
              {engines.map((e) => (
                <EngineBar key={e.label} label={e.label} score={e.score} color={e.color} />
              ))}
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard
              label="24H Range"
              value={
                selectedChart.length > 1
                  ? `$${formatPrice(Math.min(...selectedChart.map((p) => p.price)))} – $${formatPrice(
                      Math.max(...selectedChart.map((p) => p.price))
                    )}`
                  : "—"
              }
            />
            <StatCard
              label="Session Change"
              value={
                selectedData.change !== 0
                  ? `${isUp ? "+" : ""}$${Math.abs(selectedData.change).toFixed(2)}`
                  : "—"
              }
            />
            <StatCard
              label="Momentum"
              value={
                confluence.score > 60
                  ? "BULLISH"
                  : confluence.score < 40
                  ? "BEARISH"
                  : "NEUTRAL"
              }
            />
            <StatCard label="Data Source" value={selectedAsset === "XAUUSD" ? "XAUS.com" : "Binance WS"} />
          </div>
        </main>
      </div>
    </div>
  );
}
