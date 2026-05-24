"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "~/components/ui/button";

export function ProductShowcaseSection() {
  return (
    <section className="py-24 bg-card/30 border-y border-border/40 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Design systems, <br />
              not just forms.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              MiraiForms brings the power of modern design tools to form building. 
              With our AI-assisted workflow, you can maintain perfect brand consistency 
              while moving at the speed of thought.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                "Auto-generated color palettes",
                "Smart typography pairing",
                "Responsive layouts by default"
              ].map((item, i) => (
                <li key={i} className="flex items-center text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                  {item}
                </li>
              ))}
            </ul>

            <Button className="rounded-full">
              Explore the Editor
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Interactive Preview Mockup */}
            <div className="aspect-square md:aspect-video lg:aspect-square bg-background rounded-2xl border border-border/50 shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-background" />
              
              {/* Fake UI Elements */}
              <div className="absolute top-4 left-4 right-4 h-12 bg-card rounded-lg border border-border/50 flex items-center px-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50 mr-2" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50 mr-2" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>

              <div className="absolute top-20 left-4 bottom-4 w-48 bg-card rounded-lg border border-border/50 hidden md:block" />
              <div className="absolute top-20 left-4 md:left-56 right-4 bottom-4 bg-card rounded-lg border border-border/50 flex items-center justify-center">
                 <Button variant="secondary" size="icon" className="w-16 h-16 rounded-full group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-1" />
                 </Button>
              </div>
            </div>
            
            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
