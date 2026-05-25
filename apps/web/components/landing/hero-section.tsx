"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-primary flex flex-col">
      {/* Top Navigation Spacer (if Navbar is global, we just need padding. Assuming global navbar handles header, we'll keep the hero content centered) */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-12 pb-32 pt-24">
        <div className="max-w-4xl relative z-10 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-black text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-6"
          >
            Build forms that
            <br />
            feel alive.
            <br />
            No limits.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-primary-foreground/70 text-sm md:text-base max-w-md mb-8 font-light"
          >
            Create beautiful interactive forms with a modern experience designed for creators,
            startups, and growing teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="rounded-full px-6 py-3 bg-[#080808] text-white hover:bg-[#111111] transition-all hover:shadow-xl mono text-sm h-auto"
              >
                Start Building Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              className="rounded-full px-6 py-3 border border-primary-foreground/20 text-primary-foreground bg-transparent hover:border-primary-foreground/40 hover:bg-transparent transition-all mono text-sm h-auto"
            >
              View Demo
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Background geometric shape */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-10 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 800 800" className="w-full h-full">
          <circle cx="400" cy="400" r="300" fill="none" stroke="#080808" strokeWidth="1" />
          <circle cx="400" cy="400" r="200" fill="none" stroke="#080808" strokeWidth="1" />
          <circle cx="400" cy="400" r="100" fill="none" stroke="#080808" strokeWidth="1" />
          <line x1="100" y1="400" x2="700" y2="400" stroke="#080808" strokeWidth="1" />
          <line x1="400" y1="100" x2="400" y2="700" stroke="#080808" strokeWidth="1" />
        </svg>
      </div>

      {/* Grid coordinates - bottom left */}
      <div className="absolute bottom-8 left-8 mono text-primary-foreground/40 text-[10px] uppercase tracking-widest hidden md:block">
        001.001.A
      </div>

      {/* Grid coordinates - bottom right */}
      <div className="absolute bottom-8 right-8 mono text-primary-foreground/40 text-[10px] uppercase tracking-widest hidden md:block">
        SYS/MIRAI/V1
      </div>
    </section>
  );
}
