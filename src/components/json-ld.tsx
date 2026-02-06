export function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mahmood Asadi",
    url: "https://asadi.ai",
    jobTitle: "AI-Native Technical Leader",
    description:
      "6 products shipped across 4 industries. Agent-orchestrated, audit-ready delivery.",
    sameAs: ["https://www.linkedin.com/in/mahmoodasadi1/"],
    knowsAbout: [
      "AI Engineering",
      "Agent Orchestration",
      "Fintech",
      "EdTech",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mahmood Asadi — AI-Native Technical Leader",
    url: "https://asadi.ai",
    description:
      "Portfolio of Mahmood Asadi — 6 products, 4 industries. Governance enforced by infrastructure, not policy.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
