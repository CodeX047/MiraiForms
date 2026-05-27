"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  FileText,
  Search,
  ChevronRight,
  Calendar,
  Sparkles,
  RefreshCw,
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useListForms, useTogglePublish, useUpdateFormVisibility } from "~/hooks/api/form";
import { CreateFormModal } from "~/components/create-form-modal";
import { DeleteFormDialog } from "~/components/delete-form-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "~/components/ui/table";

export default function FormsPage() {
  const { forms, isLoading, error } = useListForms();
  const { togglePublishAsync } = useTogglePublish();
  const { updateVisibilityAsync } = useUpdateFormVisibility();
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [updatingVisibilityId, setUpdatingVisibilityId] = useState<string | null>(null);
  const [deletingForm, setDeletingForm] = useState<{ id: string; title: string } | null>(null);

  const filteredForms =
    forms?.filter(
      (form) =>
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase())),
    ) || [];

  const formatDate = (dateStr: Date | string | null | undefined) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleTogglePublish = async (formId: string, currentStatus: boolean) => {
    setTogglingId(formId);
    try {
      await togglePublishAsync({ formId, published: !currentStatus });
      toast.success(`Form is now ${!currentStatus ? "PUBLISHED" : "OFFLINE"}`, {
        description: !currentStatus ? "Public submissions are now active." : "Public submissions are disabled.",
        className: "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
      });
    } catch (err: any) {
      toast.error("Failed to update status", {
        description: err?.message || "Something went wrong.",
        className: "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleUpdateVisibility = async (formId: string, newVisibility: "PUBLIC" | "UNLISTED") => {
    setUpdatingVisibilityId(formId);
    try {
      await updateVisibilityAsync({ formId, visibility: newVisibility });
      toast.success(`Form is now ${newVisibility}`, {
        description: newVisibility === "PUBLIC"
          ? "Form can be displayed in galleries and explore pages."
          : "Form is hidden from galleries. Direct link only.",
        className: "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
      });
    } catch (err: any) {
      toast.error("Failed to update visibility", {
        description: err?.message || "Something went wrong.",
        className: "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
      });
    } finally {
      setUpdatingVisibilityId(null);
    }
  };

  const handleCopyLink = (slug: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const url = `${baseUrl}/f/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("LINK_COPIED", {
      description: "Public link copied to your clipboard.",
      className: "mono uppercase text-xs border border-[#E94B35] bg-[#0D0D0D] text-white rounded",
    });
  };

  return (
    <main className="min-h-screen bg-[#080808] text-[#F5F5F5] relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />

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

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-6 py-10 relative z-10">
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs mono text-[#6E6E6E] hover:text-[#E94B35] mb-5 transition-colors group"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            BACK_TO_DASHBOARD
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="heading-brutalist text-4xl text-white">My Forms</h2>
            </div>
            <div>
              <CreateFormModal />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E6E]" />
            <Input
              placeholder="Search forms by title or description..."
              className="pl-10 bg-[#0D0D0D] border-white/10 focus:border-[#E94B35]/50 text-white placeholder-[#6E6E6E] rounded backdrop-blur-sm transition-all text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Grid / Table */}
        <div className="rounded border border-white/10 bg-[#0D0D0D] shadow-2xl overflow-hidden">
          {isLoading ? (
            /* Loading State Skeleton */
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs mono text-[#6E6E6E]">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#E94B35]" />
                LOADING_DATABASE_RECORDS...
              </div>
              <div className="space-y-3 pt-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="flex items-center justify-between border-b border-white/5 pb-4"
                  >
                    <div className="space-y-2 w-1/3">
                      <div className="h-4 bg-white/5 rounded animate-pulse" />
                      <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
                    </div>
                    <div className="h-4 bg-white/5 rounded animate-pulse w-[80px]" />
                    <div className="h-4 bg-white/5 rounded animate-pulse w-[80px]" />
                    <div className="h-8 bg-white/5 rounded animate-pulse w-[100px]" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            /* Error Alert */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-red-500/10 p-3 text-red-400">⚠️</div>
              <h3 className="text-sm font-bold text-white mono">Failed to load forms</h3>
              <p className="mt-1 text-xs text-[#6E6E6E] max-w-md mono">
                {error?.message ||
                  "There was a network error fetching your forms. Please refresh the page."}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#080808] border border-white/10 hover:border-red-500/50 hover:bg-[#0D0D0D] text-white text-xs mono"
              >
                RETRY_CONNECTION
              </Button>
            </div>
          ) : filteredForms.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="mb-4 rounded bg-[#E94B35]/10 p-4 text-[#E94B35] border border-[#E94B35]/20 shadow-inner">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white mono">No forms found</h3>
              <p className="mt-2 text-xs text-[#6E6E6E] max-w-sm mono">
                {searchTerm
                  ? `No forms match your search filter "${searchTerm}".`
                  : "You haven't built any forms yet. Create your first form to start collecting responses."}
              </p>
              <div className="mt-6">
                {searchTerm ? (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="border-white/10 text-white hover:bg-white/5 text-xs rounded mono"
                  >
                    CLEAR_FILTERS
                  </Button>
                ) : (
                  <CreateFormModal />
                )}
              </div>
            </div>
          ) : (
            /* Table Component */
            <Table>
              <TableHeader className="bg-white/5 border-b border-white/10">
                <TableRow className="hover:bg-transparent border-b border-white/10">
                  <TableHead className="text-white font-bold py-4 text-xs uppercase mono">
                    Form Details
                  </TableHead>
                  <TableHead className="text-white font-bold py-4 text-xs uppercase mono hidden md:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="text-white font-bold py-4 text-xs uppercase mono">
                    Status
                  </TableHead>
                  <TableHead className="text-white font-bold py-4 text-xs uppercase mono text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => {
                  const isPublished = form.published;
                  const isCurrentlyToggling = togglingId === form.id;

                  return (
                    <TableRow
                      key={form.id}
                      className="group border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      {/* Form Details Column */}
                      <TableCell className="align-top py-4">
                        <div className="block focus:outline-none">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white group-hover:text-[#E94B35] transition-colors text-sm">
                              {form.title}
                            </span>
                            <Sparkles className="h-3 w-3 text-[#E94B35] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {form.description ? (
                            <p className="mt-1 text-xs text-[#6E6E6E] line-clamp-1 max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl font-light mono">
                              {form.description}
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-[#6E6E6E]/40 italic font-light mono">
                              No description provided.
                            </p>
                          )}
                          <p className="text-[10px] mono text-[#6E6E6E] mt-1 uppercase">
                            SLUG: <span className="text-white/80 font-normal">/f/{form.slug}</span>
                          </p>
                        </div>
                      </TableCell>

                      {/* Created At Column */}
                      <TableCell className="align-middle text-[#6E6E6E] text-xs hidden md:table-cell py-4 mono">
                        <div className="flex items-center gap-1.5 font-light">
                          <Calendar className="h-3.5 w-3.5 text-[#6E6E6E]" />
                          {formatDate(form.createdAt)}
                        </div>
                      </TableCell>

                      {/* Publish Toggle Column */}
                      <TableCell className="align-middle py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={isPublished}
                              disabled={isCurrentlyToggling}
                              onCheckedChange={() => handleTogglePublish(form.id, isPublished)}
                              className="data-[state=checked]:bg-[#22c55e] data-[state=unchecked]:bg-neutral-800 border border-white/10"
                            />
                            <span
                              className={`text-[10px] font-bold mono uppercase tracking-wider ${
                                isPublished
                                  ? "text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                                  : "text-[#E94B35] opacity-80"
                              }`}
                            >
                              {isPublished ? "PUBLISHED" : "OFFLINE"}
                            </span>
                          </div>
                          {isPublished && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] mono text-[#6E6E6E] uppercase">Mode:</span>
                              <select
                                value={form.visibility}
                                disabled={updatingVisibilityId === form.id}
                                onChange={(e) => handleUpdateVisibility(form.id, e.target.value as "PUBLIC" | "UNLISTED")}
                                className="bg-[#0D0D0D] border border-white/10 hover:border-white/20 focus:border-[#E94B35]/50 text-white rounded text-[9px] mono px-1.5 py-0.5 outline-none transition-all cursor-pointer"
                              >
                                <option value="PUBLIC" className="bg-[#0D0D0D] text-white">PUBLIC</option>
                                <option value="UNLISTED" className="bg-[#0D0D0D] text-white">UNLISTED</option>
                              </select>
                              {updatingVisibilityId === form.id && (
                                <RefreshCw className="h-2.5 w-2.5 animate-spin text-[#E94B35]" />
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions Column */}
                      <TableCell className="align-middle text-right pr-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Copy Link Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyLink(form.slug)}
                            className="h-8 w-8 p-0 text-[#6E6E6E] hover:text-[#E94B35] border border-white/10 hover:border-[#E94B35]/40 hover:bg-[#080808] rounded transition-all cursor-pointer"
                            title="Copy Public Link"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>

                          {/* Delete Form Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingForm(form)}
                            className="h-8 w-8 p-0 text-[#6E6E6E] hover:text-[#FF3B30] border border-white/10 hover:border-[#FF3B30]/40 hover:bg-[#FF3B30]/5 rounded transition-all cursor-pointer"
                            title="Delete Form"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>

                          {/* Responses Button */}
                          <Link href={`/dashboard/forms/${form.id}/submissions`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs font-semibold uppercase mono border border-white/10 hover:border-[#E94B35]/40 hover:bg-[#080808] text-white hover:text-[#E94B35] gap-1 rounded transition-all cursor-pointer"
                            >
                              Responses
                            </Button>
                          </Link>

                          {/* Builder Button */}
                          <Link href={`/dashboard/forms/${form.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs font-semibold uppercase mono border border-white/10 hover:border-[#E94B35]/40 hover:bg-[#080808] text-white hover:text-[#E94B35] gap-1 rounded transition-all cursor-pointer"
                            >
                              Builder
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <DeleteFormDialog
        form={deletingForm}
        open={!!deletingForm}
        onOpenChange={(v) => {
          if (!v) setDeletingForm(null);
        }}
      />
    </main>
  );
}
