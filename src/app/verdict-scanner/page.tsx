'use client';

import { useRouter } from 'next/navigation';
import SearchDropdown from '@/components/SearchDropdown';
import WorkspaceTabs from '@/components/WorkspaceTabs';

export const dynamic = 'force-dynamic';

export default function VerdictScannerPage() {
  const router = useRouter();

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
          <h1 className="page-title">Verdict Scanner</h1>
          <p className="page-subtitle">Scan all markets for strongest bullish & bearish signals across timeframes</p>
        </div>

        <div className="scanner-controls">
          <div className="control-group">
            <label>Timeframe</label>
            <select className="scanner-select" defaultValue="1h">
              <option value="15m">15 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1d">1 Day+</option>
            </select>
          </div>
          <div className="control-group">
            <label>Asset Class</label>
            <select className="scanner-select" defaultValue="all">
              <option value="all">All Assets</option>
              <option value="crypto">Cryptocurrencies</option>
              <option value="commodity">Commodities</option>
            </select>
          </div>
          <div className="control-group">
            <label>Minimum Confidence</label>
            <input type="range" className="scanner-range" min="0" max="100" defaultValue="50" />
            <span className="range-value">50%</span>
          </div>
          <button className="scan-btn">Run Scan</button>
        </div>

        <div className="scanner-results">
          <div className="results-section">
            <h3 className="section-title">Strongest Bullish Signals</h3>
            <div className="results-grid bullish-grid">
              {['BTC', 'ETH', 'SOL', 'AVAX', 'NEAR', 'INJ'].map((symbol, i) => (
                <div key={symbol} className="verdict-card bullish">
                  <div className="card-rank">#{i + 1}</div>
                  <div className="card-symbol">{symbol}/USDT</div>
                  <div className="card-verdict strong-buy">Strong Buy</div>
                  <div className="card-score">+0.82</div>
                  <div className="card-confidence">Confidence: 91%</div>
                  <div className="card-timeframe">1h</div>
                </div>
              ))}
            </div>
          </div>

          <div className="results-section">
            <h3 className="section-title">Strongest Bearish Signals</h3>
            <div className="results-grid bearish-grid">
              {['XRP', 'ADA', 'DOGE', 'SHIB', 'PEPE', 'FLOKI'].map((symbol, i) => (
                <div key={symbol} className="verdict-card bearish">
                  <div className="card-rank">#{i + 1}</div>
                  <div className="card-symbol">{symbol}/USDT</div>
                  <div className="card-verdict strong-sell">Strong Sell</div>
                  <div className="card-score">-0.76</div>
                  <div className="card-confidence">Confidence: 88%</div>
                  <div className="card-timeframe">1h</div>
                </div>
              ))}
            </div>
          </div>

          <div className="results-section">
            <h3 className="section-title">High-Conviction Neutrals (Watchlist)</h3>
            <div className="results-grid neutral-grid">
              {['LINK', 'UNI', 'ARB', 'OP', 'TIA', 'SEI'].map((symbol, i) => (
                <div key={symbol} className="verdict-card neutral">
                  <div className="card-rank">#{i + 1}</div>
                  <div className="card-symbol">{symbol}/USDT</div>
                  <div className="card-verdict neutral-tag">Neutral</div>
                  <div className="card-score">+0.08</div>
                  <div className="card-confidence">Confidence: 45%</div>
                  <div className="card-timeframe">4h</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
