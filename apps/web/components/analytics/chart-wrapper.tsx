import React from "react";
import { Terminal, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "~/lib/utils";

interface ChartWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  loading?: boolean;
  empty?: boolean;
  emptyText?: string;
  terminalTag?: string;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  subtitle,
  loading = false,
  empty = false,
  emptyText = "NO TELEMETRY SIGNAL",
  terminalTag = "FEED_DATA",
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded border border-white/10 bg-[#0D0D0D]/60 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col h-[320px] select-none group hover:border-white/15 transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Visual cyber elements */}
      <div className="absolute inset-0 opacity-2 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-0" />
      <div className="absolute inset-0 opacity-1 pointer-events-none scanlines z-0" />

      {/* Cyber Header Grid */}
      <div className="border-b border-white/10 px-5 py-3.5 flex items-center justify-between relative z-10 bg-white/2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] mono text-[#E94B35] font-black uppercase tracking-widest drop-shadow-[0_0_8px_rgba(233,75,53,0.3)]">
              {title}
            </span>
          </div>
          {subtitle && (
            <span className="text-[9px] mono text-[#6E6E6E] uppercase tracking-wider block font-light">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 rounded border border-white/5 bg-white/2 text-[8px] mono text-[#6E6E6E] font-bold uppercase tracking-widest">
          <Terminal className="h-2.5 w-2.5 text-[#E94B35] shrink-0" />
          {terminalTag}
        </div>
      </div>

      {/* Chart Body */}
      <div className="flex-1 relative p-5 flex items-center justify-center z-10">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-[#6E6E6E]">
            <RefreshCw className="h-5 w-5 animate-spin text-[#E94B35]" />
            <span className="mono text-[9px] uppercase tracking-widest animate-pulse">
              RESOLVING_SIGNAL_FEED...
            </span>
          </div>
        ) : empty ? (
          <div className="flex flex-col items-center gap-3 text-center p-4">
            <div className="rounded-full bg-[#E94B35]/5 p-3 text-[#E94B35] border border-[#E94B35]/10 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="mono text-xs text-white font-extrabold tracking-widest uppercase">
              {emptyText}
            </span>
            <span className="mono text-[9px] text-[#6E6E6E] uppercase tracking-wider max-w-[200px]">
              Waiting for incoming respondent broadcast...
            </span>
          </div>
        ) : (
          <div className="w-full h-full relative z-10 flex items-center justify-center">
            {children}
          </div>
        )}
      </div>

      {/* Futuristic Border Accents */}
      <div className="absolute top-0 left-0 w-2 h-[1px] bg-[#E94B35]" />
      <div className="absolute top-0 left-0 w-[1px] h-2 bg-[#E94B35]" />
      <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-[#E94B35]" />
      <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-[#E94B35]" />
    </div>
  );
};
