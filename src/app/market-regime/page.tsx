'use client';

import { useRouter } from 'next/navigation';
import SearchDropdown from '@/components/SearchDropdown';
import WorkspaceTabs from '@/components/WorkspaceTabs';

export const dynamic = 'force-dynamic';

export default function MarketRegimePage() {
  const router = useRouter();

  const regimes = [
    { id: 'bull-trending', label: 'Bull Trending', color: '#22c55e', desc: 'Strong uptrend with higher highs & higher lows', confidence: 85 },
    { id: 'bear-trending', label: 'Bear Trending', color: '#ef4444', desc: 'Strong downtrend with lower highs & lower lows', confidence: 78 },
    { id: 'bull-ranging', label: 'Bullish Ranging', color: '#4ade80', desc: 'Sideways with bullish bias, accumulation phase', confidence: 65 },
    { id: 'bear-ranging', label: 'Bearish Ranging', color: '#f87171', desc: 'Sideways with bearish bias, distribution phase', confidence: 62 },
    { id: 'volatile', label: 'High Volatility', color: '#eab308', desc: 'Wide swings, expanding ranges, uncertain direction', confidence: 72 },
    { id: 'low-vol', label: 'Low Volatility', color: '#6366f1', desc: 'Compressed ranges, calm before potential breakout', confidence: 58 },
  ];

  const currentRegime = regimes[0];

  return (
    <div className="workspace-page">
      <header className="dashboard-header">
        <div className="header-top">
          <div className="logo" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">◆</span>
            <span className="logo-text">PredictChain</span>
          </div>
          <SearchDropdown />
          <nav className="main-nav">
            <WorkspaceTabs />
          </nav>
        </div>
      </header>

      <main className="workspace-main">
        <div className="page-header">
          <h1 className="page-title">Market Regime</h1>
          <p className="page-subtitle">Identify the current market state across assets & timeframes</p>
        </div>

        <div className="regime-current">
          <div className="current-regime-card" style={{ borderLeftColor: currentRegime.color }}>
            <div className="regime-header">
              <span className="regime-badge" style={{ backgroundColor: currentRegime.color }}>
                {currentRegime.label}
              </span>
              <span className="regime-confidence">Confidence: {currentRegime.confidence}%</span>
            </div>
            <p className="regime-desc">{currentRegime.desc}</p>
            <div className="regime-meta">
              <span>Detected: 2 hours ago</span>
              <span>Timeframe: 4h</span>
              <span>Asset: BTC (market leader)</span>
            </div>
          </div>
        </div>

        <div className="regime-grid">
          {regimes.map((regime) => (
            <div key={regime.id} className={`regime-card ${regime.id === currentRegime.id ? 'active' : ''}`}>
              <div className="regime-card-header" style={{ backgroundColor: regime.color }}>
                <span className="regime-card-label">{regime.label}</span>
                <span className="regime-card-conf">{regime.confidence}%</span>
              </div>
              <p className="regime-card-desc">{regime.desc}</p>
              <div className="regime-assets">
                <span className="asset-tag">BTC</span>
                <span className="asset-tag">ETH</span>
                <span className="asset-tag">SOL</span>
                <span className="asset-tag">+12 more</span>
              </div>
            </div>
          ))}
        </div>

        <div className="regime-history">
          <h3 className="section-title">Regime History (BTC - 4h)</h3>
          <div className="history-timeline">
            {[
              { regime: 'Bull Trending', period: 'Sep 20 - Present', color: '#22c55e' },
              { regime: 'Bullish Ranging', period: 'Sep 10 - Sep 20', color: '#4ade80' },
              { regime: 'High Volatility', period: 'Sep 5 - Sep 10', color: '#eab308' },
              { regime: 'Bear Trending', period: 'Aug 25 - Sep 5', color: '#ef4444' },
              { regime: 'Low Volatility', period: 'Aug 15 - Aug 25', color: '#6366f1' },
            ].map((item, i) => (
              <div key={i} className="history-item">
                <div className="history-dot" style={{ backgroundColor: item.color }} />
                <div className="history-content">
                  <div className="history-regime" style={{ color: item.color }}>{item.regime}</div>
                  <div className="history-period">{item.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
