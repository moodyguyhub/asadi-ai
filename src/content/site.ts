export const site = {
  name: "Mahmood Asadi",
  title: "AI-Native Technical Leader",
  hookLine1: "6 Products. 4 Industries.",
  hookLine2: "Shipped in Weeks.",
  // Primary CTA: 30-min Strategy Consult (recommended)
  ctaPrimary: { 
    label: "Book a Strategy Consult (30 min)", 
    href: "https://cal.com/ctoalpha/deep-dive",
    hint: "30 min — Strategy consult + roadmap" 
  },
  // Secondary CTA: 15-min Intro (fit check)
  ctaQuickChat: { 
    label: "15-min Intro (Fit Check)", 
    href: "https://cal.com/ctoalpha/intro",
    hint: "15 min — Quick fit check (no prep)" 
  },
  // Tertiary: Ask Atlas link
  ctaTertiary: { label: "Ask Atlas — Chief of AI Staff (Portfolio)", href: "#atlas" },
  ctaDemo: { label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" },
  links: {
    email: "mahmood@asadi.ai",
    linkedin: "https://www.linkedin.com/in/mahmoodasadi1/",
    cv: "/cv.pdf", // TODO add file later
  },
  atlas: {
    enabled: true,
    heroHint: "Ask Atlas",
    opening:
      "Hi — I'm Atlas. Ask about Mahmood's products, tech stack, or availability. I'll reference on-site info only.",
    chips: [
      "How would you de-risk an AI rollout?",
      "Show auditability receipts",
      "What can Mahmood ship in 3 weeks?",
      "Availability?",
    ],
    ctaPrompt: "If you want to apply this to your environment, book a 30-min strategy consult.",
  },
};
