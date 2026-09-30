import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ChartPoint } from "../hooks/useMarketData";

interface PriceChartProps {
  data: ChartPoint[];
  color?: string;
  entryPrice?: number;
  targetPrice?: number;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-xs text-white shadow-lg">
        ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    );
  }
  return null;
};

export default function PriceChart({
  data,
  color = "#22c55e",
  entryPrice,
  targetPrice,
}: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm">
        Loading chart data...
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1 || 1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          tick={{ fill: "#475569", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[minPrice - padding, maxPrice + padding]}
          tick={{ fill: "#475569", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={60}
          tickFormatter={(v) =>
            v >= 1000
              ? `$${(v / 1000).toFixed(1)}k`
              : `$${v.toFixed(0)}`
          }
        />
        <Tooltip content={<CustomTooltip />} />
        {entryPrice && (
          <ReferenceLine
            y={entryPrice}
            stroke="#64748b"
            strokeDasharray="4 4"
            label={{
              value: "ENTRY",
              fill: "#94a3b8",
              fontSize: 10,
              position: "insideTopLeft",
            }}
          />
        )}
        {targetPrice && (
          <ReferenceLine
            y={targetPrice}
            stroke={color}
            strokeDasharray="4 4"
            label={{
              value: "TARGET",
              fill: color,
              fontSize: 10,
              position: "insideTopRight",
            }}
          />
        )}
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${color.replace("#", "")})`}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
