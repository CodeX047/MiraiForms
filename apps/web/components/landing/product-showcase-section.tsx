"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Check,
  GripVertical,
  Palette,
  Sparkles,
} from "lucide-react";

type Tab = "builder" | "responses" | "analytics";

export function ProductShowcaseSection() {
  const [activeTab, setActiveTab] = useState<Tab>("builder");

  const tabs = [
    { id: "builder" as Tab, label: "Form Builder", icon: GripVertical },
    { id: "responses" as Tab, label: "Responses", icon: Eye },
    { id: "analytics" as Tab, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <section
      id="product"
      className="relative bg-[#080808] py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 overflow-hidden border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="mono text-[#6E6E6E] text-[10px] uppercase tracking-widest mb-4 text-center">
          / 001 / PRODUCT
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="heading-brutalist text-3xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 text-center max-w-4xl mx-auto"
        >
          See MiraiForms
          <br />
          in action.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#6E6E6E] text-sm md:text-base text-center max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-4"
        >
          Build beautiful forms in minutes. Track responses in real-time. Analyze data with powerful
          dashboards.
        </motion.p>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-2 md:gap-3 mb-8 md:mb-12 flex-wrap px-4"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 md:px-6 py-2 md:py-3 rounded-full mono text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer
                  ${
                    activeTab === tab.id
                      ? "bg-[#E94B35] text-white shadow-[0_0_30px_rgba(233,75,53,0.4)]"
                      : "bg-[#0D0D0D] text-[#6E6E6E] border border-white/10 hover:border-white/20"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "builder" && (
              <motion.div
                key="builder"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="border border-white/10 bg-gradient-to-br from-[#0D0D0D] to-[#080808] rounded-lg p-6 md:p-12 shadow-2xl backdrop-blur-xl"
              >
                {/* Form Builder Preview */}
                <div className="space-y-4">
                  {[
                    { type: "email", label: "Email Address", icon: Mail, required: true },
                    { type: "text", label: "Full Name", icon: Type, required: true },
                    { type: "date", label: "Birth Date", icon: Calendar, required: false },
                  ].map((field, idx) => {
                    const Icon = field.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border border-white/5 bg-[#080808] p-4 md:p-5 rounded-lg hover:border-[#E94B35]/30 transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#E94B35]/10 border border-[#E94B35]/20 rounded">
                            <Icon className="w-4 h-4 text-[#E94B35]" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{field.label}</div>
                            <div className="mono text-[#6E6E6E] text-[10px] uppercase">
                              {field.type}
                            </div>
                          </div>
                        </div>
                        {field.required && (
                          <div className="px-2.5 py-0.5 bg-[#E94B35]/20 border border-[#E94B35]/30 rounded text-[#E94B35] text-[10px] mono">
                            Required
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "responses" && (
              <motion.div
                key="responses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="border border-white/10 bg-gradient-to-br from-[#0D0D0D] to-[#080808] rounded-lg p-6 md:p-12 shadow-2xl backdrop-blur-xl"
              >
                {/* Responses Preview */}
                <div className="space-y-3">
                  {[
                    { name: "Alex Chen", email: "alex@startup.com", status: "new" },
                    { name: "Sarah Park", email: "sarah@design.io", status: "viewed" },
                  ].map((response, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border border-white/5 bg-[#080808] p-4 md:p-5 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E94B35] to-[#FF3B30] flex items-center justify-center">
                          <span className="text-white text-sm font-bold mono">
                            {response.name.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-white text-sm font-medium">{response.name}</div>
                          <div className="text-[#6E6E6E] text-xs mono truncate">
                            {response.email}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] mono font-semibold uppercase ${
                          response.status === "new"
                            ? "bg-terminal-green/10 border border-terminal-green/30 text-terminal-green"
                            : "bg-white/5 border border-white/10 text-white/50"
                        }`}
                      >
                        {response.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="border border-white/10 bg-gradient-to-br from-[#0D0D0D] to-[#080808] rounded-lg p-6 md:p-12 shadow-2xl backdrop-blur-xl"
              >
                {/* Analytics Preview */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Total", value: "847", icon: Users },
                    { label: "Rate", value: "94%", icon: Check },
                    { label: "Trend", value: "+12%", icon: TrendingUp },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="border border-white/5 bg-[#0D0D0D] p-4 rounded-lg">
                        <Icon className="w-4 h-4 text-[#E94B35] mb-2" />
                        <div className="heading-brutalist text-xl md:text-2xl text-white">
                          {stat.value}
                        </div>
                        <div className="mono text-[#6E6E6E] text-[10px] uppercase">
                          {stat.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines" />
    </section>
  );
}
