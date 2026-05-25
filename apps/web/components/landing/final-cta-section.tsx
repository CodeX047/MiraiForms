"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-[#080808] via-[#0D0D0D] to-[#080808] overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Animated background grid */}
        <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-brutalist text-5xl md:text-7xl text-white mb-6"
          >
            Build your first form
            <br />
            in under 60 seconds.
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6E6E6E] text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            No credit card required. No limits. No surveillance.
            <br />
            Start building beautiful forms today.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-[#E94B35] text-white text-base font-bold rounded-full mono
                hover:bg-[#FF3B30] transition-all shadow-[0_0_40px_rgba(233,75,53,0.4)]
                hover:shadow-[0_0_60px_rgba(233,75,53,0.6)] group flex items-center gap-2 cursor-pointer"
            >
              <Link href="./signup">Start Building Free</Link>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 border border-white/20 text-white text-base font-bold rounded-full mono
                hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer"
            >
              Schedule Demo
            </motion.button>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 text-[#6E6E6E] text-sm"
          >
            {["Free forever plan", "No credit card required", "Cancel anytime"].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-terminal-green" />
                <span className="mono text-xs">{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating accent elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute -top-20 -left-20 w-64 h-64 border border-[#E94B35] rounded-full pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-20 -right-20 w-80 h-80 border border-[#E94B35] rounded-full pointer-events-none"
        />
      </div>
    </section>
  );
}
