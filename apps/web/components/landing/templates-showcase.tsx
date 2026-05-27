"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Gamepad2,
  Briefcase,
  Calendar,
  MessageSquare,
  Heart,
  Trophy,
  ArrowRight,
  Eye,
} from "lucide-react";

export function TemplatesShowcase() {
  const templates = [
    {
      name: "Anime Fan Survey",
      category: "Entertainment",
      icon: Heart,
      uses: "2.4k uses",
      fields: ["Rating", "Multiple Choice", "Text"],
    },
    {
      name: "Gaming Tournament",
      category: "Events",
      icon: Gamepad2,
      uses: "1.8k uses",
      fields: ["Team Name", "Discord", "Skill Level"],
    },
    {
      name: "Startup Hiring",
      category: "Recruitment",
      icon: Briefcase,
      uses: "3.2k uses",
      fields: ["Resume", "Portfolio", "Experience"],
    },
    {
      name: "Event RSVP",
      category: "Events",
      icon: Calendar,
      uses: "4.1k uses",
      fields: ["Attending", "Guest Count", "Dietary"],
    },
    {
      name: "Community Feedback",
      category: "Feedback",
      icon: MessageSquare,
      uses: "2.9k uses",
      fields: ["Rating", "Comments", "Suggestions"],
    },
    {
      name: "Competition Entry",
      category: "Contests",
      icon: Trophy,
      uses: "1.5k uses",
      fields: ["Submission", "Category", "Description"],
    },
  ];

  return (
    <section
      id="templates"
      className="relative bg-[#0D0D0D] py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mono text-[#6E6E6E] text-[10px] uppercase tracking-widest mb-4"
        >
          / 003 / TEMPLATES
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="heading-brutalist text-3xl md:text-5xl lg:text-6xl text-white mb-4"
        >
          Start from a template.
          <br />
          Ship in minutes.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#6E6E6E] max-w-2xl mb-12 md:mb-16 leading-relaxed text-sm md:text-base"
        >
          Beautiful templates today, with many more on the way.
        </motion.p>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {templates.map((template, idx) => {
            const Icon = template.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative border border-white/10 bg-[#080808] rounded-lg p-6 cursor-pointer transition-all hover:border-white/20 flex flex-col justify-between min-h-[250px]"
              >
                <div>
                  {/* Icon and Category */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#0D0D0D] border border-white/10 rounded-lg group-hover:border-white/20 transition-all">
                      <Icon className="w-6 h-6 text-[#E94B35]" />
                    </div>
                    <div className="px-3 py-1 bg-[#0D0D0D] border border-white/10 rounded-full">
                      <div className="mono text-[#6E6E6E] text-[10px] uppercase">
                        {template.category}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-semibold text-lg md:text-xl mb-2 group-hover:text-[#E94B35] transition-colors">
                    {template.name}
                  </h3>

                  {/* Uses */}
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4 text-[#6E6E6E]" />
                    <span className="mono text-[#6E6E6E] text-[10px]">{template.uses}</span>
                  </div>

                  {/* Field tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.fields.map((field, fieldIdx) => (
                      <div
                        key={fieldIdx}
                        className="px-2 py-0.5 bg-[#0D0D0D] border border-white/5 rounded text-[10px] text-[#6E6E6E] mono"
                      >
                        {field}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.div className="flex items-center gap-2 text-xs mono text-[#E94B35] mt-4">
                  <span>Use Template</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.div>

                {/* Hover border glow */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E94B35] via-[#FF3B30] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 md:mt-12 text-center"
        >
          <Link href="/explore">
            <Button
              variant="outline"
              className="mono text-[#E94B35] hover:text-white border-white/10 hover:border-[#E94B35]/40 bg-transparent flex items-center justify-center gap-2 mx-auto group text-xs uppercase font-bold py-3 px-6 cursor-pointer rounded"
            >
              Browse Full Explore Gallery
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines" />
    </section>
  );
}
