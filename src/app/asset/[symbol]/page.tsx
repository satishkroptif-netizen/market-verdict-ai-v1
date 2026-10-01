'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Prediction, FearGreedData, Timeframe } from '@/lib/types';
import { DEFAULT_ASSETS } from '@/lib/prediction';
import { ALL_TIMEFRAMES, TIMEFRAME_LABELS } from '@/lib/weights';
import SearchDropdown from '@/components/SearchDropdown';
import TradingViewChart from '@/components/TradingViewChart';

interface AssetData {
  prediction: Prediction;
  ticker: any;
  fearGreed: FearGreedData | null;
}

function AssetDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const symbol = (params.symbol as string)?.toUpperCase() || 'BTC';

  const [data, setData] = useState<AssetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>(
    (searchParams.get('timeframe') as Timeframe) || '1h'
  );
  const [activeTab, setActiveTab] = useState<Timeframe>(timeframe);

  const asset = DEFAULT_ASSETS.find((a) => a.symbol === symbol);

  const getApiPair = (sym: string): string => {
    const upper = sym.toUpperCase();
    if (upper === 'GOLD' || upper === 'XAU') return 'XAUUSDT';
    if (upper === 'SILVER' || upper === 'XAG') return 'XAGUSDT';
    if (upper === 'WTI' || upper === 'CRUDEOIL') return 'WTIUSDT';
    return `${upper}USDT`;
  };

  const apiPair = getApiPair(symbol);
  const isCommodity = ['GOLD', 'SILVER', 'WTI', 'XAU', 'XAG'].includes(symbol);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/predictions?symbol=${apiPair}&timeframe=${activeTab}`);
      if (!res.ok) throw new Error('Failed to load prediction');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError('Failed to load asset data. Please try again.');
    }
    setLoading(false);
  }, [apiPair, activeTab]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleTimeframeChange = (tf: Timeframe) => {
    setActiveTab(tf);
    router.push(`/asset/${symbol}?timeframe=${tf}`, { scroll: false });
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict.includes('Strong Buy')) return '#22c55e';
    if (verdict.includes('Buy')) return '#4ade80';
    if (verdict.includes('Strong Sell')) return '#ef4444';
    if (verdict.includes('Sell')) return '#f87171';
    return '#eab308';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <div onClick={() => router.push('/')} className="flex cursor-pointer items-center gap-2">
              <span className="text-2xl text-blue-500">◆</span>
              <span className="text-xl font-bold tracking-tight">PredictChain</span>
            </div>
            <SearchDropdown />
          </div>
          <nav className="flex items-center gap-6">
            <a href="/" className="text-sm text-gray-400 transition hover:text-white">Dashboard</a>
            <a href="/track-record" className="text-sm text-gray-400 transition hover:text-white">Track Record</a>
            <a href="/about" className="text-sm text-gray-400 transition hover:text-white">About</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Asset Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {asset && <span className="text-4xl">{asset.icon}</span>}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{asset?.name || symbol}</h1>
                <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">{symbol}/USDT</span>
                {isCommodity && (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-400">Commodity</span>
                )}
              </div>
              {data && (
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-4xl font-bold tracking-tight">
                    ${data.prediction.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                  <span className={`text-lg font-medium ${data.prediction.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.prediction.priceChange24h >= 0 ? '+' : ''}{data.prediction.priceChange24h.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {ALL_TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => handleTimeframeChange(tf)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  tf === activeTab
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {TIMEFRAME_LABELS[tf]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <p className="text-gray-400">Analyzing {symbol} across {TIMEFRAME_LABELS[activeTab]}...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-6xl">⚠️</div>
              <p className="text-xl text-gray-300">{error}</p>
              <button onClick={fetchData} className="rounded-lg bg-blue-500 px-6 py-2 text-white transition hover:bg-blue-600">
                Retry
              </button>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Prediction Cards Row */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Verdict Card */}
              <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
                <p className="mb-2 text-sm font-medium text-gray-400">Verdict ({TIMEFRAME_LABELS[activeTab]})</p>
                <p className="text-3xl font-bold" style={{ color: getVerdictColor(data.prediction.verdict) }}>
                  {data.prediction.verdict}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${((data.prediction.verdictScore + 1) / 2) * 100}%`,
                      backgroundColor: getVerdictColor(data.prediction.verdict),
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Score: {data.prediction.verdictScore > 0 ? '+' : ''}{data.prediction.verdictScore.toFixed(4)}
                </p>
              </div>

              {/* Confidence Card */}
              <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
                <p className="mb-2 text-sm font-medium text-gray-400">Confidence</p>
                <p className="text-3xl font-bold text-blue-400">{data.prediction.confidence}%</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${data.prediction.confidence}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {data.prediction.confidence >= 70 ? 'High conviction' : data.prediction.confidence >= 50 ? 'Moderate conviction' : 'Low conviction'}
                </p>
              </div>

              {/* Fear & Greed Card */}
              <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
                <p className="mb-2 text-sm font-medium text-gray-400">Market Sentiment</p>
                {data.fearGreed ? (
                  <>
                    <p className="text-3xl font-bold" style={{
                      color: data.fearGreed.value < 30 ? '#ef4444' : data.fearGreed.value > 70 ? '#22c55e' : '#eab308'
                    }}>
                      {data.fearGreed.value}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">{data.fearGreed.classification}</p>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-gray-500">N/A</p>
                )}
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${data.fearGreed?.value || 50}%`,
                      backgroundColor: data.fearGreed
                        ? data.fearGreed.value < 30 ? '#ef4444' : data.fearGreed.value > 70 ? '#22c55e' : '#eab308'
                        : '#6b7280',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* TradingView Chart */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Price Chart</h2>
                <span className="text-sm text-gray-500">Powered by TradingView</span>
              </div>
              <TradingViewChart symbol={symbol} height={500} />
            </div>

            {/* Factor Breakdown */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
              <h2 className="mb-6 text-lg font-semibold">Factor Analysis</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.prediction.factors.map((factor, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">{factor.name}</span>
                      <span className={`text-sm font-bold ${factor.score > 0.1 ? 'text-green-400' : factor.score < -0.1 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {factor.score > 0 ? '+' : ''}{factor.score.toFixed(3)}
                      </span>
                    </div>
                    <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${((factor.score + 1) / 2) * 100}%`,
                          backgroundColor: factor.score > 0.1 ? '#22c55e' : factor.score < -0.1 ? '#ef4444' : '#eab308',
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{factor.description}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                      <span>Weight: {(factor.weight * 100).toFixed(0)}%</span>
                      <span>{(factor.score * factor.weight).toFixed(4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Factors & Summary */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top 3 Factors */}
              <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
                <h2 className="mb-4 text-lg font-semibold">Top 3 Factors</h2>
                <div className="space-y-3">
                  {data.prediction.topFactors.map((factor, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-xl bg-white/[0.03] p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-lg font-bold text-blue-400">
                        #{i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{factor.name}</p>
                        <p className="text-sm text-gray-500">{factor.description}</p>
                      </div>
                      <span className={`text-lg font-bold ${factor.score > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {factor.score > 0 ? '+' : ''}{factor.score.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prediction Summary */}
              <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
                <h2 className="mb-4 text-lg font-semibold">Prediction Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3">
                    <span className="text-gray-400">Weighted Score</span>
                    <span className={`font-bold ${data.prediction.verdictScore > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {data.prediction.verdictScore > 0 ? '+' : ''}{data.prediction.verdictScore.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3">
                    <span className="text-gray-400">Factors Bullish</span>
                    <span className="font-bold text-green-400">
                      {data.prediction.factors.filter((f) => f.score > 0.05).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3">
                    <span className="text-gray-400">Factors Bearish</span>
                    <span className="font-bold text-red-400">
                      {data.prediction.factors.filter((f) => f.score < -0.05).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-gray-300">{new Date(data.prediction.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function AssetDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    }>
      <AssetDetailContent />
    </Suspense>
  );
}
