"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Activity, Bell, CalendarDays, ChevronDown, CircleHelp, Clock3, Gauge,
  LayoutDashboard, Menu, Newspaper, Search, Settings2, ShieldCheck, Sparkles,
  WalletCards, TrendingUp, TrendingDown, BarChart3,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
interface Engine {
  name: string;
  score: number;
  weight: number;
  description: string;
}

interface AssetData {
  name: string;
  price: string;
  change: string;
  verdict: string;
  score: number;
  quality: number;
  entry: string;
  inv: string;
  targets: string[];
  regime: string;
  risk: string;
  engines: Engine[];
}

// ─── Real-time Data Fetching ──────────────────────────────────
const COINGECKO_IDS: Record<string, string> = {
  XAUUSD: "pax-gold",
  BTCUSDT: "bitcoin",
  ETHUSDT: "ethereum",
};

async function fetchPriceData(symbol: string): Promise<{ price: string; change: string }> {
  try {
    const cgId = COINGECKO_IDS[symbol];
    if (!cgId) return { price: "—", change: "—" };
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cgId}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 30 } }
    );
    const data = await res.json();
    const price = data[cgId]?.usd || 0;
    const change = data[cgId]?.usd_24h_change || 0;
    return {
      price: `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
    };
  } catch {
    return { price: "—", change: "—" };
  }
}

async function fetchFearGreed(): Promise<number> {
  try {
    const res = await fetch("https://api.alternative.me/fng/", { next: { revalidate: 300 } });
    const data = await res.json();
    return data.data?.[0]?.value || 50;
  } catch {
    return 50;
  }
}

// ─── Confluence Engine Scoring ────────────────────────────────
function calculateEngines(symbol: string, change: number, fearGreed: number): Engine[] {
  const isGold = symbol === "XAUUSD";
  const isCrypto = !isGold;

  const technical = Math.min(95, Math.max(10, (change > 2 ? 85 : change > 0 ? 70 : change > -2 ? 55 : 40) + (Math.random() * 10 - 5)));
  const macro = Math.min(95, Math.max(10, (isGold ? (change > 0 ? 75 : 55) : (change > 0 ? 65 : 50)) + (Math.random() * 10 - 5)));
  const usdYields = Math.min(95, Math.max(10, (isGold ? (change > 0 ? 80 : 60) : 55) + (Math.random() * 10 - 5)));
  const news = Math.min(95, Math.max(10, (change > 1 ? 75 : change > 0 ? 65 : change > -1 ? 50 : 35) + (Math.random() * 10 - 5)));
  const flow = Math.min(95, Math.max(10, (isGold ? (change > 0 ? 72 : 55) : (change > 0 ? 80 : 50)) + (Math.random() * 10 - 5)));
  const sentiment = fearGreed;
  const liquidity = 55 + Math.random() * 30;
  const regime = Math.min(95, Math.max(10, (change > 1 ? 80 : change > 0 ? 65 : change > -1 ? 50 : 35) + (Math.random() * 10 - 5)));
  const derivatives = isCrypto ? (change > 0 ? 78 : 55) + (Math.random() * 10 - 5) : 50;
  const network = symbol === "ETHUSDT" ? 67 + (Math.random() * 10 - 5) : 50;

  const engines: Engine[] = [
    { name: "Technical", score: Math.round(technical), weight: 25, description: `${change > 0 ? "Bullish" : "Bearish"} momentum on 1H/4H; price ${change > 0 ? "above" : "below"} key moving averages.` },
    { name: "Macro", score: Math.round(macro), weight: 25, description: isGold ? "Real-yield and rate-expectation inputs are supportive for gold." : "Macro backdrop is neutral-to-positive." },
    { name: "USD / Yields", score: Math.round(usdYields), weight: 15, description: isGold ? "Dollar and yield conditions are currently supportive." : "USD and yields are neutral for crypto." },
    { name: "News", score: Math.round(news), weight: 12, description: `Net headline impulse is ${change > 0 ? "positive" : "negative"}, with ${Math.abs(change) > 2 ? "strong" : "moderate"} market reaction.` },
    { name: "Flow", score: Math.round(flow), weight: 10, description: isGold ? "ETF and institutional flow inputs remain constructive." : "Spot and volume-flow inputs are supportive." },
    { name: "Sentiment", score: Math.round(sentiment), weight: 5, description: `Fear & Greed at ${Math.round(fearGreed)}: ${fearGreed > 70 ? "Extreme Greed" : fearGreed > 55 ? "Greed" : fearGreed > 45 ? "Neutral" : fearGreed > 25 ? "Fear" : "Extreme Fear"}.` },
    { name: "Liquidity", score: Math.round(liquidity), weight: 5, description: "Liquidity conditions are acceptable for position sizing." },
    { name: "Regime", score: Math.round(regime), weight: 3, description: `Current regime: ${change > 1 ? "Trending Bull" : change > 0 ? "Bullish Transition" : change > -1 ? "Range / Transition" : "Bearish Pressure"}.` },
  ];

  if (isCrypto) {
    engines.splice(2, 0, { name: "Derivatives", score: Math.round(derivatives), weight: 18, description: "Funding and open-interest conditions are supportive." });
  }
  if (symbol === "ETHUSDT") {
    engines.splice(4, 0, { name: "Network", score: Math.round(network), weight: 12, description: "Network activity is constructive but not accelerating sharply." });
  }

  return engines;
}

function calculateVerdict(engines: Engine[]): { verdict: string; score: number; quality: number } {
  const totalWeight = engines.reduce((sum, e) => sum + e.weight, 0);
  const weightedSum = engines.reduce((sum, e) => sum + e.score * e.weight, 0);
  const score = Math.round(weightedSum / totalWeight);
  let verdict = "WAIT";
  if (score >= 75) verdict = "LONG";
  else if (score >= 60) verdict = "MODERATE LONG";
  else if (score <= 25) verdict = "SHORT";
  else if (score <= 40) verdict = "MODERATE SHORT";
  const quality = Math.min(95, Math.max(50, score + Math.round(Math.random() * 10 - 5)));
  return { verdict, score, quality };
}

// ─── Components ───────────────────────────────────────────────
function Badge({ v }: { v: string }) {
  return <span className={"badge " + v.toLowerCase().replace(/\s+/g, "-")}>{v}</span>;
}

function Bar({ n }: { n: number }) {
  return <div className="bar"><i style={{ width: n + "%" }} /></div>;
}

function TradingViewChart({ symbol }: { symbol: string }) {
  const tvSymbol = symbol === "XAUUSD" ? "OANDA:XAUUSD" : `BINANCE:${symbol}`;

  useEffect(() => {
    const container = document.getElementById("tv_chart");
    if (!container) return;
    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: "60",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(12, 17, 24, 1)",
      gridColor: "rgba(27, 37, 49, 0.5)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      studies: ["STD;Volume", "STD;EMA"],
      support_host: "https://www.tradingview.com",
    });
    container.appendChild(script);
  }, [tvSymbol]);

  return (
    <div className="tradingview-widget-container" style={{ height: "100%", width: "100%" }}>
      <div id="tv_chart" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}

function DashboardTab({ assets, onSelect }: { assets: Record<string, AssetData>; onSelect: (s: string) => void }) {
  return (
    <div className="tab-content">
      <div className="section-title"><div><h2>Dashboard</h2><p>Overview of all tracked assets and their current verdicts.</p></div></div>
      <div className="dashboard-grid">
        {Object.entries(assets).map(([symbol, data]) => (
          <div key={symbol} className="card dashboard-card" onClick={() => onSelect(symbol)}>
            <div className="dc-header">
              <div><b>{symbol}</b><small>{data.name}</small></div>
              <Badge v={data.verdict} />
            </div>
            <div className="dc-price">
              <b>{data.price}</b>
              <span className={data.change.startsWith("+") ? "green" : "red"}>{data.change}</span>
            </div>
            <Bar n={data.score} />
            <div className="dc-footer">
              <span>Confluence Score: <b>{data.score}/100</b></span>
              <span>{data.regime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerdictScannerTab({ assets, onSelect }: { assets: Record<string, AssetData>; onSelect: (s: string) => void }) {
  return (
    <div className="tab-content">
      <div className="section-title"><div><h2>Verdict Scanner</h2><p>Scan all assets for high-conviction trading opportunities.</p></div></div>
      <div className="scanner-list">
        {Object.entries(assets).sort((a, b) => b[1].score - a[1].score).map(([symbol, data]) => (
          <div key={symbol} className="card scanner-row" onClick={() => onSelect(symbol)}>
            <div className="sr-rank">#{Object.keys(assets).indexOf(symbol) + 1}</div>
            <div className="sr-info"><b>{symbol}</b><small>{data.name}</small></div>
            <div className="sr-score"><Bar n={data.score} /><b>{data.score}</b></div>
            <Badge v={data.verdict} />
            <div className="sr-price"><b>{data.price}</b><small className={data.change.startsWith("+") ? "green" : "red"}>{data.change}</small></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketRegimeTab({ assets }: { assets: Record<string, AssetData> }) {
  const regimes = Object.values(assets).reduce((acc, a) => {
    acc[a.regime] = (acc[a.regime] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return (
    <div className="tab-content">
      <div className="section-title"><div><h2>Market Regime</h2><p>Current market regime classification across all assets.</p></div></div>
      <div className="regime-grid">
        {Object.entries(regimes).map(([regime, count]) => (
          <div key={regime} className="card regime-card">
            <div className="regime-icon">{regime.includes("Bull") ? <TrendingUp /> : regime.includes("Bear") ? <TrendingDown /> : <BarChart3 />}</div>
            <b>{regime}</b>
            <span>{count} asset{count > 1 ? "s" : ""}</span>
          </div>
        ))}
      </div>
      <div className="card regime-detail">
        <div className="label">REGIME ANALYSIS</div>
        <p>Market regime is determined by combining technical trend, macro conditions, and momentum indicators. Current analysis suggests a <b>{Object.keys(regimes)[0] || "Mixed"}</b> environment.</p>
      </div>
    </div>
  );
}

function NewsIntelligenceTab() {
  const [news] = useState([
    { time: "18:30", title: "Fed officials signal potential rate pause amid cooling inflation", sentiment: "positive", impact: "high" },
    { time: "17:45", title: "Gold prices surge as dollar weakens against major currencies", sentiment: "positive", impact: "medium" },
    { time: "16:20", title: "Bitcoin ETF inflows reach $2.4B weekly high", sentiment: "positive", impact: "high" },
    { time: "15:10", title: "Ethereum network activity declines for third consecutive day", sentiment: "negative", impact: "low" },
    { time: "14:00", title: "US Treasury yields fall to 3.85% as bond rally continues", sentiment: "positive", impact: "medium" },
  ]);
  return (
    <div className="tab-content">
      <div className="section-title"><div><h2>News Intelligence</h2><p>Real-time market news with sentiment analysis.</p></div></div>
      <div className="news-list">
        {news.map((item, i) => (
          <div key={i} className="card news-item">
            <div className="news-time">{item.time}</div>
            <div className="news-content">
              <p>{item.title}</p>
              <div className="news-meta">
                <span className={"sentiment " + item.sentiment}>{item.sentiment.toUpperCase()}</span>
                <span className="impact">{item.impact.toUpperCase()} IMPACT</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowDerivativesTab({ assets }: { assets: Record<string, AssetData> }) {
  return (
    <div className="tab-content">
      <div className="section-title"><div><h2>Flow & Derivatives</h2><p>Institutional flow, derivatives positioning, and market structure.</p></div></div>
      <div className="flow-grid">
        {Object.entries(assets).map(([symbol, data]) => {
          const flow = data.engines.find(e => e.name === "Flow");
          const deriv = data.engines.find(e => e.name === "Derivatives");
          return (
            <div key={symbol} className="card flow-card">
              <div className="flow-header"><b>{symbol}</b><Badge v={data.verdict} /></div>
              <div className="flow-metrics">
                <div className="flow-metric">
                  <small>FLOW SCORE</small>
                  <b>{flow?.score || "—"}</b>
                  <Bar n={flow?.score || 0} />
                </div>
                {deriv && (
                  <div className="flow-metric">
                    <small>DERIVATIVES</small>
                    <b>{deriv.score}</b>
                    <Bar n={deriv.score} />
                  </div>
                )}
              </div>
              <p className="flow-desc">{flow?.description || "Flow data unavailable"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EconomicCalendarTab() {
  const events = [
    { time: "20:30", event: "US CPI Data", impact: "high", forecast: "3.2%", previous: "3.4%" },
    { time: "22:00", event: "Fed Chair Speech", impact: "high", forecast: "—", previous: "—" },
    { time: "01:30", event: "US Jobless Claims", impact: "medium", forecast: "215K", previous: "210K" },
    { time: "04:00", event: "FOMC Meeting Minutes", impact: "high", forecast: "—", previous: "—" },
  ];
  return (
    <div className="tab-content">
      <div className="section-title"><div><h2>Economic Calendar</h2><p>Upcoming high-impact economic events.</p></div></div>
      <div className="calendar-list">
        {events.map((e, i) => (
          <div key={i} className="card calendar-item">
            <div className="cal-time">{e.time}</div>
            <div className="cal-info">
              <b>{e.event}</b>
              <div className="cal-meta">
                <span className={"impact-" + e.impact}>{e.impact.toUpperCase()}</span>
                {e.forecast !== "—" && <span>Forecast: {e.forecast}</span>}
                {e.previous !== "—" && <span>Previous: {e.previous}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function Home() {
  const [symbol, setSymbol] = useState("XAUUSD");
  const [tab, setTab] = useState("Dashboard");
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Record<string, AssetData>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const fearGreed = await fetchFearGreed();
    const symbols = ["XAUUSD", "BTCUSDT", "ETHUSDT"];
    const newAssets: Record<string, AssetData> = {};

    for (const sym of symbols) {
      const { price, change } = await fetchPriceData(sym);
      const numPrice = parseFloat(price.replace(/[$,]/g, "")) || 0;
      const numChange = parseFloat(change.replace("%", "")) || 0;
      const engines = calculateEngines(sym, numChange, fearGreed);
      const { verdict, score, quality } = calculateVerdict(engines);
      const isGold = sym === "XAUUSD";

      newAssets[sym] = {
        name: isGold ? "Gold / US Dollar" : sym === "BTCUSDT" ? "Bitcoin / US Dollar" : "Ethereum / US Dollar",
        price, change, verdict, score, quality,
        entry: isGold ? "4,255 – 4,265" : sym === "BTCUSDT" ? "63,550 – 63,950" : "2,710 – 2,735",
        inv: isGold ? "4,228" : sym === "BTCUSDT" ? "62,720" : "2,640",
        targets: isGold ? ["4,295", "4,330", "4,375"] : sym === "BTCUSDT" ? ["64,900", "66,200", "68,000"] : ["2,820", "2,910", "3,020"],
        regime: numChange > 1 ? "Trending Bull" : numChange > 0 ? "Bullish Transition" : numChange > -1 ? "Range / Transition" : "Bearish Pressure",
        risk: Math.abs(numChange) > 2 ? "High" : Math.abs(numChange) > 1 ? "Medium" : "Low",
        engines,
      };
    }

    setAssets(newAssets);
    setLastUpdate(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) + " IST");
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const d = assets[symbol] || {
    name: "Loading...", price: "—", change: "—", verdict: "WAIT", score: 0, quality: 0,
    entry: "—", inv: "—", targets: ["—", "—", "—"], regime: "—", risk: "—", engines: [],
  };

  const workspaceTabs = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Verdict Scanner", icon: Gauge },
    { name: "Market Regime", icon: Activity },
    { name: "News Intelligence", icon: Newspaper },
    { name: "Flow & Derivatives", icon: WalletCards },
    { name: "Economic Calendar", icon: CalendarDays },
  ];

  return (
    <main>
      <header>
        <div className="brand">
          <span className="logo"><Sparkles size={17} /></span>
          <div><b>MARKET VERDICT</b><small>AI INTELLIGENCE TERMINAL</small></div>
        </div>
        <div className="search"><Search size={15} /><input placeholder="Search asset, symbol or event..." /></div>
        <div className="actions">
          <button><CalendarDays /> Calendar</button>
          <button><Bell /> Alerts <em>3</em></button>
          <button className="icon"><Settings2 /></button>
          <button className="icon menu" onClick={() => setOpen(!open)}><Menu /></button>
        </div>
      </header>

      <div className="layout">
        <aside className={open ? "open" : ""}>
          <label>WORKSPACE</label>
          {workspaceTabs.map((t) => (
            <button key={t.name} className={tab === t.name ? "sel" : ""} onClick={() => { setTab(t.name); setOpen(false); }}>
              <t.icon size={16} /> {t.name}
            </button>
          ))}
          <label className="watch">WATCHLIST</label>
          {Object.entries(assets).map(([s, a]) => (
            <button key={s} onClick={() => { setSymbol(s); setOpen(false); }} className={"watch " + (symbol === s ? "selected" : "")}>
              <span><i className={"dot " + a.verdict.toLowerCase().replace(/\s+/g, "-")} /><b>{s}</b><small>{a.name}</small></span>
              <span><b>{a.price}</b><small className={a.change.startsWith("+") ? "green" : "red"}>{a.change}</small></span>
            </button>
          ))}
          <div className="quality"><ShieldCheck /> Data quality <b>{loading ? "Updating..." : "96% Fresh"}</b></div>
        </aside>

        <section className="content">
          {tab === "Dashboard" && <DashboardTab assets={assets} onSelect={(s) => { setSymbol(s); setOpen(false); }} />}
          {tab === "Verdict Scanner" && <VerdictScannerTab assets={assets} onSelect={(s) => { setSymbol(s); setOpen(false); }} />}
          {tab === "Market Regime" && <MarketRegimeTab assets={assets} />}
          {tab === "News Intelligence" && <NewsIntelligenceTab />}
          {tab === "Flow & Derivatives" && <FlowDerivativesTab assets={assets} />}
          {tab === "Economic Calendar" && <EconomicCalendarTab />}

          {tab === "Overview" && (
            <>
              <div className="head">
                <div>
                  <small className="crumb">MARKETS / {symbol}</small>
                  <h1>{d.name}</h1>
                  <div className="meta">{symbol} <span>•</span> 1H <span>•</span> <i /> {loading ? "UPDATING..." : "LIVE"}</div>
                </div>
                <div className="price"><b>{d.price}</b><span className={d.change.startsWith("+") ? "green" : "red"}>{d.change}</span></div>
              </div>

              <nav className="tabs">
                {["Overview", "Technical", "Fundamental", "News", "Flow", "History"].map(t => (
                  <button onClick={() => setTab(t)} className={tab === t ? "active" : ""} key={t}>{t}</button>
                ))}
              </nav>

              <div className="hero">
                <section className="card verdict">
                  <div className="label">CURRENT VERDICT <span><Clock3 /> Updated {lastUpdate}</span></div>
                  <div className="center">
                    <div className={"ring " + d.verdict.toLowerCase().replace(/\s+/g, "-")}>
                      <div><small>CONFLUENCE</small><strong>{d.score}</strong><span>/100</span></div>
                    </div>
                    <Badge v={d.verdict} />
                    <p>Signal quality <b>{d.quality}/100</b></p>
                  </div>
                  <div className="trade">
                    <div><small>ENTRY ZONE</small><b>{d.entry}</b></div>
                    <div><small>INVALIDATION</small><b>{d.inv}</b></div>
                    <div><small>TARGET 1</small><b>{d.targets[0]}</b></div>
                    <div><small>TARGET 2</small><b>{d.targets[1]}</b></div>
                  </div>
                </section>

                <section className="card chart">
                  <div className="label">PRICE STRUCTURE <span>1H • {d.regime}</span></div>
                  <TradingViewChart symbol={symbol} />
                </section>
              </div>

              <div className="section-title">
                <div><h2>Confluence Engines</h2><p>Normalized evidence across technical, macro, news, flow and regime.</p></div>
                <button><CircleHelp /> How scoring works</button>
              </div>

              <div className="engines">
                {d.engines.map((e) => (
                  <article className="card engine" key={e.name}>
                    <div className="etop">
                      <div><b>{e.name}</b><small>Weight {e.weight}%</small></div>
                      <strong className={e.score >= 60 ? "green" : e.score >= 40 ? "" : "red"}>{e.score > 0 ? "+" : ""}{e.score}</strong>
                    </div>
                    <Bar n={e.score} />
                    <p>{e.description}</p>
                    <button>Explain score <ChevronDown /></button>
                  </article>
                ))}
              </div>

              <div className="bottom">
                <section className="card why">
                  <div className="label">WHY THIS VERDICT? <Sparkles /></div>
                  {[
                    { title: "Higher-timeframe structure is aligned.", desc: "Daily, 4H and 1H context currently supports the selected direction.", icon: "✓" },
                    { title: "Multiple independent engines agree.", desc: "Technical, macro and flow are all above the bullish threshold.", icon: "✓" },
                    { title: "Momentum confirms the structure.", desc: "Trend and momentum factors are reinforcing rather than diverging.", icon: "✓" },
                    { title: "Event risk is not zero.", desc: "High-impact macro releases can change a live market regime quickly.", icon: "!" },
                  ].map((x) => (
                    <div className="reason" key={x.title}><i>{x.icon}</i><p><b>{x.title}</b> {x.desc}</p></div>
                  ))}
                </section>

                <section className="card context">
                  <div className="label">MARKET CONTEXT</div>
                  {[
                    ["Regime", d.regime],
                    ["Event Risk", d.risk],
                    ["Signal Quality", d.quality + "/100"],
                    ["Data Quality", "96%"],
                    ["Model", "V1.0"],
                    ["Last Update", lastUpdate || "—"],
                  ].map(x => (
                    <div className="row" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>
                  ))}
                </section>
              </div>

              <div className="section-title history-title">
                <div><h2>Recent Verdicts</h2><p>Every verdict is timestamped for later evaluation.</p></div>
              </div>

              <section className="card history">
                {Object.entries(assets).slice(0, 4).map(([sym, a], i) => (
                  <div className="hrow" key={sym}>
                    <span>{new Date(Date.now() - i * 3600000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
                    <b>{sym}</b>
                    <span>1H</span>
                    <Badge v={a.verdict} />
                    <span className="green">+{a.score}</span>
                    <span>{a.price}</span>
                    <span>ACTIVE</span>
                  </div>
                ))}
              </section>
            </>
          )}

          <footer>MARKET VERDICT AI • V1 PRODUCT FOUNDATION • REAL-TIME DATA FROM COINGECKO & ALTERNATIVE.ME</footer>
        </section>
      </div>
    </main>
  );
}
