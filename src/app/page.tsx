import { site } from "@/content/site";
import { products } from "@/content/products";
import { TopNav } from "@/components/top-nav";
import { Hero } from "@/components/hero";
import { ProductsBento } from "@/components/products-bento";
import { About } from "@/components/about";
import { Stack } from "@/components/stack";
import { Contact } from "@/components/contact";
import { AtlasWidget } from "@/components/atlas/widget";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <TopNav />
        <Hero />

        {/* Metrics strip - premium styling */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs tracking-wide">
          {[
            "6 shipped",
            "avg 3–4 weeks",
            "4 industries",
            "multi-tenant by default",
            "audit-ready",
          ].map((metric, i) => (
            <span key={metric} className="flex items-center gap-4 text-white/45">
              {metric}
              {i < 4 && <span className="text-white/15">•</span>}
            </span>
          ))}
        </div>

        <section id="work" className="mt-12 sm:mt-16 scroll-mt-24">
          <ProductsBento products={products} />
        </section>
        <section id="about" className="mt-20 sm:mt-28 scroll-mt-24">
          <About />
        </section>
        <section id="stack" className="mt-20 sm:mt-28 scroll-mt-24">
          <Stack />
        </section>
        <section id="contact" className="mt-20 sm:mt-28 pb-24 safe-bottom scroll-mt-24">
          <Contact />
        </section>
      </div>

      {site.atlas.enabled ? <AtlasWidget /> : null}
    </main>
  );
}
