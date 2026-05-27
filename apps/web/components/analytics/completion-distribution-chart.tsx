import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { TimeDistributionPoint } from "~/lib/analytics/chart-transformers";

interface CompletionDistributionChartProps {
  data: TimeDistributionPoint[];
  loading?: boolean;
}

export const CompletionDistributionChart: React.FC<CompletionDistributionChartProps> = ({
  data,
  loading = false,
}) => {
  const isEmpty = !data || data.length === 0 || data.every((d) => d.count === 0);

  return (
    <ChartWrapper
      title="Signal Speed Logs"
      subtitle="COMPLETION TIME DISTRIBUTION ANALYSIS"
      terminalTag="SPEED_DIST"
      loading={loading}
      empty={isEmpty}
      emptyText="NO SPEED TELEMETRY"
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
            dataKey="range"
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
              borderColor: "rgba(233, 75, 53, 0.3)",
              borderRadius: "4px",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#FFF",
            }}
          />
          <Bar
            dataKey="count"
            fill="#a855f7"
            radius={[4, 4, 0, 0]}
            barSize={24}
            activeBar={{
              fill: "#c084fc",
              className: "drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]",
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
