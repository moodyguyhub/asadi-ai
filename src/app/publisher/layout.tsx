import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publisher — Mahmood Asadi",
  robots: { index: false, follow: false },
};

export default function PublisherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
