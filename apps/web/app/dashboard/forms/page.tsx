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
  RefreshCw
} from "lucide-react";

import { useListForms } from "~/hooks/api/form";
import { CreateFormModal } from "~/components/create-form-modal";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredForms = forms?.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
                  avatarBox: "h-8 w-8 border border-white/10 hover:border-[#E94B35]/50 transition-colors"
                }
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
              <h2 className="heading-brutalist text-4xl text-white">
                My Forms
              </h2>
              <p className="mt-2 text-xs text-[#6E6E6E] max-w-xl leading-relaxed mono">
                / CONFIGURE, MANAGE, AND DESIGN DIGITAL EXPERIENCES.
              </p>
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
                  <div key={n} className="flex items-center justify-between border-b border-white/5 pb-4">
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
              <div className="mb-4 rounded-full bg-red-500/10 p-3 text-red-400">
                ⚠️
              </div>
              <h3 className="text-sm font-bold text-white mono">Failed to load forms</h3>
              <p className="mt-1 text-xs text-[#6E6E6E] max-w-md mono">
                {error?.message || "There was a network error fetching your forms. Please refresh the page."}
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
                  : "You haven't built any forms yet. Create your first form to start collecting responses."
                }
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
                  <TableHead className="text-white font-bold py-4 text-xs uppercase mono">Form Details</TableHead>
                  <TableHead className="text-white font-bold py-4 text-xs uppercase mono hidden md:table-cell">Created</TableHead>
                  <TableHead className="text-white font-bold py-4 text-xs uppercase mono hidden sm:table-cell">Last Updated</TableHead>
                  <TableHead className="text-white font-bold py-4 text-xs uppercase mono text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => (
                  <TableRow 
                    key={form.id}
                    className="group border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    {/* Form Details Column */}
                    <TableCell className="align-top py-4">
                      <Link 
                        href={`/dashboard/forms/${form.id}`}
                        className="block focus:outline-none"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white group-hover:text-[#E94B35] transition-colors text-sm">
                            {form.title}
                          </span>
                          <Sparkles className="h-3 w-3 text-[#E94B35] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {form.description ? (
                          <p className="mt-1 text-xs text-[#6E6E6E] line-clamp-1 max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-2xl font-light mono">
                            {form.description}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-[#6E6E6E]/40 italic font-light mono">
                            No description provided.
                          </p>
                        )}
                      </Link>
                    </TableCell>
                    
                    {/* Created At Column */}
                    <TableCell className="align-middle text-[#6E6E6E] text-xs hidden md:table-cell py-4 mono">
                      <div className="flex items-center gap-1.5 font-light">
                        <Calendar className="h-3.5 w-3.5 text-[#6E6E6E]" />
                        {formatDate(form.createdAt)}
                      </div>
                    </TableCell>

                    {/* Last Updated At Column */}
                    <TableCell className="align-middle text-[#6E6E6E] text-xs hidden sm:table-cell py-4 mono">
                      <div className="font-light">
                        {formatDate(form.updatedAt)}
                      </div>
                    </TableCell>

                    {/* Action Column */}
                    <TableCell className="align-middle text-right pr-6 py-4">
                      <Link href={`/dashboard/forms/${form.id}`}>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 text-xs font-semibold uppercase mono border border-white/10 group-hover:border-[#E94B35]/40 group-hover:bg-[#080808] hover:bg-[#0D0D0D] text-white hover:text-[#E94B35] gap-1 rounded transition-all cursor-pointer"
                        >
                          Builder
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </main>
  );
}
