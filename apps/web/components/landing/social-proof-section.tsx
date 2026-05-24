"use client";

import { motion } from "framer-motion";

const metrics = [
  { value: "10M+", label: "Forms Submitted" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "50k+", label: "Active Creators" },
  { value: "4.9/5", label: "Average Rating" },
];

export function SocialProofSection() {
  return (
    <section className="py-20 border-b border-border/40 bg-background/50 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Logos Placeholder */}
            {["Acme Corp", "Globalia", "Stark Ind", "Wayne Ent", "Initech"].map((logo) => (
              <div key={logo} className="text-xl md:text-2xl font-bold font-mono tracking-tighter">
                {logo}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/40">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <h3 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight text-primary">
                {metric.value}
              </h3>
              <p className="text-muted-foreground text-sm">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
