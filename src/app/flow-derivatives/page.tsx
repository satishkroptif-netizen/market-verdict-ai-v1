'use client';

import { useRouter } from 'next/navigation';
import SearchDropdown from '@/components/SearchDropdown';
import WorkspaceTabs from '@/components/WorkspaceTabs';

export const dynamic = 'force-dynamic';

export default function FlowDerivativesPage() {
  const router = useRouter();

  const flowData = {
    liquidations: {
      long: 127.4,
      short: 89.2,
      net: 38.2,
      cascading: false,
    },
    openInterest: {
      total: 42.8,
      change24h: '+5.2%',
      btcDominance: 52.3,
    },
    fundingRates: {
      btc: 0.0087,
      eth: 0.0123,
      sol: 0.0234,
      avg: 0.0148,
    },
    longShortRatio: {
      accounts: 1.34,
      positions: 1.18,
      topTrader: 1.52,
    },
    takerFlow: {
      buyVolume: 2.34,
      sellVolume: 1.87,
      netFlow: 0.47,
    },
  };

  const optionsFlow = [
    { strike: 70000, type: 'call', oi: 12450, volume: 3420, iv: 58, sentiment: 'bullish' },
    { strike: 68000, type: 'put', oi: 8930, volume: 2100, iv: 62, sentiment: 'bearish' },
    { strike: 72000, type: 'call', oi: 15670, volume: 4100, iv: 55, sentiment: 'bullish' },
    { strike: 65000, type: 'put', oi: 6540, volume: 1800, iv: 68, sentiment: 'bearish' },
    { strike: 75000, type: 'call', oi: 22100, volume: 5600, iv: 52, sentiment: 'bullish' },
    { strike: 62000, type: 'put', oi: 4320, volume: 1200, iv: 72, sentiment: 'bearish' },
  ];

  const whaleAlerts = [
    { time: '12 min ago', asset: 'BTC', side: 'Buy', size: '1,240 BTC', value: '$83.2M', exchange: 'Binance' },
    { time: '35 min ago', asset: 'ETH', side: 'Sell', size: '15,600 ETH', value: '$52.8M', exchange: 'Coinbase' },
    { time: '1 hour ago', asset: 'SOL', side: 'Buy', size: '2.8M SOL', value: '$44.5M', exchange: 'OKX' },
    { time: '2 hours ago', asset: 'BTC', side: 'Buy', size: '890 BTC', value: '$59.7M', exchange: 'Bybit' },
    { time: '3 hours ago', asset: 'XRP', side: 'Sell', size: '180M XRP', value: '$98.4M', exchange: 'Binance' },
  ];

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
          <h1 className="page-title">Flow Derivatives</h1>
          <p className="page-subtitle">Options flow, liquidations, open interest & whale activity</p>
        </div>

        <div className="flow-metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Liquidations (24h)</span>
              <span className="metric-trend positive">Net Long +${flowData.liquidations.net}M</span>
            </div>
            <div className="metric-main">
              <div className="liq-bars">
                <div className="liq-bar long" style={{ width: `${flowData.liquidations.long / (flowData.liquidations.long + flowData.liquidations.short) * 100}%` }}>
                  Longs: ${flowData.liquidations.long}M
                </div>
                <div className="liq-bar short" style={{ width: `${flowData.liquidations.short / (flowData.liquidations.long + flowData.liquidations.short) * 100}%` }}>
                  Shorts: ${flowData.liquidations.short}M
                </div>
              </div>
            </div>
            <div className="metric-footer">
              {flowData.liquidations.cascading ? '⚠️ Cascading liquidations detected' : '✓ No cascade risk'}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Open Interest</span>
              <span className="metric-trend positive">{flowData.openInterest.change24h}</span>
            </div>
            <div className="metric-main-large">${flowData.openInterest.total}B</div>
            <div className="metric-footer">BTC Dominance: {flowData.openInterest.btcDominance}%</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Avg Funding Rate</span>
              <span className="metric-trend negative">{flowData.fundingRates.avg.toFixed(4)}%</span>
            </div>
            <div className="metric-main-large">{flowData.fundingRates.avg > 0 ? 'Longs pay Shorts' : 'Shorts pay Longs'}</div>
            <div className="metric-footer">
              BTC: {flowData.fundingRates.btc.toFixed(4)}% | ETH: {flowData.fundingRates.eth.toFixed(4)}% | SOL: {flowData.fundingRates.sol.toFixed(4)}%
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Long/Short Ratio</span>
              <span className="metric-trend positive">{flowData.longShortRatio.accounts.toFixed(2)}</span>
            </div>
            <div className="metric-main-large">Accounts: {flowData.longShortRatio.accounts}</div>
            <div className="metric-footer">
              Positions: {flowData.longShortRatio.positions} | Top Traders: {flowData.longShortRatio.topTrader}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Taker Flow (24h)</span>
              <span className="metric-trend positive">+${flowData.takerFlow.netFlow}B</span>
            </div>
            <div className="metric-main">
              <div className="flow-bars">
                <div className="flow-bar buy" style={{ width: `${flowData.takerFlow.buyVolume / (flowData.takerFlow.buyVolume + flowData.takerFlow.sellVolume) * 100}%` }}>
                  Buy: ${flowData.takerFlow.buyVolume}B
                </div>
                <div className="flow-bar sell" style={{ width: `${flowData.takerFlow.sellVolume / (flowData.takerFlow.buyVolume + flowData.takerFlow.sellVolume) * 100}%` }}>
                  Sell: ${flowData.takerFlow.sellVolume}B
                </div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Whale Alerts (24h)</span>
              <span className="metric-trend neutral">12 alerts</span>
            </div>
            <div className="metric-main-large">Net: +$41.3M</div>
            <div className="metric-footer">8 Buys • 4 Sells</div>
          </div>
        </div>

        <div className="flow-sections-grid">
          <div className="flow-section">
            <h3 className="section-title">Options Flow (BTC)</h3>
            <div className="options-table">
              <div className="table-header">
                <span>Strike</span>
                <span>Type</span>
                <span>OI</span>
                <span>Vol</span>
                <span>IV</span>
                <span>Signal</span>
              </div>
              {optionsFlow.map((opt, i) => (
                <div key={i} className={`table-row ${opt.sentiment}`}>
                  <span>${opt.strike.toLocaleString()}</span>
                  <span className={opt.type}>{opt.type.toUpperCase()}</span>
                  <span>{opt.oi.toLocaleString()}</span>
                  <span>{opt.volume.toLocaleString()}</span>
                  <span>{opt.iv}%</span>
                  <span className={`signal-badge ${opt.sentiment}`}>
                    {opt.sentiment === 'bullish' ? '🟢 Bullish' : '🔴 Bearish'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flow-section">
            <h3 className="section-title">Whale Alerts</h3>
            <div className="whale-list">
              {whaleAlerts.map((alert, i) => (
                <div key={i} className={`whale-item ${alert.side.toLowerCase()}`}>
                  <div className="whale-time">{alert.time}</div>
                  <div className="whale-main">
                    <span className="whale-asset">{alert.asset}</span>
                    <span className={`whale-side ${alert.side.toLowerCase()}`}>{alert.side}</span>
                    <span className="whale-size">{alert.size}</span>
                  </div>
                  <div className="whale-details">
                    <span className="whale-value">{alert.value}</span>
                    <span className="whale-exchange">{alert.exchange}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
