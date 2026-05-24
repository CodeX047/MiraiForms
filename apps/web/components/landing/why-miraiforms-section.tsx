"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export function WhyMiraiFormsSection() {
  return (
    <section className="py-24 bg-card/30 relative">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Why choose MiraiForms?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Traditional form builders are stuck in the past. Here is how we compare to the legacy tools you are probably using right now.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl border border-border/50 overflow-hidden bg-background shadow-2xl">
          <div className="grid grid-cols-3 bg-card/50 border-b border-border/50 p-6">
            <div className="font-semibold text-muted-foreground">Feature</div>
            <div className="font-bold text-center">Traditional Tools</div>
            <div className="font-bold text-center text-primary">MiraiForms</div>
          </div>
          
          {[
            { feature: "Form Creation", old: "Manual drag & drop", new: "AI-generated instantly" },
            { feature: "Logic Configuration", old: "Complex rule builders", new: "Natural language instructions" },
            { feature: "Design & Styling", old: "Basic themes", new: "Advanced design system control" },
            { feature: "Data Analysis", old: "CSV exports", new: "Predictive AI insights" },
            { feature: "Collaboration", old: "Single user edits", new: "Real-time multiplayer" },
          ].map((row, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="grid grid-cols-3 p-6 border-b border-border/20 last:border-0 items-center hover:bg-card/30 transition-colors"
            >
              <div className="font-medium">{row.feature}</div>
              <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                <X className="w-4 h-4 text-red-500/70" />
                <span className="text-sm">{row.old}</span>
              </div>
              <div className="text-center flex flex-col items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{row.new}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
