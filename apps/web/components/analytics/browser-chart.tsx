import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DistributionPoint } from "~/lib/analytics/chart-transformers";

interface BrowserChartProps {
  data: DistributionPoint[];
  loading?: boolean;
}

export const BrowserChart: React.FC<BrowserChartProps> = ({
  data,
  loading = false,
}) => {
  const isEmpty = !data || data.length === 0 || data.every((d) => d.value === 0);

  // Chrome, Safari, Firefox, Edge, Other
  const COLORS = ["#f59e0b", "#3b82f6", "#ef4444", "#10b981", "#6b7280"];

  return (
    <ChartWrapper
      title="Application Signal Feeds"
      subtitle="BROWSER ENGINE DETECTED RATIOS"
      terminalTag="BR_FEED"
      loading={loading}
      empty={isEmpty}
      emptyText="NO BROWSER DATA"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="#6E6E6E"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            fontFamily="monospace"
            dy={8}
          />
          <YAxis
            stroke="#6E6E6E"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            fontFamily="monospace"
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.02)" }}
            contentStyle={{
              backgroundColor: "#0D0D0D",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#FFF",
            }}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            barSize={18}
            activeBar={{
              className: "drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]",
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
