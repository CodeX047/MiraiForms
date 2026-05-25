"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is MiraiForms?",
    answer:
      "MiraiForms is a modern SaaS form builder platform that helps creators build beautiful interactive forms, publish instantly, and collect responses through a smooth and intuitive experience.",
  },
  {
    question: "Can I create and share forms without coding?",
    answer:
      "Yes. MiraiForms is designed with a visual form builder that lets you create, customize, and publish forms without writing any code.",
  },
  {
    question: "What types of fields does MiraiForms support?",
    answer:
      "MiraiForms supports multiple field types including short text, long text, email, number, select, checkbox, rating, date, and more.",
  },
  {
    question: "Do users need an account to submit forms?",
    answer:
      "No. Anyone with the public or unlisted form link can submit responses without creating an account or logging in.",
  },
  {
    question: "Can I track responses and analytics?",
    answer:
      "Absolutely. MiraiForms includes a modern analytics dashboard where creators can monitor submissions, response activity, and form performance.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background relative border-t border-border/40">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
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
