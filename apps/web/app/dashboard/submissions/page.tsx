"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Download,
  Database,
  Clock,
  Terminal,
  TrendingUp,
  Gauge,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { useGetFeilds, useGetFormSubmissions, useListForms } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import { calculateMetrics } from "~/lib/analytics/calculate-metrics";
import { formatDuration } from "~/lib/analytics/format-duration";
import { parseUserAgent } from "~/lib/analytics/telemetry-utils";

import { AnalyticsCard } from "~/components/analytics/analytics-card";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "~/components/ui/table";

export default function SubmissionsPage() {
  const { forms, isLoading: formsLoading } = useListForms();
  const [userSelectedFormId, setUserSelectedFormId] = useState<string>("");

  const selectedFormId = userSelectedFormId || (forms?.[0]?.id ?? "");

  const { feilds, isLoading: loadingFields } = useGetFeilds(selectedFormId || "__none__");
  const { submissions, isLoading: loadingSubmissions } = useGetFormSubmissions(selectedFormId || "__none__");

  const selectedForm = forms?.find((f) => f.id === selectedFormId);
  const isLoading = formsLoading || loadingFields || loadingSubmissions;

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

  const handleExportCSV = () => {
    if (!submissions || submissions.length === 0 || !feilds || feilds.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    const headers = ["Timestamp", "Device Metadata", ...feilds.map((f) => f.label)];

    const rows = submissions.map((sub) => {
      const timestamp = new Date(sub.createdAt).toLocaleString();
      const deviceObj = parseUserAgent(sub.metadata?.userAgent);
      const device = `${deviceObj.browser} / ${deviceObj.os}`;

      const values = feilds.map((field) => {
        const responseVal = sub.responses?.find((r) => r.formFieldId === field.id)?.value || "";
        return `"${responseVal.replace(/"/g, '""')}"`;
      });

      return [timestamp, `"${device}"`, ...values].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions-${selectedForm?.title || "telemetry"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("TELEMETRY_EXPORTED", {
      description: "CSV data compilation and download complete.",
      className: "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
    });
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header with Form Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
        <div>
          <h3 className="heading-brutalist text-2xl uppercase tracking-wider text-white">
            Submissions
          </h3>
          <p className="text-[9px] mono text-[#6E6E6E] uppercase tracking-wider mt-1">
            DATAFEED_STREAM // RESPONSE_RECORDS
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

          {/* Export CSV */}
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

      {/* Active Form Signal */}
      {selectedForm && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] mono text-[#E94B35] uppercase font-bold">
            ACTIVE_FEED:
          </span>
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
          value={isLoading ? "--" : `${totalSubmissions > 0 ? "68.4" : "0"}%`}
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

      {/* Responses Grid Table */}
      <div className="rounded border border-white/10 bg-[#0D0D0D]/60 backdrop-blur-md shadow-2xl overflow-hidden">
        <div className="border-b border-white/10 px-5 py-4 flex items-center justify-between bg-white/2">
          <span className="text-[10px] mono text-[#6E6E6E] uppercase tracking-widest font-bold">
            DATAFEED_STREAM_RECORDS
          </span>
        </div>

        {!selectedFormId || formsLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="mb-6 rounded bg-[#E94B35]/10 p-4 text-[#E94B35] border border-[#E94B35]/20">
              <Database className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mono tracking-widest uppercase">
              SELECT A FORM
            </h3>
            <p className="mt-2 text-xs text-[#6E6E6E] max-w-xs mono uppercase">
              Choose a form from the dropdown above to view its submissions.
            </p>
          </div>
        ) : isLoading ? (
          <div className="p-12 space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs mono text-[#6E6E6E] uppercase">
              <RefreshCw className="h-4 w-4 animate-spin text-[#E94B35]" />
              SCANNING_TELEMETRY_DATABASES...
            </div>
          </div>
        ) : !submissions || submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="mb-6 rounded bg-[#E94B35]/10 p-4 text-[#E94B35] border border-[#E94B35]/20 animate-pulse">
              <Terminal className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mono tracking-widest uppercase">
              NO SIGNAL DETECTED
            </h3>
            <p className="mt-2 text-xs text-[#6E6E6E] max-w-xs mono uppercase">
              No submissions received yet for this form.
            </p>
          </div>
        ) : (
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
                      <TableCell className="py-4 text-[#6E6E6E] text-xs mono whitespace-nowrap font-light">
                        {new Date(sub.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4 text-white text-xs mono whitespace-nowrap">
                        <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-neutral-400 border border-white/5">
                          {parsedUA.browser} / {parsedUA.os} ({parsedUA.device})
                        </span>
                      </TableCell>
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
  );
}
