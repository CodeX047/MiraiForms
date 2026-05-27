import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DateTrendPoint } from "~/lib/analytics/chart-transformers";

interface ResponseTrendChartProps {
  data: DateTrendPoint[];
  loading?: boolean;
}

export const ResponseTrendChart: React.FC<ResponseTrendChartProps> = ({
  data,
  loading = false,
}) => {
  const isEmpty = !data || data.length === 0 || data.every((d) => d.responses === 0);

  return (
    <ChartWrapper
      title="Recorded Signals Trend"
      subtitle="BROADCAST ACTIVITY OVER THE PAST 7 DAYS"
      terminalTag="TRANS_TIME"
      loading={loading}
      empty={isEmpty}
      emptyText="AWAITING RESPONSE TREND"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E94B35" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#E94B35" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#6E6E6E"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            dy={8}
            fontFamily="monospace"
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
            contentStyle={{
              backgroundColor: "#0D0D0D",
              borderColor: "rgba(233, 75, 53, 0.3)",
              borderRadius: "4px",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#FFF",
            }}
            itemStyle={{ color: "#E94B35" }}
            cursor={{ stroke: "rgba(233, 75, 53, 0.2)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="responses"
            stroke="#E94B35"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorResponses)"
            activeDot={{
              r: 4,
              stroke: "#E94B35",
              strokeWidth: 1,
              fill: "#080808",
              className: "drop-shadow-[0_0_8px_rgba(233,75,53,0.8)]",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
