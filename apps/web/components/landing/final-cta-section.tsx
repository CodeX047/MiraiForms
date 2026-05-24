"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-16 text-center max-w-5xl mx-auto shadow-2xl relative overflow-hidden"
        >
          {/* Subtle grid pattern inside card */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBoMjBWMEgwem0xOSAxOUgxVjFoMTh2MTh6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-20" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-8 shadow-lg shadow-primary/20">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Ready to feel the magic?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of forward-thinking teams building the next generation of digital experiences. Your first AI-generated form is just one click away.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg shadow-xl shadow-primary/25 w-full sm:w-auto">
                Start Building for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto bg-background/50 hover:bg-background/80">
                Talk to Sales
              </Button>
            </div>
            
            <p className="mt-8 text-sm text-muted-foreground">
              No credit card required. Free plan available forever.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
