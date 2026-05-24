"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, 
  FileText, 
  Search, 
  ChevronRight,
  ExternalLink,
  Calendar,
  Sparkles
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
    <main className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden">
      {/* Premium Ambient Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-slate-200 hover:text-slate-100 transition-colors"
            >
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                Mirai Forms
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 border border-white/10 hover:border-white/20 transition-colors"
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
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-5 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
                My Forms
              </h2>
              <p className="mt-2 text-slate-400 max-w-xl text-sm leading-relaxed">
                Configure, manage, and design your digital experiences. Click on any form row to open the form builder.
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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search forms by title or description..."
              className="pl-10 bg-slate-900/60 border-white/[0.08] focus:border-indigo-500/50 text-slate-200 placeholder:text-slate-500 rounded-lg backdrop-blur-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Grid / Table */}
        <div className="rounded-xl border border-white/[0.08] bg-slate-950/45 backdrop-blur-xl shadow-2xl overflow-hidden">
          {isLoading ? (
            /* Loading State Skeleton */
            <div className="p-8 space-y-4">
              <div className="h-8 bg-white/[0.04] rounded-lg animate-pulse w-[150px]" />
              <div className="space-y-3 pt-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                    <div className="space-y-2 w-1/3">
                      <div className="h-5 bg-white/[0.04] rounded animate-pulse" />
                      <div className="h-3 bg-white/[0.02] rounded animate-pulse w-2/3" />
                    </div>
                    <div className="h-4 bg-white/[0.04] rounded animate-pulse w-[80px]" />
                    <div className="h-4 bg-white/[0.04] rounded animate-pulse w-[80px]" />
                    <div className="h-9 bg-white/[0.04] rounded animate-pulse w-[100px]" />
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
              <h3 className="text-lg font-semibold text-slate-200">Failed to load forms</h3>
              <p className="mt-1 text-sm text-slate-400 max-w-md">
                {error?.message || "There was a network error fetching your forms. Please refresh the page."}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-slate-200"
              >
                Retry
              </Button>
            </div>
          ) : filteredForms.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="mb-4 rounded-2xl bg-indigo-500/10 p-4 text-indigo-400 border border-indigo-500/20 shadow-inner">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">No forms found</h3>
              <p className="mt-2 text-sm text-slate-400 max-w-sm">
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
                    className="border-white/[0.08] text-slate-300 hover:bg-white/[0.04]"
                  >
                    Clear Filter
                  </Button>
                ) : (
                  <CreateFormModal />
                )}
              </div>
            </div>
          ) : (
            /* Table Component */
            <Table>
              <TableHeader className="bg-white/[0.01] border-b border-white/[0.06]">
                <TableRow className="hover:bg-transparent border-b border-white/[0.06]">
                  <TableHead className="text-slate-300 font-semibold py-4">Form Details</TableHead>
                  <TableHead className="text-slate-300 font-semibold py-4 hidden md:table-cell">Created</TableHead>
                  <TableHead className="text-slate-300 font-semibold py-4 hidden sm:table-cell">Last Updated</TableHead>
                  <TableHead className="text-slate-300 font-semibold py-4 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => (
                  <TableRow 
                    key={form.id}
                    className="group border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    {/* Form Details Column */}
                    <TableCell className="align-top py-4">
                      <Link 
                        href={`/dashboard/forms/${form.id}`}
                        className="block focus:outline-none"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                            {form.title}
                          </span>
                          <Sparkles className="h-3 w-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {form.description ? (
                          <p className="mt-1 text-xs text-slate-400 line-clamp-1 max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-2xl font-light">
                            {form.description}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500 italic font-light">
                            No description provided.
                          </p>
                        )}
                      </Link>
                    </TableCell>
                    
                    {/* Created At Column */}
                    <TableCell className="align-middle text-slate-400 text-xs hidden md:table-cell py-4">
                      <div className="flex items-center gap-1.5 font-light">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        {formatDate(form.createdAt)}
                      </div>
                    </TableCell>

                    {/* Last Updated At Column */}
                    <TableCell className="align-middle text-slate-400 text-xs hidden sm:table-cell py-4">
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
                          className="h-8 text-xs font-medium border border-transparent group-hover:border-white/[0.08] group-hover:bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-indigo-400 gap-1 rounded-lg transition-all"
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
