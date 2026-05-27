"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Calendar,
  Database,
  Clock,
  Terminal,
  TrendingUp,
  Gauge,
} from "lucide-react";
import { toast } from "sonner";

import { useGetFeilds, useGetFormSubmissions, useListForms } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import { calculateMetrics } from "~/lib/analytics/calculate-metrics";
import { formatDuration } from "~/lib/analytics/format-duration";
import { parseUserAgent } from "~/lib/analytics/telemetry-utils";
import {
  getBrowserData,
  getDeviceData,
  getFunnelData,
  getResponseTrend,
  getTimeDistribution,
} from "~/lib/analytics/chart-transformers";

// Custom Cyberpunk Analytics Components
import { AnalyticsCard } from "~/components/analytics/analytics-card";
import { ResponseTrendChart } from "~/components/analytics/response-trend-chart";
import { CompletionFunnelChart } from "~/components/analytics/completion-funnel-chart";
import { DeviceChart } from "~/components/analytics/device-chart";
import { BrowserChart } from "~/components/analytics/browser-chart";
import { CompletionDistributionChart } from "~/components/analytics/completion-distribution-chart";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "~/components/ui/table";

export default function FormSubmissionsPage() {
  const { formId } = useParams() as { formId: string };

  const { forms } = useListForms();
  const { feilds, isLoading: loadingFields, error: errorFields } = useGetFeilds(formId);
  const { submissions, isLoading: loadingSubmissions, error: errorSubmissions } = useGetFormSubmissions(formId);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const formDetails = forms?.find((f) => f.id === formId);

  const isLoading = !mounted || loadingFields || loadingSubmissions;
  const isError = errorFields || errorSubmissions;

  // Aggregate Stats using production-grade utilities
  const metrics = calculateMetrics(submissions);
  const totalSubmissions = metrics.totalCount;



  // 1. Calculate Today & Weekly signals
  let responsesToday = 0;
  let responsesThisWeek = 0;

  if (submissions) {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    submissions.forEach((sub) => {
      const subTime = new Date(sub.createdAt).getTime();
      if (subTime >= oneDayAgo) responsesToday++;
      if (subTime >= sevenDaysAgo) responsesThisWeek++;
    });
  }

  // 2. Conversion & Funnel stats
  const funnelData = getFunnelData(totalSubmissions);
  const conversionRate = totalSubmissions > 0 ? funnelData[2]!.percentage : 0;

  // 3. Chart data calculations
  const trendData = getResponseTrend(submissions);
  const deviceData = getDeviceData(submissions);
  const browserData = getBrowserData(submissions);
  const timeDistData = getTimeDistribution(submissions);

  const handleExportCSV = () => {
    if (!submissions || submissions.length === 0 || !feilds || feilds.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    // Dynamic field labels as headers
    const headers = ["Timestamp", "Device Metadata", ...feilds.map((f) => f.label)];
    
    const rows = submissions.map((sub) => {
      const timestamp = new Date(sub.createdAt).toLocaleString();
      const deviceObj = parseUserAgent(sub.metadata?.userAgent);
      const device = `${deviceObj.browser} / ${deviceObj.os}`;
      
      const values = feilds.map((field) => {
        const responseVal = sub.responses?.find((r) => r.formFieldId === field.id)?.value || "";
        // Clean double quotes for valid CSV formatting
        return `"${responseVal.replace(/"/g, '""')}"`;
      });

      return [timestamp, `"${device}"`, ...values].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions-${formDetails?.title || "telemetry"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("TELEMETRY_EXPORTED", {
      description: "CSV data compilation and download complete.",
      className: "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
    });
  };



  return (
    <main className="min-h-screen bg-[#080808] text-[#F5F5F5] relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
      <div className="absolute inset-0 opacity-3 pointer-events-none scanlines z-0" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
            >
              <h1 className="text-sm font-bold tracking-widest uppercase mono">
                Mirai<span className="text-[#E94B35]">Forms</span>
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "h-8 w-8 border border-white/10 hover:border-[#E94B35]/50 transition-colors",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-10 relative z-10">
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/forms"
            className="inline-flex items-center gap-2 text-xs mono text-[#6E6E6E] hover:text-[#E94B35] mb-5 transition-colors group"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            BACK_TO_FORMS
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="heading-brutalist text-4xl text-white">Submissions</h2>
              <p className="text-xs mono text-[#E94B35] uppercase tracking-wider mt-1.5 font-bold">
                FEED: <span className="text-white">{formDetails?.title || "Retrieving info..."}</span>
              </p>
            </div>
            {submissions && submissions.length > 0 && !isLoading && (
              <Button
                onClick={handleExportCSV}
                className="gap-2 bg-[#080808] border border-[#E94B35] text-white hover:bg-[#E94B35] transition-all cursor-pointer font-bold mono text-xs uppercase tracking-wider rounded px-5 py-2.5 shadow-[0_0_20px_rgba(233,75,53,0.15)]"
              >
                <Download className="h-4 w-4" />
                EXPORT_CSV
              </Button>
            )}
          </div>
        </div>

        {/* 1. Telemetry Summary Cards (6-Column Cyberpunk Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-8">
          <AnalyticsCard
            title="Total Entries"
            value={isLoading ? "--" : totalSubmissions}
            unit="signals"
            icon={<Database className="h-4 w-4" />}
            description="Active database logs"
            loading={isLoading}
            statusColor="green"
          />
          <AnalyticsCard
            title="Conv Rate"
            value={isLoading ? "--" : `${conversionRate}%`}
            unit=""
            icon={<TrendingUp className="h-4 w-4" />}
            description="Session completion"
            loading={isLoading}
            statusColor="green"
          />
          <AnalyticsCard
            title="Avg Pace"
            value={isLoading ? "--" : metrics.average !== null ? formatDuration(metrics.average) : "0s"}
            unit=""
            icon={<Clock className="h-4 w-4" />}
            description="Mean submission time"
            loading={isLoading}
            statusColor="blue"
          />
          <AnalyticsCard
            title="Median Pace"
            value={isLoading ? "--" : metrics.median !== null ? formatDuration(metrics.median) : "0s"}
            unit=""
            icon={<Gauge className="h-4 w-4" />}
            description="Median submission time"
            loading={isLoading}
            statusColor="neutral"
          />
          <AnalyticsCard
            title="Entries 24h"
            value={isLoading ? "--" : responsesToday}
            unit="signals"
            icon={<Calendar className="h-4 w-4" />}
            description="Past 24 hours"
            loading={isLoading}
            statusColor="red"
          />
          <AnalyticsCard
            title="Entries 7d"
            value={isLoading ? "--" : responsesThisWeek}
            unit="signals"
            icon={<Calendar className="h-4 w-4" />}
            description="Past 7 days"
            loading={isLoading}
            statusColor="red"
          />
        </div>

        {/* 2. Interactive Evil Charts (Primary 2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ResponseTrendChart data={trendData} loading={isLoading} />
          <CompletionFunnelChart data={funnelData} loading={isLoading} />
        </div>

        {/* 3. Sub-Insights Charts (Secondary 3-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DeviceChart data={deviceData} loading={isLoading} />
          <BrowserChart data={browserData} loading={isLoading} />
          <CompletionDistributionChart data={timeDistData} loading={isLoading} />
        </div>

        {/* 4. Responses Grid Table */}
        <div className="rounded border border-white/10 bg-[#0D0D0D]/60 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="border-b border-white/10 px-5 py-4 flex items-center justify-between bg-white/2">
            <span className="text-[10px] mono text-[#6E6E6E] uppercase tracking-widest font-bold">
              DATAFEED_STREAM_RECORDS
            </span>
          </div>

          {isLoading ? (
            /* Loading State */
            <div className="p-12 space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs mono text-[#6E6E6E] uppercase">
                <RefreshCw className="h-4 w-4 animate-spin text-[#E94B35]" />
                SCANNING_TELEMETRY_DATABASES...
              </div>
            </div>
          ) : isError ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-red-500/10 p-3 text-red-400">⚠️</div>
              <h3 className="text-sm font-bold text-white mono">Failed to fetch responses</h3>
              <p className="mt-1 text-xs text-[#6E6E6E] max-w-md mono">
                There was an error scanning the form submissions records. Please try again.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#080808] border border-white/10 hover:border-red-500/50 hover:bg-[#0D0D0D] text-white text-xs mono"
              >
                REBOOT_SCAN
              </Button>
            </div>
          ) : !submissions || submissions.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="mb-6 rounded bg-[#E94B35]/10 p-4 text-[#E94B35] border border-[#E94B35]/20 animate-pulse">
                <Terminal className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mono tracking-widest uppercase">
                NO SIGNAL DETECTED
              </h3>
              <p className="mt-2 text-xs text-[#6E6E6E] max-w-xs mono uppercase">
                No submissions received yet. Public signals are offline.
              </p>
            </div>
          ) : (
            /* Scrollable Brutalist Responses Table */
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-white/5 border-b border-white/10">
                  <TableRow className="hover:bg-transparent border-b border-white/10">
                    <TableHead className="text-white font-bold py-4 text-xs uppercase mono whitespace-nowrap">
                      Timestamp
                    </TableHead>
                    <TableHead className="text-white font-bold py-4 text-xs uppercase mono whitespace-nowrap">
                      Metadata
                    </TableHead>
                    {feilds?.map((field) => (
                      <TableHead
                        key={field.id}
                        className="text-white font-bold py-4 text-xs uppercase mono whitespace-nowrap"
                      >
                        {field.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => {
                    const parsedUA = parseUserAgent(sub.metadata?.userAgent);
                    return (
                      <TableRow
                        key={sub.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        {/* Timestamp Column */}
                        <TableCell className="py-4 text-[#6E6E6E] text-xs mono whitespace-nowrap font-light">
                          {new Date(sub.createdAt).toLocaleString()}
                        </TableCell>

                        {/* User Agent / OS Column */}
                        <TableCell className="py-4 text-white text-xs mono whitespace-nowrap">
                          <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-neutral-400 border border-white/5">
                            {parsedUA.browser} / {parsedUA.os} ({parsedUA.device})
                          </span>
                        </TableCell>

                        {/* Dynamic Field Values */}
                        {feilds?.map((field) => {
                          const response = sub.responses?.find((r) => r.formFieldId === field.id);
                          return (
                            <TableCell
                              key={field.id}
                              className="py-4 text-white/90 text-xs mono whitespace-nowrap font-light"
                            >
                              {response ? (
                                response.value
                              ) : (
                                <span className="text-[#6E6E6E]/40 italic">-</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
