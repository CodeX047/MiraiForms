"use client";

import { motion } from "framer-motion";
import { MessageSquare, Wand2, Share, LineChart } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Describe",
    description: "Tell our AI what you need in plain English. 'I need a SaaS onboarding flow with pricing selection.'",
  },
  {
    icon: Wand2,
    title: "Generate",
    description: "MiraiForms instantly generates the complete form, including complex logic, validation, and styling.",
  },
  {
    icon: Share,
    title: "Publish",
    description: "Deploy with one click. Share via link, embed on your site, or integrate directly into your app.",
  },
  {
    icon: LineChart,
    title: "Analyze",
    description: "Watch responses roll in real-time with AI-powered insights highlighting conversion bottlenecks.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 bg-[#0D0D0D] relative border-t border-white/5">
      <div className="container max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <div className="mono text-muted-foreground text-[10px] uppercase tracking-widest mb-4">
            / 002 / WORKFLOW
          </div>
          <h2 className="heading-brutalist text-4xl md:text-6xl text-white mb-4">
            From idea to production <br className="hidden md:block" />
            <span className="text-primary">in 60 seconds.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We&apos;ve completely reimagined the form building workflow. It&apos;s not just faster; it&apos;s a completely different paradigm.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-sm bg-[#080808] border border-white/10 flex items-center justify-center mb-6 relative group-hover:border-primary/50 transition-all">
                  <step.icon className="w-6 h-6 text-primary relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-primary/20 rounded-sm blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-lg">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                
                {/* Index number */}
                <div className="mt-4 mono text-white/10 text-2xl font-bold group-hover:text-primary/20 transition-all">
                  0{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines" />
    </section>
  );
}
