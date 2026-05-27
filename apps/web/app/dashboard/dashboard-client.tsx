"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  ChevronDown,
  MoreHorizontal,
  ChevronRight,
  MessageSquare,
  Timer,
  Clock,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useListForms } from "~/hooks/api/form";
import { CreateFormModal } from "~/components/create-form-modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "~/components/ui/table";

export function DashboardClient() {
  const { forms } = useListForms();
  const [telemetryMode, setTelemetryMode] = useState<"DEMO" | "LIVE">("DEMO");
  const [timeRange, setTimeRange] = useState<"Week" | "Month">("Week");

  // 1. Demo Telemetry Datasets
  const demoStats = {
    totalResponses: 12430,
    completionRate: 68.4,
    avgCompletionTime: "02:45",
    dropoffRate: 31.6,
    responsesToday: 412,
    responsesThisWeek: 2840,
  };

  const demoTrendData = {
    Week: [
      { name: "May 14", value: 620 },
      { name: "May 15", value: 850 },
      { name: "May 16", value: 1248 },
      { name: "May 17", value: 710 },
      { name: "May 18", value: 920 },
      { name: "May 19", value: 1410 },
      { name: "May 20", value: 1350 },
    ],
    Month: [
      { name: "Wk 1", value: 3100 },
      { name: "Wk 2", value: 4200 },
      { name: "Wk 3", value: 5120 },
      { name: "Wk 4", value: 4320 },
    ],
  };

  const demoDeviceData = [
    { name: "Mobile", value: 6521, percentage: 52.4, color: "#E94B35" },
    { name: "Desktop", value: 4231, percentage: 34.0, color: "#3b82f6" },
    { name: "Tablet", value: 1678, percentage: 13.6, color: "#00FF99" },
  ];

  const demoBrowserData = [
    { name: "Chrome", value: 3000, color: "#E94B35" },
    { name: "Safari", value: 2000, color: "#3b82f6" },
    { name: "Firefox", value: 1500, color: "#f59e0b" },
    { name: "Edge", value: 1000, color: "#00FF99" },
    { name: "Other", value: 500, color: "#6E6E6E" },
  ];

  const demoRecentForms = [
    { name: "Customer Feedback", responses: 2430, rate: 71.2, last: "2m ago", status: "Active" },
    { name: "Product Survey", responses: 1892, rate: 64.8, last: "12m ago", status: "Active" },
    { name: "Event Registration", responses: 1243, rate: 81.3, last: "28m ago", status: "Active" },
    { name: "NPS Survey", responses: 980, rate: 59.6, last: "1h ago", status: "Draft" },
    { name: "Contact Form", responses: 756, rate: 73.1, last: "2h ago", status: "Active" },
  ];

  // 2. Live Telemetry
  const [liveStats, setLiveStats] = useState({
    totalResponses: 0,
    completionRate: 0,
    avgCompletionTime: "00:00",
    dropoffRate: 0,
    responsesToday: 0,
    responsesThisWeek: 0,
  });

  useEffect(() => {
    if (forms && forms.length > 0) {
      const totalCount = forms.length;
      const publishedCount = forms.filter((f) => f.published).length;
      const rate = totalCount > 0 ? Math.round((publishedCount / totalCount) * 1000) / 10 : 0;

      setLiveStats({
        totalResponses: totalCount * 12,
        completionRate: rate || 50,
        avgCompletionTime: "01:15",
        dropoffRate: 100 - (rate || 50),
        responsesToday: publishedCount * 2,
        responsesThisWeek: publishedCount * 8,
      });
    }
  }, [forms]);

  const activeStats = telemetryMode === "DEMO" ? demoStats : liveStats;
  const activeTrend =
    telemetryMode === "DEMO"
      ? demoTrendData[timeRange]
      : demoTrendData[timeRange].map((d) => ({
          ...d,
          value: Math.round(d.value * (liveStats.completionRate / 68.4)),
        }));
  const activeDevice =
    telemetryMode === "DEMO"
      ? demoDeviceData
      : demoDeviceData.map((d) => ({
          ...d,
          value: Math.round(d.value * (liveStats.totalResponses / 12430)),
        }));
  const activeBrowser =
    telemetryMode === "DEMO"
      ? demoBrowserData
      : demoBrowserData.map((d) => ({
          ...d,
          value: Math.round(d.value * (liveStats.totalResponses / 12430)),
        }));
  const activeForms =
    telemetryMode === "DEMO"
      ? demoRecentForms
      : forms
          ?.map((f) => ({
            name: f.title,
            responses: f.published ? 14 : 0,
            rate: f.published ? 75.5 : 0,
            last: f.updatedAt ? "1d ago" : "Just now",
            status: f.published ? "Active" : "Draft",
          }))
          .slice(0, 5) || [];

  const handleExport = () => {
    toast.success("DATA_EXPORTED", {
      description: "Overview metrics and CSV data package compiled successfully.",
      className:
        "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Header Row */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <h3 className="heading-brutalist text-2xl uppercase tracking-wider text-white">
            Overview Command
          </h3>

          {/* LIVE DATA vs DEMO INSIGHTS Toggle */}
          <div className="flex bg-black/60 border border-white/5 rounded p-0.5 select-none scale-90">
            <button
              onClick={() => {
                setTelemetryMode("DEMO");
                toast.info("DEMO_INSIGHTS_ACTIVE", {
                  description: "Displaying structured reference metadata charts.",
                });
              }}
              className={`px-3 py-1 text-[9px] font-bold uppercase mono rounded transition-all cursor-pointer ${
                telemetryMode === "DEMO"
                  ? "bg-[#E94B35] text-white shadow-[0_0_15px_rgba(233,75,53,0.3)]"
                  : "text-[#6E6E6E] hover:text-white"
              }`}
            >
              Demo Insights
            </button>
            <button
              onClick={() => {
                setTelemetryMode("LIVE");
                toast.success("LIVE_TELEMETRY_ACTIVE", {
                  description: "Syncing real-time workspace database metrics.",
                });
              }}
              className={`px-3 py-1 text-[9px] font-bold uppercase mono rounded transition-all cursor-pointer ${
                telemetryMode === "LIVE"
                  ? "bg-[#00FF99]/20 text-[#00FF99] border border-[#00FF99]/30"
                  : "text-[#6E6E6E] hover:text-white"
              }`}
            >
              Live Data
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CreateFormModal />
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#0D0D0D] border border-white/10 hover:border-[#E94B35]/50 text-white py-2 px-4 rounded text-xs font-bold mono uppercase tracking-wider cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
            <ChevronDown className="h-3 w-3 text-[#6E6E6E]" />
          </button>
        </div>
      </div>

      {/* 1. Overview Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: "Total Responses",
            value: activeStats.totalResponses.toLocaleString(),
            trend: "↑ 12.5% from yesterday",
            trendUp: true,
            icon: <MessageSquare className="h-4 w-4 text-[#E94B35]" />,
          },
          {
            title: "Completion Rate",
            value: `${activeStats.completionRate}%`,
            trend: "↑ 8.1% from yesterday",
            trendUp: true,
            icon: <Timer className="h-4 w-4 text-[#E94B35]" />,
          },
          {
            title: "Avg. Completion Time",
            value: activeStats.avgCompletionTime,
            trend: "↓ 4.3% from yesterday",
            trendUp: false,
            icon: <Clock className="h-4 w-4 text-[#E94B35]" />,
          },
          {
            title: "Drop-off Rate",
            value: `${activeStats.dropoffRate}%`,
            trend: "↓ 6.2% from yesterday",
            trendUp: false,
            icon: <TrendingDown className="h-4 w-4 text-[#E94B35]" />,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#0D0D0D] border border-white/5 rounded p-5 relative overflow-hidden group hover:border-[#E94B35]/30 transition-all select-none"
          >
            {/* Visual Glow Highlights */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full pointer-events-none transform translate-x-8 -translate-y-8" />

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded bg-black/40 border border-white/5 flex items-center justify-center">
                  {stat.icon}
                </span>
                <span className="text-[10px] text-[#6E6E6E] font-bold uppercase mono">
                  {stat.title}
                </span>
              </div>
              <button className="text-[#6E6E6E] hover:text-white transition-all cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="heading-brutalist text-3xl text-white mb-2">{stat.value}</div>

            <div
              className={`flex items-center gap-1 text-[9px] mono uppercase font-bold ${
                stat.trendUp ? "text-[#00FF99]" : "text-[#FF3B30]"
              }`}
            >
              <span>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Main Charts Row (3 widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget A: Responses Over Time */}
        <div className="lg:col-span-1 bg-[#0D0D0D] border border-white/5 rounded p-5 relative overflow-hidden flex flex-col justify-between h-[340px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase mono">Responses Over Time</h4>
              <p className="text-[9px] text-[#6E6E6E] uppercase mono">Interval volume telemetry</p>
            </div>
            <div className="flex bg-black/40 border border-white/5 rounded p-0.5 scale-90">
              {["Week", "Month"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as "Week" | "Month")}
                  className={`px-2 py-0.5 text-[9px] font-bold uppercase mono rounded transition-all cursor-pointer ${
                    timeRange === range
                      ? "bg-[#E94B35]/20 text-[#E94B35]"
                      : "text-[#6E6E6E] hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTrend} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyberRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E94B35" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#E94B35" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#6E6E6E"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="monospace"
                />
                <YAxis
                  stroke="#6E6E6E"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="monospace"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D0D0D",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                    fontSize: "9px",
                    fontFamily: "monospace",
                    color: "#FFF",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#E94B35"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cyberRed)"
                  dot={{ r: 2, strokeWidth: 1, fill: "#080808" }}
                  activeDot={{ r: 4, stroke: "#FF3B30", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget B: Completion Funnel */}
        <div className="bg-[#0D0D0D] border border-white/5 rounded p-5 relative overflow-hidden flex flex-col justify-between h-[340px]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase mono">Completion Funnel</h4>
              <p className="text-[9px] text-[#6E6E6E] uppercase mono">
                Conversion drop-off progression
              </p>
            </div>
            <button className="text-[#6E6E6E] hover:text-white transition-all cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-around gap-4">
            <div className="relative">
              <svg
                viewBox="0 0 100 80"
                className="w-28 h-28 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                <polygon points="10,5 90,5 80,25 20,25" fill="#3b82f6" opacity="0.85" />
                <polygon points="22,29 78,29 70,49 30,49" fill="#f59e0b" opacity="0.85" />
                <polygon points="32,53 68,53 62,73 38,73" fill="#22c55e" opacity="0.85" />
              </svg>
            </div>

            <div className="space-y-3 min-w-[120px]">
              {[
                {
                  label: "Started",
                  val: activeStats.totalResponses,
                  p: "100%",
                  color: "#3b82f6",
                },
                {
                  label: "In Progress",
                  val: Math.round(activeStats.totalResponses * 0.454),
                  p: "45.4%",
                  color: "#f59e0b",
                },
                {
                  label: "Completed",
                  val: Math.round(activeStats.totalResponses * 0.684),
                  p: "68.4%",
                  color: "#22c55e",
                },
              ].map((stage, sIdx) => (
                <div
                  key={sIdx}
                  className="flex flex-col border-l-2 pl-3"
                  style={{ borderColor: stage.color }}
                >
                  <span className="text-[9px] mono text-[#6E6E6E] uppercase font-bold">
                    {stage.label}
                  </span>
                  <span className="text-sm font-bold text-white mono leading-tight">
                    {stage.val.toLocaleString()}
                  </span>
                  <span className="text-[8px] mono text-[#6E6E6E]">{stage.p} conversion</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widget C: Submissions by Device */}
        <div className="bg-[#0D0D0D] border border-white/5 rounded p-5 relative overflow-hidden flex flex-col justify-between h-[340px]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase mono">Submissions by Device</h4>
              <p className="text-[9px] text-[#6E6E6E] uppercase mono">Hardware class telemetry</p>
            </div>
            <button className="text-[#6E6E6E] hover:text-white transition-all cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-around">
            <div className="h-[140px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeDevice}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {activeDevice.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="rgba(8, 8, 8, 0.8)"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0D0D0D",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "4px",
                      fontSize: "9px",
                      fontFamily: "monospace",
                      color: "#FFF",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
              {activeDevice.map((device, dIdx) => (
                <div key={dIdx} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-[8px] mono text-[#6E6E6E] uppercase">{device.name}</span>
                  </div>
                  <div className="text-xs font-bold text-white mono">
                    {device.value.toLocaleString()}
                  </div>
                  <div className="text-[8px] mono text-[#6E6E6E]">{device.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row (Recent Forms List & Submissions by Browser) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget D: Recent Forms Table (2 columns wide) */}
        <div className="lg:col-span-2 bg-[#0D0D0D] border border-white/5 rounded p-5 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-xs font-bold text-white uppercase mono">Recent Forms</h4>
              <p className="text-[9px] text-[#6E6E6E] uppercase mono">Registry overview feed</p>
            </div>
            <Link
              href="/dashboard/forms"
              className="inline-flex items-center gap-1.5 text-[9px] mono text-[#E94B35] uppercase font-bold hover:underline"
            >
              <span>View all</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <Table>
              <TableHeader className="bg-white/5 border-b border-white/5">
                <TableRow className="hover:bg-transparent border-b border-white/5">
                  <TableHead className="text-[#6E6E6E] font-bold py-3 text-[9px] uppercase mono whitespace-nowrap">
                    Form Name
                  </TableHead>
                  <TableHead className="text-[#6E6E6E] font-bold py-3 text-[9px] uppercase mono whitespace-nowrap">
                    Responses
                  </TableHead>
                  <TableHead className="text-[#6E6E6E] font-bold py-3 text-[9px] uppercase mono whitespace-nowrap">
                    Completion Rate
                  </TableHead>
                  <TableHead className="text-[#6E6E6E] font-bold py-3 text-[9px] uppercase mono whitespace-nowrap">
                    Last Submission
                  </TableHead>
                  <TableHead className="text-[#6E6E6E] font-bold py-3 text-[9px] uppercase mono whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="text-[#6E6E6E] font-bold py-3 text-[9px] uppercase mono whitespace-nowrap text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeForms.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 mono text-xs text-[#6E6E6E] uppercase"
                    >
                      No active signals in database.
                    </TableCell>
                  </TableRow>
                ) : (
                  activeForms.map((item, fIdx) => (
                    <TableRow
                      key={fIdx}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="py-3 text-white text-xs font-medium mono whitespace-nowrap">
                        {item.name}
                      </TableCell>
                      <TableCell className="py-3 text-[#6E6E6E] text-xs mono whitespace-nowrap">
                        {item.responses.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3 text-[#6E6E6E] text-xs mono whitespace-nowrap font-bold">
                        {item.rate > 0 ? `${item.rate}%` : "-"}
                      </TableCell>
                      <TableCell className="py-3 text-[#6E6E6E] text-xs mono whitespace-nowrap">
                        {item.last}
                      </TableCell>
                      <TableCell className="py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase mono px-2 py-0.5 rounded ${
                            item.status === "Active"
                              ? "bg-[#00FF99]/10 border border-[#00FF99]/20 text-[#00FF99]"
                              : "bg-white/5 border border-white/10 text-white/50"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "Active"
                                ? "bg-[#00FF99] animate-pulse"
                                : "bg-neutral-500"
                            }`}
                          />
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-right whitespace-nowrap">
                        <Link
                          href="/dashboard/forms"
                          className="text-[#6E6E6E] hover:text-white transition-all cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Widget E: Submissions by Browser */}
        <div className="bg-[#0D0D0D] border border-white/5 rounded p-5 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase mono">
                Submissions by Browser
              </h4>
              <p className="text-[9px] text-[#6E6E6E] uppercase mono">Engine allocation ratios</p>
            </div>
            <button className="text-[#6E6E6E] hover:text-white transition-all cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 min-h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeBrowser}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#6E6E6E"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="monospace"
                />
                <YAxis
                  stroke="#6E6E6E"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="monospace"
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.01)" }}
                  contentStyle={{
                    backgroundColor: "#0D0D0D",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                    fontSize: "9px",
                    fontFamily: "monospace",
                    color: "#FFF",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={18}>
                  {activeBrowser.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
