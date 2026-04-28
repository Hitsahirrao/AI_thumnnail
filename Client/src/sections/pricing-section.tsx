"use client";

import SectionTitle from "../components/section-title";
import { pricingData } from "../components/pricing";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingSection() {
  return (
    <section id="pricing" className="px-4 md:px-16 lg:px-24 xl:px-32 py-20">
      <SectionTitle
        title="Pricing Simple Pricing"
        description="Choose the plan that fits your creation schedule. Cancel anytime."
      />


      <div className="mt-16 flex flex-wrap items-stretch justify-center gap-8">
        {pricingData.map((plan, index) => {
          const popular = plan.isPopular;

          return (
            <motion.div
              key={plan.id ?? index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className={[
                "relative w-full max-w-[340px] rounded-2xl border border-white/10",
                "bg-gradient-to-b from-[#1b0010] to-[#0b0006]",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_80px_rgba(0,0,0,0.55)]",
                "overflow-hidden",
                popular ? "scale-[1.03]" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "pointer-events-none absolute inset-x-0 -top-24 h-56",
                  "bg-[radial-gradient(circle_at_top,rgba(255,0,153,0.35),transparent_60%)]",
                  popular ? "opacity-100" : "opacity-60",
                ].join(" ")}
              />

              {popular && (
                <div className="absolute left-6 top-4 z-10">
                  <span className="inline-flex items-center rounded-full bg-pink-500/90 px-3 py-1 text-xs font-semibold text-white shadow">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="relative p-8 pt-12">
                <h3 className="text-sm font-semibold text-white/90">
                  {plan.name}
                </h3>

                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="pb-1 text-sm text-white/50">/month</span>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-white/70">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-pink-500/10">
                        <Check className="h-4 w-4 text-pink-400" />
                      </span>
                      <span className="leading-6">{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <button
                    className={[
                      "w-full rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98]",
                      popular
                        ? "bg-white text-[#7a0042] hover:bg-white/90"
                        : "bg-pink-500 text-white hover:bg-pink-600",
                    ].join(" ")}
                  >
                    {plan.cta ?? "Get Started"}
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(255,0,153,0.08))]" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
