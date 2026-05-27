import React from "react";
import { cn } from "~/lib/utils";

interface AnalyticsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  description?: string;
  loading?: boolean;
  statusColor?: "red" | "green" | "blue" | "neutral";
  sparkline?: React.ReactNode;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  unit,
  icon,
  description,
  loading = false,
  statusColor = "red",
  sparkline,
  className,
  ...props
}) => {
  const dotColorClass = {
    red: "bg-[#E94B35] drop-shadow-[0_0_6px_rgba(233,75,53,0.8)]",
    green: "bg-[#22c55e] drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]",
    blue: "bg-[#3b82f6] drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]",
    neutral: "bg-neutral-500",
  }[statusColor];

  return (
    <div
      className={cn(
        "rounded border border-white/10 bg-[#0D0D0D]/60 backdrop-blur-md p-6 shadow-xl relative overflow-hidden group hover:border-[#E94B35]/30 hover:shadow-[0_0_25px_rgba(233,75,53,0.05)] transition-all duration-300 select-none",
        className
      )}
      {...props}
    >
      {/* Cyber Grid Sub-Layer Overlay */}
      <div className="absolute inset-0 opacity-2 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-0" />
      <div className="absolute inset-0 opacity-1 pointer-events-none scanlines z-0" />

      {/* Glow highlight */}
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#E94B35]/5 rounded-full blur-2xl group-hover:bg-[#E94B35]/10 transition-all pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse shrink-0", dotColorClass)} />
            <span className="text-[9px] mono text-[#6E6E6E] group-hover:text-white/60 transition-colors uppercase tracking-widest block font-bold">
              {title}
            </span>
          </div>
          {icon && <div className="text-[#6E6E6E] group-hover:text-[#E94B35] transition-colors duration-300">{icon}</div>}
        </div>

        {/* Card Body */}
        <div className="flex flex-col gap-1">
          {loading ? (
            <div className="space-y-2 py-1">
              <div className="h-8 bg-white/5 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-white/5 rounded animate-pulse w-1/3" />
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white mono tracking-tight group-hover:text-[#E94B35] transition-colors duration-300 drop-shadow-[0_0_12px_rgba(255,255,255,0.03)]">
                  {value}
                </span>
                {unit && <span className="text-xs mono text-[#6E6E6E] group-hover:text-white/40 transition-colors">{unit}</span>}
              </div>

              {description && (
                <span className="text-[10px] mono text-[#6E6E6E] uppercase tracking-wider block mt-1 leading-normal">
                  {description}
                </span>
              )}

              {sparkline && <div className="mt-3 w-full h-8">{sparkline}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
