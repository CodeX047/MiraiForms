"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock, Target } from "lucide-react";
import Link from "next/link";

export function AnalyticsShowcase() {
  const features = [
    "Real-time response tracking",
    "Field completion analytics",
    "Conversion funnel analysis",
    "Geographic heatmaps",
    "Custom date ranges",
    "One-click CSV export",
  ];

  const stats = [
    { label: "Avg Response Time", value: "2m 34s", trend: "-12%", icon: Clock },
    { label: "Completion Rate", value: "94.2%", trend: "+5.3%", icon: Target },
    { label: "Total Submissions", value: "12,847", trend: "+18%", icon: Users },
  ];

  const chartData = [
    { day: "Mon", value: 65 },
    { day: "Tue", value: 78 },
    { day: "Wed", value: 92 },
    { day: "Thu", value: 85 },
    { day: "Fri", value: 73 },
    { day: "Sat", value: 45 },
    { day: "Sun", value: 38 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <section className="relative bg-[#0D0D0D] py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mono text-[#6E6E6E] text-xs mb-4 uppercase tracking-widest"
            >
              / 004 / ANALYTICS
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-brutalist text-3xl md:text-4xl lg:text-5xl text-white mb-6"
            >
              Insights that
              <br />
              drive decisions.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#6E6E6E] leading-relaxed mb-8 text-base md:text-lg"
            >
              Real-time response tracking. Conversion funnels. Drop-off analysis. Build better forms
              with data-driven insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3 mb-8"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-terminal-green flex-shrink-0" />
                  <span className="text-white/80 text-sm md:text-base">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-[#E94B35] text-white rounded-full mono text-sm hover:bg-[#FF3B30] transition-all shadow-[0_0_30px_rgba(233,75,53,0.3)] cursor-pointer"
            >
              <Link href="/dashboard">Explore Analytics</Link>
            </motion.button>
          </div>

          {/* Right - Dashboard visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="border border-white/10 bg-gradient-to-br from-[#080808] to-[#0D0D0D] p-6 md:p-8 rounded-lg shadow-2xl">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 border-b border-white/10">
                <div>
                  <div className="mono text-white text-sm mb-1">Analytics Dashboard</div>
                  <div className="text-[#6E6E6E] text-xs mono">Last 7 days</div>
                </div>
                <BarChart3 className="w-5 h-5 text-[#E94B35]" />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  const isPositive = stat.trend.startsWith("+");
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="border border-white/5 bg-[#0D0D0D] p-3 md:p-4 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2 md:mb-3">
                        <div className="p-1.5 md:p-2 bg-[#E94B35]/10 border border-[#E94B35]/20 rounded">
                          <Icon className="w-3 h-3 md:w-4 md:h-4 text-[#E94B35]" />
                        </div>
                        <div
                          className={`mono text-[10px] md:text-xs ${isPositive ? "text-terminal-green" : "text-[#FF3B30]"}`}
                        >
                          {stat.trend}
                        </div>
                      </div>
                      <div className="heading-brutalist text-base md:text-xl text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="mono text-[#6E6E6E] text-[9px] md:text-[10px] uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Chart */}
              <div className="border border-white/5 bg-[#080808] p-4 md:p-6 rounded-lg">
                <div className="mono text-white text-xs mb-4 md:mb-6 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#E94B35]" />
                  Response Trends
                </div>

                {/* Bar chart visualization */}
                <div className="flex items-end justify-between gap-1 md:gap-2 h-24 md:h-32 mb-4">
                  {chartData.map((data, idx) => {
                    const height = (data.value / maxValue) * 100;
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1, duration: 0.6 }}
                          className="w-full bg-gradient-to-t from-[#E94B35] to-[#FF3B30] rounded-t relative group cursor-pointer hover:from-[#FF3B30] hover:to-[#E94B35] transition-all"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0D0D0D] border border-white/10 px-2 py-1 rounded text-xs text-white mono whitespace-nowrap z-50">
                            {data.value}
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between text-[#6E6E6E] text-[9px] md:text-[10px] mono">
                  {chartData.map((data, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <span className="hidden sm:inline">{data.day}</span>
                      <span className="sm:hidden">{data.day.charAt(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="mt-4 md:mt-6 grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-terminal-green/5 border border-terminal-green/20 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse flex-shrink-0" />
                  <div className="text-xs md:text-sm text-white/90 mono">
                    Peak activity: Wed 3-5 PM
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines" />
    </section>
  );
}
