"use client";

import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Brain, TrendingUp } from "lucide-react";

const data = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 550 },
  { name: "Thu", value: 450 },
  { name: "Fri", value: 700 },
  { name: "Sat", value: 650 },
  { name: "Sun", value: 850 },
];

export function AnalyticsShowcase() {
  return (
    <section className="py-24 bg-zinc-950 text-zinc-50 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            {/* Dashboard Mockup */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl relative">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-semibold">Conversion Rate</h3>
                  <p className="text-zinc-400 text-sm">Last 7 days</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" /> +24%
                </div>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#e4e4e7' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#a78bfa' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI Insight Card */}
              <div className="mt-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 flex gap-4">
                <div className="mt-1">
                    <Brain className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-violet-300 mb-1">AI Insight</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                        Drop-off rate increases by 15% on the &quot;Company Size&quot; question. Consider making it optional or moving it to the end to boost completion rates.
                    </p>
                </div>
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[400px] max-h-[400px] bg-violet-500/20 blur-[100px] -z-10 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Analytics that <br />
              actually think.
            </h2>
            <p className="text-lg text-zinc-400 mb-8">
              Stop staring at raw data. Our AI analyzes your form performance, identifies bottlenecks, and suggests actionable improvements to maximize your conversion rates.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "Predictive Analytics", desc: "Forecast completions based on historical traffic patterns." },
                { title: "Drop-off Analysis", desc: "Pinpoint exactly which field causes users to abandon." },
                { title: "A/B Testing", desc: "Automatically test variations and route traffic to the winner." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                    <span className="text-violet-400 font-semibold">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
