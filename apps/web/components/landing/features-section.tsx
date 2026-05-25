"use client";

import { motion, Variants } from "framer-motion";
import { Zap, Shield, Cpu, Layers, MousePointer2, Workflow } from "lucide-react";

const features = [
  {
    title: "Dynamic Form Builder",
    description:
      "Create modern interactive forms with an intuitive builder designed for speed, flexibility, and a seamless creation experience.",
    icon: Cpu,
  },
  {
    title: "Customizable Field Types",
    description:
      "Build forms using multiple field types including text, email, select, checkbox, rating, date, and more with flexible validation support.",
    icon: Zap,
  },
  {
    title: "Smart Form Analytics",
    description:
      "Track submissions, monitor engagement, and gain valuable insights through clean and powerful response analytics dashboards.",
    icon: Workflow,
  },
  {
    title: "Secure Authentication",
    description:
      "Protect creator dashboards and workflows with secure authentication powered by Clerk and custom premium auth experiences.",
    icon: Shield,
  },
  {
    title: "Instant Form Sharing",
    description:
      "Publish forms instantly and share public or unlisted links with anyone without requiring users to create an account.",
    icon: Layers,
  },
  {
    title: "Smooth Drag & Drop Experience",
    description:
      "Reorder and organize form fields effortlessly with a responsive drag-and-drop experience built for modern workflows.",
    icon: MousePointer2,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function FeaturesSection() {
  return (
    <section className="relative bg-background py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="mono text-muted-foreground text-[10px] uppercase tracking-widest mb-4">
          / 002 / CAPABILITIES
        </div>

        {/* Heading */}
        <h2 className="heading-brutalist text-4xl md:text-6xl text-white mb-4">
          Built for scale.
          <br />
          Designed for freedom.
        </h2>

        <p className="text-muted-foreground max-w-2xl mb-16 leading-relaxed">
          A comprehensive suite of tools designed for modern teams who demand power without
          complexity.
        </p>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="border border-white/5 bg-card p-8 rounded-sm hover:border-primary/30 transition-all group relative overflow-hidden"
              >
                {/* Icon */}
                <div className="mb-6 relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 border border-white/10 rounded-sm bg-background group-hover:border-primary/50 transition-all">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-white font-semibold mb-3 text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Index number */}
                <div className="absolute top-4 right-4 mono text-white/5 text-4xl font-bold group-hover:text-primary/10 transition-all">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Hover glow line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-[#FF3B30] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines" />
    </section>
  );
}
