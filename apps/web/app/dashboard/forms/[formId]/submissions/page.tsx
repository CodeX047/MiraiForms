"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Calendar,
  Layers,
  Database,
  Clock,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

import { useGetFeilds, useGetFormSubmissions, useListForms } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import { calculateMetrics } from "~/lib/analytics/calculate-metrics";
import { formatDuration } from "~/lib/analytics/format-duration";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "~/components/ui/table";

// Helper function to simplify user-agent parsing
function parseUserAgent(uaStr: string | null | undefined): string {
  if (!uaStr) return "Unknown / Device";
  
  const ua = uaStr.toLowerCase();
  let browser = "Unknown";
  let os = "Unknown";

  if (ua.includes("chrome") || ua.includes("chromium")) {
    if (ua.includes("edg")) browser = "Edge";
    else if (ua.includes("opr") || ua.includes("opera")) browser = "Opera";
    else browser = "Chrome";
  } else if (ua.includes("safari")) {
    if (ua.includes("chrome")) browser = "Chrome";
    else browser = "Safari";
  } else if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("msie") || ua.includes("trident")) {
    browser = "IE";
  }

  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("macintosh") || ua.includes("mac os")) os = "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) os = "iOS";
  else if (ua.includes("linux")) os = "Linux";

  return `${browser} / ${os}`;
}

export default function FormSubmissionsPage() {
  const { formId } = useParams() as { formId: string };

  const { forms } = useListForms();
  const { feilds, isLoading: loadingFields, error: errorFields } = useGetFeilds(formId);
  const { submissions, isLoading: loadingSubmissions, error: errorSubmissions } = useGetFormSubmissions(formId);

  const formDetails = forms?.find((f) => f.id === formId);

  const isLoading = loadingFields || loadingSubmissions;
  const isError = errorFields || errorSubmissions;

  // Aggregate Stats using production-grade utilities
  const metrics = calculateMetrics(submissions);
  const totalSubmissions = metrics.totalCount;

  const lastSubmissionDate = submissions && submissions.length > 0
    ? new Date(submissions[0]!.createdAt)
    : null;

  const handleExportCSV = () => {
    if (!submissions || submissions.length === 0 || !feilds || feilds.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    // Dynamic field labels as headers
    const headers = ["Timestamp", "Device Metadata", ...feilds.map((f) => f.label)];
    
    const rows = submissions.map((sub) => {
      const timestamp = new Date(sub.createdAt).toLocaleString();
      const device = parseUserAgent(sub.metadata?.userAgent);
      
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
            {submissions && submissions.length > 0 && (
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

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Total Submissions */}
          <div className="rounded border border-white/10 bg-[#0D0D0D] p-6 shadow-xl relative overflow-hidden group hover:border-[#E94B35]/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
              <Database className="h-20 w-20" />
            </div>
            <span className="text-[10px] mono text-[#6E6E6E] uppercase tracking-widest block mb-2">
              RECORDED_ENTRIES
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white mono drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                {isLoading ? "--" : totalSubmissions}
              </span>
              <span className="text-xs mono text-[#6E6E6E]">signals</span>
            </div>
          </div>

          {/* Card 2: Average Completion Time */}
          <div className="rounded border border-white/10 bg-[#0D0D0D] p-6 shadow-xl relative group hover:border-[#E94B35]/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white pointer-events-none">
              <Clock className="h-20 w-20" />
            </div>
            
            <div className="relative inline-block group/tooltip mb-2">
              <span className="text-[10px] mono text-[#6E6E6E] uppercase tracking-widest cursor-help border-b border-dashed border-white/20 pb-0.5 select-none">
                AVG_COMPLETION_TIME
              </span>
              
              {/* Premium cyberpunk tooltip */}
              <div className="absolute bottom-full left-0 mb-2 w-52 scale-95 opacity-0 pointer-events-none group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 transition-all duration-200 z-50 rounded border border-white/10 bg-[#080808] p-2.5 shadow-2xl text-[10px] mono text-[#A0A0A0] leading-relaxed">
                <span className="text-white font-bold block mb-1">TELEMETRY METRIC</span>
                Average time users take to complete this form.
                <div className="absolute top-full left-4 -mt-[1px] border-4 border-transparent border-t-[#080808] z-50" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white mono drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                {isLoading ? (
                  "--"
                ) : metrics.average !== null ? (
                  formatDuration(metrics.average)
                ) : (
                  <span className="text-[16px] font-extrabold text-[#E94B35]/70 tracking-wider uppercase">NO TELEMETRY DATA</span>
                )}
              </span>
              {!isLoading && metrics.average !== null && (
                <span className="text-xs mono text-[#6E6E6E]">per completion</span>
              )}
            </div>

            {/* Premium sub-metrics block */}
            {!isLoading && metrics.validCount > 0 && (
              <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-[10px] mono text-[#6E6E6E] relative z-10">
                <div>
                  <span className="block text-[8px] text-[#6E6E6E]/60 uppercase tracking-wider mb-0.5">Min</span>
                  <span className="text-white font-semibold">{formatDuration(metrics.min!)}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#6E6E6E]/60 uppercase tracking-wider mb-0.5">Median</span>
                  <span className="text-white font-semibold">{formatDuration(metrics.median!)}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#6E6E6E]/60 uppercase tracking-wider mb-0.5">Max</span>
                  <span className="text-white font-semibold">{formatDuration(metrics.max!)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Last Submission Received */}
          <div className="rounded border border-white/10 bg-[#0D0D0D] p-6 shadow-xl relative overflow-hidden group hover:border-[#E94B35]/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
              <Calendar className="h-20 w-20" />
            </div>
            <span className="text-[10px] mono text-[#6E6E6E] uppercase tracking-widest block mb-2">
              LAST_SIGNAL_DETECTED
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-white mono tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] truncate max-w-full">
                {isLoading ? "--" : lastSubmissionDate ? formatDate(lastSubmissionDate) : "OFFLINE"}
              </span>
            </div>
          </div>
        </div>

        {/* Responses Grid Table */}
        <div className="rounded border border-white/10 bg-[#0D0D0D] shadow-2xl overflow-hidden">
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
                  {submissions.map((sub) => (
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
                          {parseUserAgent(sub.metadata?.userAgent)}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
