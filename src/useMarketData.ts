import { useState, useEffect, useRef, useCallback } from "react";

export interface AssetData {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  prevPrice?: number;
  direction?: "up" | "down" | "flat";
}

export interface ChartPoint {
  time: string;
  price: number;
}

export interface MarketState {
  xauusd: AssetData;
  btcusdt: AssetData;
  ethusdt: AssetData;
  xauChart: ChartPoint[];
  btcChart: ChartPoint[];
  ethChart: ChartPoint[];
  goldLastUpdated: string;
  loading: boolean;
  connected: boolean;
}

const INITIAL_STATE: MarketState = {
  xauusd: { symbol: "XAUUSD", price: 0, change: 0, changePct: 0 },
  btcusdt: { symbol: "BTCUSDT", price: 0, change: 0, changePct: 0 },
  ethusdt: { symbol: "ETHUSDT", price: 0, change: 0, changePct: 0 },
  xauChart: [],
  btcChart: [],
  ethChart: [],
  goldLastUpdated: "",
  loading: true,
  connected: false,
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useMarketData(_selectedAsset?: string) {
  const [state, setState] = useState<MarketState>(INITIAL_STATE);
  const wsRef = useRef<WebSocket | null>(null);
  const goldIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const btcPrevRef = useRef<number>(0);
  const ethPrevRef = useRef<number>(0);
  const btcOpenRef = useRef<number>(0);
  const ethOpenRef = useRef<number>(0);

  // Fetch gold chart history (intraday)
  const fetchGoldChart = useCallback(async () => {
    try {
      const res = await fetch(
        "https://xaus.com/api/v1/intraday?symbol=xau&hours=6"
      );
      const data = await res.json();
      if (data?.points && Array.isArray(data.points)) {
        const chart: ChartPoint[] = data.points.map((p: { t: number; p: number }) => ({
          time: formatTime(new Date(p.t * 1000)),
          price: p.p,
        }));
        setState((prev) => ({ ...prev, xauChart: chart }));
      }
    } catch (e) {
      // silently fail
    }
  }, []);

  // Fetch gold spot price
  const fetchGoldPrice = useCallback(async () => {
    try {
      const res = await fetch("https://xaus.com/api/v1/spot");
      const data = await res.json();
      if (data?.spot_usd_oz) {
        const price = data.spot_usd_oz;
        const updatedAt = data.updated_at
          ? new Date(data.updated_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : formatTime(new Date());

        setState((prev) => {
          const prevPrice = prev.xauusd.price || price;
          const direction =
            price > prevPrice ? "up" : price < prevPrice ? "down" : "flat";

          // Derive 24h change from chart if available
          let change = prev.xauusd.change;
          let changePct = prev.xauusd.changePct;
          if (prev.xauChart.length > 0) {
            const firstPrice = prev.xauChart[0].price;
            change = price - firstPrice;
            changePct = (change / firstPrice) * 100;
          }

          return {
            ...prev,
            xauusd: {
              symbol: "XAUUSD",
              price,
              change,
              changePct,
              prevPrice,
              direction,
            },
            goldLastUpdated: updatedAt,
            loading: false,
          };
        });
      }
    } catch (e) {
      // silently fail
    }
  }, []);

  // Fetch BTC/ETH chart history from Binance
  const fetchCryptoChart = useCallback(async (symbol: string) => {
    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=72`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        const chart: ChartPoint[] = data.map((k: unknown[]) => ({
          time: formatTime(new Date(k[0] as number)),
          price: parseFloat(k[4] as string),
        }));
        setState((prev) => ({
          ...prev,
          ...(symbol === "BTCUSDT" ? { btcChart: chart } : { ethChart: chart }),
        }));
        // Store open price for 24h change calc
        if (symbol === "BTCUSDT" && data[0]) {
          btcOpenRef.current = parseFloat(data[0][1] as string);
        }
        if (symbol === "ETHUSDT" && data[0]) {
          ethOpenRef.current = parseFloat(data[0][1] as string);
        }
      }
    } catch (e) {
      // silently fail
    }
  }, []);

  // Connect to Binance WebSocket
  const connectBinanceWS = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(
      "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker"
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setState((prev) => ({ ...prev, connected: true }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const data = msg.data;
      if (!data) return;

      const symbol: string = data.s;
      const price = parseFloat(data.c);
      const open = parseFloat(data.o);
      const change = price - open;
      const changePct = (change / open) * 100;
      const now = formatTime(new Date());

      if (symbol === "BTCUSDT") {
        const prevPrice = btcPrevRef.current || price;
        const direction =
          price > prevPrice ? "up" : price < prevPrice ? "down" : "flat";
        btcPrevRef.current = price;

        setState((prev) => ({
          ...prev,
          btcusdt: { symbol: "BTCUSDT", price, change, changePct, prevPrice, direction },
          loading: false,
          btcChart: [
            ...prev.btcChart.slice(-143),
            { time: now, price },
          ],
        }));
      } else if (symbol === "ETHUSDT") {
        const prevPrice = ethPrevRef.current || price;
        const direction =
          price > prevPrice ? "up" : price < prevPrice ? "down" : "flat";
        ethPrevRef.current = price;

        setState((prev) => ({
          ...prev,
          ethusdt: { symbol: "ETHUSDT", price, change, changePct, prevPrice, direction },
          loading: false,
          ethChart: [
            ...prev.ethChart.slice(-143),
            { time: now, price },
          ],
        }));
      }
    };

    ws.onerror = () => {
      setState((prev) => ({ ...prev, connected: false }));
    };

    ws.onclose = () => {
      setState((prev) => ({ ...prev, connected: false }));
      // Reconnect after 5s
      setTimeout(connectBinanceWS, 5000);
    };
  }, []);

  useEffect(() => {
    // Initial fetches
    fetchGoldPrice();
    fetchGoldChart();
    fetchCryptoChart("BTCUSDT");
    fetchCryptoChart("ETHUSDT");

    // Poll gold every 30s
    goldIntervalRef.current = setInterval(() => {
      fetchGoldPrice();
    }, 30000);

    // Refresh charts every 5 min
    const chartInterval = setInterval(() => {
      fetchGoldChart();
    }, 300000);

    // Connect WebSocket for crypto
    connectBinanceWS();

    return () => {
      if (goldIntervalRef.current) clearInterval(goldIntervalRef.current);
      clearInterval(chartInterval);
      if (wsRef.current) wsRef.current.close();
    };
  }, [fetchGoldPrice, fetchGoldChart, fetchCryptoChart, connectBinanceWS]);

  return state;
}
