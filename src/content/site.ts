export const site = {
  name: "Mahmood Asadi",
  title: "AI-Native Technical Leader",
  hookLine1: "6 Products. 4 Industries.",
  hookLine2: "Governance enforced.",
  // Primary CTA: 30-min Strategy Consult (recommended)
  ctaPrimary: { 
    label: "Book a Strategy Consult (30 min)", 
    href: "https://cal.com/ctoalpha/deep-dive",
    hint: "Strategy consult + roadmap" 
  },
  // Secondary CTA: 15-min Intro (fit check)
  ctaQuickChat: { 
    label: "15-min Intro (Fit Check)", 
    href: "https://cal.com/ctoalpha/intro",
    hint: "Quick fit check (no prep)" 
  },
  // Tertiary: Ask Atlas link
  ctaTertiary: { label: "Ask Atlas — Chief of AI Staff (Portfolio)", href: "#atlas" },
  links: {
    email: "mahmood@asadi.ai",
    linkedin: "https://www.linkedin.com/in/mahmoodasadi1/",
    cv: "/cv.pdf",
  },
  atlas: {
    enabled: true,
    heroHint: "Ask Atlas",
    opening:
      "Hi — I'm Atlas. Ask about Mahmood's products, tech stack, or availability. I'll reference on-site info only.",
    chips: [
      "How would you de-risk an AI rollout?",
      "Show auditability receipts",
      "How do you prevent unsafe AI actions?",
      "Availability?",
    ],
    ctaPrompt: "If you want to apply this to your environment, book a 30-min strategy consult.",
  },
};
