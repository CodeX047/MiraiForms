"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";

const categories = ["All", "Feedback", "Registration", "Application", "Survey"];

const templates = [
  { id: 1, title: "Product Feedback", category: "Feedback", color: "from-blue-500/20 to-purple-500/20" },
  { id: 2, title: "Event Registration", category: "Registration", color: "from-emerald-500/20 to-teal-500/20" },
  { id: 3, title: "Job Application", category: "Application", color: "from-orange-500/20 to-red-500/20" },
  { id: 4, title: "Customer Satisfaction", category: "Survey", color: "from-pink-500/20 to-rose-500/20" },
  { id: 5, title: "Beta Waitlist", category: "Registration", color: "from-indigo-500/20 to-cyan-500/20" },
  { id: 6, title: "Feature Request", category: "Feedback", color: "from-amber-500/20 to-yellow-500/20" },
];

export function TemplatesShowcase() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates = templates.filter(
    (t) => activeCategory === "All" || t.category === activeCategory
  );

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Start with a masterpiece.
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Don&apos;t stare at a blank canvas. Choose from hundreds of AI-optimized templates designed for maximum conversion.
            </p>
          </div>
          <Button variant="outline" className="rounded-full hidden md:inline-flex">
            View All Templates <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "secondary"}
              className="rounded-full whitespace-nowrap"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer"
              >
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden transition-all hover:shadow-xl hover:border-primary/30">
                  <div className={`aspect-[4/3] bg-gradient-to-br ${template.color} relative p-6 flex flex-col justify-between`}>
                    <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-background/50 backdrop-blur-md rounded-full text-xs font-medium border border-border/50">
                            {template.category}
                        </span>
                    </div>
                    <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <Button className="w-full bg-background text-foreground hover:bg-background/90">
                            Use Template
                        </Button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg">{template.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">AI Optimized Layout</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <Button variant="outline" className="rounded-full w-full mt-8 md:hidden">
            View All Templates <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </section>
  );
}
