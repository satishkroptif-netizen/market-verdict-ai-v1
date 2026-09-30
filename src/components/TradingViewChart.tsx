'use client';

import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string; // e.g. "BTC", "ETH", "GOLD", "SILVER", "WTI"
  height?: number;
}

function getTradingViewSymbol(symbol: string): string {
  const s = symbol.toUpperCase();
  if (s === 'GOLD' || s === 'XAU') return 'OANDA:XAUUSD';
  if (s === 'SILVER' || s === 'XAG') return 'OANDA:XAGUSD';
  if (s === 'WTI' || s === 'CRUDEOIL') return 'TVC:USOIL';
  return `BINANCE:${s}USDT`;
}

export default function TradingViewChart({ symbol, height = 500 }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tvSymbol = getTradingViewSymbol(symbol);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: '240',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(17, 17, 17, 1)',
      gridColor: 'rgba(42, 46, 57, 0.3)',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      studies: ['STD;Volume'],
      support_host: 'https://www.tradingview.com',
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [tvSymbol]);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: `${height}px`, width: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
    </div>
  );
}
