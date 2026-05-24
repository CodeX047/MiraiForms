"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "~/components/ui/button";

const plans = [
  {
    name: "Starter",
    description: "Perfect for indie hackers and small projects.",
    monthlyPrice: 19,
    annualPrice: 15,
    features: ["Up to 5 forms", "1,000 responses/mo", "Basic AI generation", "Standard support"],
    recommended: false,
  },
  {
    name: "Pro",
    description: "For scaling teams that need advanced capabilities.",
    monthlyPrice: 49,
    annualPrice: 39,
    features: ["Unlimited forms", "10,000 responses/mo", "Advanced AI logic", "Custom domains", "Priority support"],
    recommended: true,
  },
  {
    name: "Enterprise",
    description: "Custom limits and dedicated support for large orgs.",
    monthlyPrice: 199,
    annualPrice: 159,
    features: ["Unlimited everything", "SSO & SAML", "Predictive Analytics", "Dedicated success manager", "White-labeling"],
    recommended: false,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-24 bg-background relative border-t border-border/40">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start for free, upgrade when you need more power. No hidden fees.
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!isAnnual ? "font-semibold" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 bg-card border border-border rounded-full p-1 transition-colors hover:border-primary/50"
            >
              <motion.div
                layout
                className="w-6 h-6 bg-primary rounded-full"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${isAnnual ? "font-semibold" : "text-muted-foreground"}`}>
              Annually <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full tracking-wider">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col h-full bg-card border ${
                plan.recommended 
                  ? "border-primary/50 shadow-2xl shadow-primary/5" 
                  : "border-border/50 shadow-xl"
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-md">
                  Recommended
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground font-medium">/mo</span>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.recommended ? "default" : "outline"} 
                className="w-full rounded-full h-12 text-base font-semibold"
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
