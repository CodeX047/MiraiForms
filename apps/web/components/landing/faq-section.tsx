"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How is MiraiForms different from Typeform or Google Forms?",
    answer: "MiraiForms uses advanced AI to generate, optimize, and analyze your forms. Instead of manually dragging blocks, you simply describe what you need. Furthermore, our predictive analytics help you understand exactly why users drop off.",
  },
  {
    question: "Can I export my data or integrate with my CRM?",
    answer: "Absolutely. We offer native integrations with over 500 apps via Zapier and webhooks. You can instantly push responses to Salesforce, HubSpot, Notion, or export as CSV/JSON.",
  },
  {
    question: "Is my data secure and compliant?",
    answer: "Security is our top priority. We are SOC2 Type II compliant, GDPR ready, and use AES-256 encryption at rest. Enterprise plans include granular RBAC and SAML SSO.",
  },
  {
    question: "Can I host forms on my own custom domain?",
    answer: "Yes, Pro and Enterprise plans allow you to connect a custom domain (e.g., forms.yourcompany.com) to maintain complete brand consistency.",
  },
  {
    question: "What happens if I exceed my monthly response limit?",
    answer: "We'll never block your forms. We will notify you when you reach 80% and 100% of your limit. If you exceed it, we will simply charge a small overage fee at the end of your billing cycle.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background relative border-t border-border/40">
      <div className="container px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-border/50 rounded-2xl bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center justify-between w-full p-6 text-left"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4 text-primary" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
