import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DistributionPoint } from "~/lib/analytics/chart-transformers";

interface DeviceChartProps {
  data: DistributionPoint[];
  loading?: boolean;
}

export const DeviceChart: React.FC<DeviceChartProps> = ({
  data,
  loading = false,
}) => {
  const isEmpty = !data || data.length === 0 || data.every((d) => d.value === 0);

  // Neon palette for Device Distribution
  const COLORS = ["#3b82f6", "#22c55e", "#a855f7"];

  return (
    <ChartWrapper
      title="Hardware Telemetry"
      subtitle="DEVICE CLASSIFICATION DISTRIBUTION"
      terminalTag="HW_CLASS"
      loading={loading}
      empty={isEmpty}
      emptyText="NO DEVICE DATA"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={45}
            outerRadius={65}
            paddingAngle={4}
            dataKey="value"
            activeShape={{
              strokeWidth: 2,
              className: "drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]",
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(8, 8, 8, 0.8)" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0D0D0D",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#FFF",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconSize={8}
            iconType="circle"
            formatter={(value, entry) => {
              const payload = entry as { payload?: { value?: number } };
              const count = payload?.payload?.value || 0;
              return (
                <span className="text-[9px] mono text-[#6E6E6E] uppercase tracking-wider font-bold">
                  {value}: <span className="text-white">{count}</span>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
