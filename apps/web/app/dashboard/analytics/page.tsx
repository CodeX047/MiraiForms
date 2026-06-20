"use client";

import React, { useState } from "react";
import { Database, Clock, TrendingUp, Gauge, Calendar, ChevronDown } from "lucide-react";

import { useGetFormSubmissions, useListForms } from "~/hooks/api/form";
import { calculateMetrics } from "~/lib/analytics/calculate-metrics";
import { formatDuration } from "~/lib/analytics/format-duration";
import {
  getBrowserData,
  getDeviceData,
  getFunnelData,
  getResponseTrend,
  getTimeDistribution,
} from "~/lib/analytics/chart-transformers";

import { AnalyticsCard } from "~/components/analytics/analytics-card";
import { ResponseTrendChart } from "~/components/analytics/response-trend-chart";
import { CompletionFunnelChart } from "~/components/analytics/completion-funnel-chart";
import { DeviceChart } from "~/components/analytics/device-chart";
import { BrowserChart } from "~/components/analytics/browser-chart";
import { CompletionDistributionChart } from "~/components/analytics/completion-distribution-chart";

export default function AnalyticsPage() {
  const { forms, isLoading: formsLoading } = useListForms();
  const [userSelectedFormId, setUserSelectedFormId] = useState<string>("");

  const selectedFormId = userSelectedFormId || (forms?.[0]?.id ?? "");

  const { submissions, isLoading: loadingSubmissions } = useGetFormSubmissions(
    selectedFormId || "__none__",
  );

  const selectedForm = forms?.find((f) => f.id === selectedFormId);
  const isLoading = formsLoading || loadingSubmissions;

  // Aggregate Stats
  const metrics = calculateMetrics(submissions);
  const totalSubmissions = metrics.totalCount;

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

  // Chart Data
  const funnelData = getFunnelData(totalSubmissions);
  const trendData = getResponseTrend(submissions);
  const deviceData = getDeviceData(submissions);
  const browserData = getBrowserData(submissions);
  const timeDistData = getTimeDistribution(submissions);

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header with Form Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
        <div>
          <h3 className="heading-brutalist text-2xl uppercase tracking-wider text-white">
            Analytics
          </h3>
          <p className="text-[9px] mono text-[#6E6E6E] uppercase tracking-wider mt-1">
            TELEMETRY_INSIGHTS // EVIL_CHARTS
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Form Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedFormId}
              onChange={(e) => setUserSelectedFormId(e.target.value)}
              className="appearance-none bg-[#0D0D0D] border border-white/10 hover:border-[#E94B35]/40 text-white rounded px-4 py-2 pr-8 text-xs font-bold mono uppercase tracking-wider cursor-pointer transition-all focus:border-[#E94B35]/50 focus:outline-none min-w-[200px]"
            >
              {formsLoading ? (
                <option value="">Loading...</option>
              ) : forms && forms.length > 0 ? (
                forms.map((form) => (
                  <option key={form.id} value={form.id} className="bg-[#0D0D0D] text-white">
                    {form.title}
                  </option>
                ))
              ) : (
                <option value="">No forms available</option>
              )}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E6E] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Form Signal */}
      {selectedForm && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] mono text-[#E94B35] uppercase font-bold">ACTIVE_FEED:</span>
          <span className="text-xs mono text-white font-bold">{selectedForm.title}</span>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase mono px-2 py-0.5 rounded bg-[#00FF99]/10 border border-[#00FF99]/20 text-[#00FF99]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF99] animate-pulse" />
            {selectedForm.published ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      )}

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
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
          value={isLoading ? "--" : `${totalSubmissions > 0 ? funnelData[2]!.percentage : 0}%`}
          unit=""
          icon={<TrendingUp className="h-4 w-4" />}
          description="Session completion"
          loading={isLoading}
          statusColor="green"
        />
        <AnalyticsCard
          title="Avg Pace"
          value={
            isLoading ? "--" : metrics.average !== null ? formatDuration(metrics.average) : "0s"
          }
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

      {/* Interactive Evil Charts (Primary 2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponseTrendChart data={trendData} loading={isLoading} />
        <CompletionFunnelChart data={funnelData} loading={isLoading} />
      </div>

      {/* Sub-Insights Charts (Secondary 3-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DeviceChart data={deviceData} loading={isLoading} />
        <BrowserChart data={browserData} loading={isLoading} />
        <CompletionDistributionChart data={timeDistData} loading={isLoading} />
      </div>
    </div>
  );
}
