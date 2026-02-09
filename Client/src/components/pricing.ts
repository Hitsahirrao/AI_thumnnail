import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    features: [
      "Access to all basic courses",
      "Community support",
      "10 practice projects",
      "Course completion certificate",
      "Basic code review",
    ],
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    isPopular: true,
    features: [
      "Access to all Pro courses",
      "Priority community support",
      "30 practice projects",
      "Course completion certificate",
      "Advance code review",
      "1-on-1 mentoring sessions",
      "Job assistance",
    ],
    cta: "Get Started",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    features: [
      "Access to all courses",
      "Dedicated support",
      "Unlimited projects",
      "Course completion certificate",
      "Premium code review",
    ],
    cta: "Get Started",
  },
];
