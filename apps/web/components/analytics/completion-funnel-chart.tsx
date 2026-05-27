import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { FunnelStage } from "~/lib/analytics/chart-transformers";

interface CompletionFunnelChartProps {
  data: FunnelStage[];
  loading?: boolean;
}

export const CompletionFunnelChart: React.FC<CompletionFunnelChartProps> = ({
  data,
  loading = false,
}) => {
  const isEmpty = !data || data.length === 0 || data.every((d) => d.count === 0);

  // Custom colors matching the cyberpunk neon palettes
  const colors = ["#3b82f6", "#f59e0b", "#22c55e"];

  return (
    <ChartWrapper
      title="Signal Conversion Funnel"
      subtitle="VIEWS vs. SESSION STARTS vs. BROADCAST ENTRIES"
      terminalTag="CONV_RATE"
      loading={loading}
      empty={isEmpty}
      emptyText="AWAITING FUNNEL SIGNAL"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <XAxis
            type="number"
            stroke="#6E6E6E"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            fontFamily="monospace"
            hide
          />
          <YAxis
            dataKey="stage"
            type="category"
            stroke="#FFF"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            fontFamily="monospace"
            width={75}
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
            dataKey="count"
            radius={[0, 4, 4, 0]}
            barSize={18}
            activeBar={{
              className: "drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]",
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Percentage Indicators Footer overlay */}
      {!isEmpty && !loading && (
        <div className="absolute right-6 bottom-4 flex flex-col gap-1 text-[9px] mono text-[#6E6E6E] uppercase font-bold text-right pointer-events-none select-none">
          {data.map((stage) => (
            <div key={stage.stage} className="flex items-center justify-end gap-2">
              <span>{stage.stage}:</span>
              <span className="text-white font-extrabold">{stage.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </ChartWrapper>
  );
};
