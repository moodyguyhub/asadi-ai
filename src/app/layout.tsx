import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahmood Asadi — AI-Native Technical Leader",
  description: "6 products. 4 industries. Governance enforced by infrastructure, not policy.",
  keywords: ["AI engineering", "CTO", "technical leader", "fintech", "edtech", "agent workflows"],
  authors: [{ name: "Mahmood Asadi", url: "https://asadi.ai" }],
  openGraph: {
    title: "Mahmood Asadi — AI-Native Technical Leader",
    description: "6 products • 4 industries • Governance enforced",
    url: "https://asadi.ai",
    siteName: "Mahmood Asadi",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Mahmood Asadi — AI-Native Technical Leader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahmood Asadi — AI-Native Technical Leader",
    description: "6 products • 4 industries • Governance enforced",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://asadi.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-zinc-950 text-white">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
