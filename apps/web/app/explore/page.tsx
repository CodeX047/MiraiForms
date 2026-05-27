"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  ArrowRight,
  RefreshCw,
  Globe,
  Plus,
  ArrowLeft,
  Gamepad2,
  Briefcase,
  Calendar,
  MessageSquare,
  Heart,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useListPublicForms } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function ExplorePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { forms, isLoading, error } = useListPublicForms();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"FORMS" | "TEMPLATES">("FORMS");

  // Pre-configured SaaS Templates Showcase
  const templates = [
    {
      name: "Anime Fan Survey",
      description: "Gather detailed information about anime watch preferences, genres, and character ratings.",
      category: "Entertainment",
      icon: Heart,
      uses: "2.4k uses",
      fields: [
        { label: "Favorite Genre", type: "SELECT", choices: ["Shonen", "Seinen", "Slice of Life", "Isekai"] },
        { label: "Rate last series watched", type: "NUMBER" },
        { label: "Additional Feedback", type: "TEXT" }
      ],
    },
    {
      name: "Gaming Tournament",
      description: "Standard team signup form for e-sports events, leagues, and casual bracket registration.",
      category: "Events",
      icon: Gamepad2,
      uses: "1.8k uses",
      fields: [
        { label: "Team Name", type: "TEXT" },
        { label: "Discord Handle", type: "TEXT" },
        { label: "Skill Division", type: "SELECT", choices: ["Beginner", "Intermediate", "Pro"] }
      ],
    },
    {
      name: "Startup Hiring",
      description: "Modern intake pipeline for startups, early-stage applicants, and developers.",
      category: "Recruitment",
      icon: Briefcase,
      uses: "3.2k uses",
      fields: [
        { label: "Portfolio Link", type: "TEXT" },
        { label: "Secure Email", type: "EMAIL" },
        { label: "Years of Experience", type: "NUMBER" }
      ],
    },
    {
      name: "Event RSVP",
      description: "Fast RSVP confirmation checklist for tech meetups, hacker camps, and grid meetups.",
      category: "Events",
      icon: Calendar,
      uses: "4.1k uses",
      fields: [
        { label: "Attending?", type: "YES_NO" },
        { label: "Secure Email", type: "EMAIL" },
        { label: "Dietary Restrictions", type: "TEXT" }
      ],
    },
    {
      name: "Community Feedback",
      description: "Anonymous intake form for communities, DAOs, and group coordinates.",
      category: "Feedback",
      icon: MessageSquare,
      uses: "2.9k uses",
      fields: [
        { label: "How did you hear about us?", type: "SELECT", choices: ["Twitter/X", "Github", "Friend", "Other"] },
        { label: "Improvement ideas", type: "TEXT" }
      ],
    },
    {
      name: "Competition Entry",
      description: "Secure category-based submission gate for creative contests and developers.",
      category: "Contests",
      icon: Trophy,
      uses: "1.5k uses",
      fields: [
        { label: "Submission Title", type: "TEXT" },
        { label: "Project Category", type: "SELECT", choices: ["Frontend", "Fullstack", "Hardware", "Design"] }
      ],
    },
  ];

  // Filtering Logic
  const filteredForms =
    forms?.filter(
      (form) =>
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

  const filteredTemplates = templates.filter(
    (temp) =>
      temp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      temp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      temp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080808] relative overflow-hidden selection:bg-[#E94B35] selection:text-white pb-20">
      {/* Visual cyber-brutalist backgrounds */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
      <div className="absolute inset-0 opacity-3 pointer-events-none scanlines z-0" />

      {/* Branded Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080808]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-widest uppercase mono text-white">
              Mirai<span className="text-[#E94B35]">Forms</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xs font-semibold uppercase mono border border-white/10 hover:border-[#E94B35]/40 hover:bg-white/5 text-white gap-1 rounded transition-all px-4 py-2 cursor-pointer">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Breadcrumb back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs mono text-[#6E6E6E] hover:text-[#E94B35] mb-6 transition-colors group"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          BACK_TO_HOME
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-8 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#E94B35]/10 border border-[#E94B35]/20 text-[#E94B35] rounded text-[9px] mono uppercase font-bold tracking-wider mb-3">
              <Globe className="h-3.5 w-3.5" />
              Centralized Public Feed
            </div>
            <h1 className="heading-brutalist text-4xl md:text-6xl text-white uppercase tracking-wider">
              Explore Forms & Templates
            </h1>
            <p className="text-xs mono text-[#6E6E6E] uppercase tracking-wider mt-2">
              BROWSE PUBLIC REGISTRYS // DEPLOY VERIFIED SAAS SCHEMAS IN REALTIME
            </p>
          </div>
          <Link href="/dashboard/forms">
            <Button className="bg-[#080808] border border-[#E94B35] text-white hover:bg-[#E94B35] transition-all cursor-pointer font-bold mono text-xs uppercase tracking-wider rounded px-6 py-3 shadow-[0_0_20px_rgba(233,75,53,0.1)] hover:shadow-[0_0_30px_rgba(233,75,53,0.25)] flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Build a Form
            </Button>
          </Link>
        </div>

        {/* Search and Tabs */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-[#0D0D0D] border border-white/10 p-1 rounded w-fit">
            <button
              onClick={() => setActiveTab("FORMS")}
              className={`px-4 py-2 rounded text-xs font-bold mono uppercase tracking-wider cursor-pointer transition-all ${
                activeTab === "FORMS"
                  ? "bg-[#E94B35] text-white shadow-[0_0_15px_rgba(233,75,53,0.2)]"
                  : "text-[#6E6E6E] hover:text-white"
              }`}
            >
              Public Transmissions
            </button>
            <button
              onClick={() => setActiveTab("TEMPLATES")}
              className={`px-4 py-2 rounded text-xs font-bold mono uppercase tracking-wider cursor-pointer transition-all ${
                activeTab === "TEMPLATES"
                  ? "bg-[#E94B35] text-white shadow-[0_0_15px_rgba(233,75,53,0.2)]"
                  : "text-[#6E6E6E] hover:text-white"
              }`}
            >
              Intelligent Templates
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E6E]" />
            <Input
              placeholder={
                activeTab === "FORMS"
                  ? "Search public forms by title or description..."
                  : "Search templates by name, description, or category..."
              }
              className="pl-10 bg-[#0D0D0D] border-white/10 focus:border-[#E94B35]/50 text-white placeholder-[#6E6E6E] rounded backdrop-blur-sm transition-all text-xs h-10 mono"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid Display */}
        {!mounted || isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-4 text-[#6E6E6E]">
            <RefreshCw className="h-6 w-6 animate-spin text-[#E94B35]" />
            <span className="mono text-xs uppercase tracking-widest">LOADING_TELEMETRY_FEED...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-white/10 bg-[#0D0D0D] rounded">
            <div className="mb-4 rounded bg-red-500/10 p-4 text-red-400 border border-red-500/20">⚠️</div>
            <h3 className="text-sm font-bold text-white mono">Failed to fetch public forms</h3>
            <p className="mt-1 text-xs text-[#6E6E6E] mono">{error.message}</p>
          </div>
        ) : (
          <div>
            <AnimatePresence mode="wait">
              {activeTab === "FORMS" ? (
                <motion.div
                  key="forms"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredForms.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-20 text-center border border-white/5 bg-[#0D0D0D]/30 rounded">
                      <Compass className="h-8 w-8 text-[#6E6E6E] mb-3" />
                      <h4 className="text-sm font-bold text-white mono">No public forms found</h4>
                      <p className="text-xs text-[#6E6E6E] max-w-sm mt-2 mono">
                        There are currently no public published forms matching your filter. Use the dashboard to publish yours!
                      </p>
                    </div>
                  ) : (
                    filteredForms.map((form) => (
                      <div
                        key={form.id}
                        className="group relative border border-white/10 bg-[#0D0D0D]/50 rounded p-6 transition-all hover:border-[#E94B35]/40 hover:shadow-[0_0_25px_rgba(233,75,53,0.05)] flex flex-col justify-between min-h-[220px]"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] mono text-[#6E6E6E] uppercase border border-white/10 rounded px-2 py-0.5">
                              VISIBILITY // PUBLIC
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                          </div>

                          <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#E94B35] transition-all tracking-wide">
                            {form.title}
                          </h3>

                          {form.description ? (
                            <p className="text-xs text-[#808080] line-clamp-3 leading-relaxed mb-4 font-light">
                              {form.description}
                            </p>
                          ) : (
                            <p className="text-xs text-[#6E6E6E]/40 italic mb-4 font-light mono">
                              No description provided.
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                          <span className="text-[9px] mono text-[#6E6E6E]">
                            SLUG: /f/{form.slug}
                          </span>
                          
                          <Link href={`/f/${form.slug}`} target="_blank">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-[10px] font-bold uppercase mono border border-[#E94B35]/20 hover:border-[#E94B35] text-white hover:text-white hover:bg-[#E94B35] gap-1.5 rounded transition-all cursor-pointer px-3"
                            >
                              Open Form
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>

                        {/* Interactive neon accent bottom line */}
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E94B35] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredTemplates.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-20 text-center border border-white/5 bg-[#0D0D0D]/30 rounded">
                      <Compass className="h-8 w-8 text-[#6E6E6E] mb-3" />
                      <h4 className="text-sm font-bold text-white mono">No templates found</h4>
                      <p className="text-xs text-[#6E6E6E] max-w-sm mt-2 mono">
                        No intelligent templates match your filter term. Try another search.
                      </p>
                    </div>
                  ) : (
                    filteredTemplates.map((template, idx) => {
                      const Icon = template.icon;
                      return (
                        <div
                          key={idx}
                          className="group relative border border-white/10 bg-[#0D0D0D]/50 rounded p-6 transition-all hover:border-[#E94B35]/40 hover:shadow-[0_0_25px_rgba(233,75,53,0.05)] flex flex-col justify-between min-h-[250px]"
                        >
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div className="p-2.5 bg-[#080808] border border-white/10 rounded group-hover:border-[#E94B35]/40 transition-all text-[#E94B35]">
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] mono text-[#6E6E6E] uppercase border border-white/10 rounded px-2 py-0.5">
                                {template.category}
                              </span>
                            </div>

                            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#E94B35] transition-all tracking-wide">
                              {template.name}
                            </h3>

                            <p className="text-xs text-[#808080] leading-relaxed mb-4 font-light">
                              {template.description}
                            </p>

                            {/* Predefined Field Indicators */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {template.fields.map((field, fieldIdx) => (
                                <span
                                  key={fieldIdx}
                                  className="px-2 py-0.5 bg-[#080808] border border-white/5 rounded text-[8px] text-[#6E6E6E] mono uppercase"
                                >
                                  {field.label} ({field.type})
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                            <span className="text-[9px] mono text-[#6E6E6E]">
                              {template.uses}
                            </span>
                            
                            <Link href="/dashboard/forms">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-[10px] font-bold uppercase mono border border-[#E94B35]/20 hover:border-[#E94B35] text-white hover:text-white hover:bg-[#E94B35] gap-1.5 rounded transition-all cursor-pointer px-3"
                              >
                                Use Template
                                <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
                              </Button>
                            </Link>
                          </div>

                          {/* Interactive neon accent bottom line */}
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E94B35] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
