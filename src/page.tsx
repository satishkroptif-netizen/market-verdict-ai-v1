'use client';

import { useRouter } from 'next/navigation';
import SearchDropdown from '@/components/SearchDropdown';
import WorkspaceTabs from '@/components/WorkspaceTabs';

export const dynamic = 'force-dynamic';

export default function NewsIntelligentPage() {
  const router = useRouter();

  const newsCategories = [
    { id: 'macro', label: 'Macro & Fed', color: '#6366f1', count: 12 },
    { id: 'regulation', label: 'Regulation', color: '#ef4444', count: 8 },
    { id: 'etf', label: 'ETF Flows', color: '#22c55e', count: 15 },
    { id: 'defi', label: 'DeFi & Protocols', color: '#eab308', count: 22 },
    { id: 'layer1', label: 'Layer 1 Updates', color: '#06b6d4', count: 18 },
    { id: 'stablecoin', label: 'Stablecoins', color: '#8b5cf6', count: 6 },
  ];

  const newsItems = [
    {
      id: 1,
      category: 'macro',
      title: 'Fed Holds Rates Steady, Signals One More Cut This Year',
      source: 'Reuters',
      time: '15 min ago',
      sentiment: 'bullish',
      impact: 'high',
      assets: ['BTC', 'ETH', 'GOLD'],
      summary: 'Powell emphasizes data-dependent approach; markets price 75% chance of December cut.',
    },
    {
      id: 2,
      category: 'etf',
      title: 'BlackRock IBIT Sees $847M Inflows - Largest Single Day Since March',
      source: 'Bloomberg',
      time: '42 min ago',
      sentiment: 'bullish',
      impact: 'high',
      assets: ['BTC'],
      summary: 'Cumulative ETF flows turn positive for the week; institutional accumulation accelerating.',
    },
    {
      id: 3,
      category: 'regulation',
      title: 'SEC Delays Decision on Solana ETF Applications',
      source: 'CoinDesk',
      time: '1 hour ago',
      sentiment: 'bearish',
      impact: 'medium',
      assets: ['SOL'],
      summary: 'Commission extends review period by 45 days; SOL down 3% on the news.',
    },
    {
      id: 4,
      category: 'defi',
      title: 'Uniswap v4 Hooks Go Live on Mainnet - New AMM Features Deployed',
      source: 'The Block',
      time: '2 hours ago',
      sentiment: 'bullish',
      impact: 'medium',
      assets: ['UNI'],
      summary: 'Custom pool logic now available; expected to drive fee revenue and TVL growth.',
    },
    {
      id: 5,
      category: 'layer1',
      title: 'Ethereum Pectra Upgrade Targeting March 2025 - Account Abstraction Included',
      source: 'Ethereum Foundation Blog',
      time: '3 hours ago',
      sentiment: 'bullish',
      impact: 'high',
      assets: ['ETH', 'L2 tokens'],
      summary: 'EIP-7702 and EIP-3074 to enable native account abstraction; major UX improvement.',
    },
    {
      id: 6,
      category: 'stablecoin',
      title: 'USDC Market Cap Hits $40B - Fastest Growth Since 2021',
      source: 'Circle Blog',
      time: '4 hours ago',
      sentiment: 'bullish',
      impact: 'medium',
      assets: ['USDC', 'DeFi'],
      summary: 'Institutional onboarding drives supply expansion; positive for on-chain liquidity.',
    },
    {
      id: 7,
      category: 'macro',
      title: 'US CPI Comes in at 2.4% YoY - Below Expectations',
      source: 'WSJ',
      time: '5 hours ago',
      sentiment: 'bullish',
      impact: 'high',
      assets: ['BTC', 'ETH', 'Risk Assets'],
      summary: 'Core CPI at 3.2%; reinforces Fed pivot narrative; dollar weakens.',
    },
    {
      id: 8,
      category: 'defi',
      title: 'Aave DAO Approves GHO Stablecoin Expansion to Arbitrum & Optimism',
      source: 'Aave Governance Forum',
      time: '6 hours ago',
      sentiment: 'bullish',
      impact: 'low',
      assets: ['AAVE', 'GHO'],
      summary: 'Cross-chain deployment to boost GHO adoption; fee switch proposal next.',
    },
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
          <h1 className="page-title">News Intelligent</h1>
          <p className="page-subtitle">AI-powered news sentiment & market impact analysis</p>
        </div>

        <div className="news-filters">
          {newsCategories.map((cat) => (
            <button key={cat.id} className="filter-chip" style={{ borderColor: cat.color }}>
              <span className="chip-dot" style={{ backgroundColor: cat.color }} />
              {cat.label}
              <span className="chip-count">{cat.count}</span>
            </button>
          ))}
        </div>

        <div className="news-feed">
          {newsItems.map((item) => (
            <article key={item.id} className={`news-card ${item.sentiment}`}>
              <div className="news-header">
                <span className="news-category" style={{ backgroundColor: newsCategories.find(c => c.id === item.category)?.color }}>
                  {newsCategories.find(c => c.id === item.category)?.label}
                </span>
                <span className="news-time">{item.time}</span>
              </div>
              <h3 className="news-title">{item.title}</h3>
              <p className="news-source">{item.source}</p>
              <div className="news-meta">
                <span className={`sentiment-badge ${item.sentiment}`}>
                  {item.sentiment === 'bullish' ? '🟢 Bullish' : '🔴 Bearish'}
                </span>
                <span className={`impact-badge ${item.impact}`}>
                  Impact: {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}
                </span>
              </div>
              <p className="news-summary">{item.summary}</p>
              <div className="news-assets">
                {item.assets.map((asset) => (
                  <span key={asset} className="asset-tag">{asset}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="sentiment-summary">
          <h3 className="section-title">Aggregate Sentiment (Last 24h)</h3>
          <div className="sentiment-bars">
            <div className="sentiment-bar bullish">
              <span className="bar-label">Bullish</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '58%' }} />
              </div>
              <span className="bar-value">58%</span>
            </div>
            <div className="sentiment-bar neutral">
              <span className="bar-label">Neutral</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '27%' }} />
              </div>
              <span className="bar-value">27%</span>
            </div>
            <div className="sentiment-bar bearish">
              <span className="bar-label">Bearish</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '15%' }} />
              </div>
              <span className="bar-value">15%</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}