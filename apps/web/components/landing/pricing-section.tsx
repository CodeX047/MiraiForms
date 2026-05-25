"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, Building2, Sparkles } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "3 active forms",
        "100 responses/month",
        "All field types",
        "Basic analytics",
        "7-day data retention",
        "Community support",
      ],
      cta: "Start Free",
      highlight: false,
      icon: Sparkles,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For creators and small teams",
      features: [
        "Unlimited forms",
        "10,000 responses/month",
        "Advanced analytics",
        "Custom branding",
        "Unlimited data retention",
        "Webhook integrations",
        "Priority support",
        "Export to CSV/JSON",
      ],
      cta: "Start Free Trial",
      highlight: true,
      popular: true,
      icon: Zap,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Unlimited responses",
        "SSO & SAML",
        "Dedicated support",
        "99.9% SLA guarantee",
        "Custom integrations",
        "On-premise option",
        "Training & onboarding",
      ],
      cta: "Contact Sales",
      highlight: false,
      icon: Building2,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative bg-[#080808] py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mono text-[#6E6E6E] text-[10px] uppercase tracking-widest mb-4 text-center"
        >
          / 006 / PRICING
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="heading-brutalist text-3xl md:text-5xl lg:text-6xl text-white mb-4 text-center"
        >
          Simple, transparent pricing.
          <br />
          No hidden fees.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#6E6E6E] text-center max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed text-sm md:text-base"
        >
          Start free. Upgrade when you need more. Cancel anytime. No credit card required.
        </motion.p>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`
                  relative border rounded-lg p-6 md:p-8 transition-all flex flex-col justify-between h-full
                  ${
                    plan.highlight
                      ? "border-[#E94B35] bg-gradient-to-br from-[#E94B35]/10 to-[#FF3B30]/5 lg:scale-105 shadow-[0_0_50px_rgba(233,75,53,0.2)]"
                      : "border-white/10 bg-[#0D0D0D] hover:border-white/20"
                  }
                `}
              >
                <div>
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="px-4 py-1 bg-[#E94B35] text-white rounded-full shadow-lg">
                        <div className="mono text-[10px] uppercase tracking-widest flex items-center gap-1 font-bold">
                          <Zap className="w-3 h-3" />
                          Most Popular
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={`inline-flex p-3 rounded-lg ${
                        plan.highlight
                          ? "bg-[#E94B35]/20 border border-[#E94B35]/30"
                          : "bg-[#080808] border border-white/10"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${plan.highlight ? "text-[#E94B35]" : "text-[#6E6E6E]"}`}
                      />
                    </div>
                  </div>

                  {/* Plan name */}
                  <h3 className="text-2xl font-bold text-white mb-2 heading-brutalist">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-4xl md:text-5xl font-bold text-white heading-brutalist">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-[#6E6E6E] mono text-xs ml-1">{plan.period}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[#6E6E6E] text-xs mb-6 leading-relaxed">{plan.description}</p>
                </div>

                <div>
                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full py-3 rounded-full mono text-xs font-semibold tracking-wider uppercase transition-all mb-8 cursor-pointer
                      ${
                        plan.highlight
                          ? "bg-[#E94B35] text-white hover:bg-[#FF3B30] shadow-[0_0_30px_rgba(233,75,53,0.3)]"
                          : "border border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                      }
                    `}
                  >
                    {plan.cta}
                  </motion.button>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-start gap-3">
                        <CheckCircle2
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            plan.highlight ? "text-[#E94B35]" : "text-terminal-green"
                          }`}
                        />
                        <span className="text-white/80 text-xs leading-normal">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: "Money-back guarantee", value: "30 days" },
            { label: "Average setup time", value: "< 5 min" },
            { label: "Customer satisfaction", value: "98%" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-6 border border-white/5 bg-[#0D0D0D] rounded-lg"
            >
              <div className="heading-brutalist text-2xl md:text-3xl text-[#E94B35] mb-2">
                {stat.value}
              </div>
              <div className="mono text-[#6E6E6E] text-[10px] uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines" />
    </section>
  );
}
