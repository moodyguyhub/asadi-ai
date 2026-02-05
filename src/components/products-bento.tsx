"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/content/products";
import { cn } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogTitle, DialogBody, DialogActions } from "@/components/catalyst/dialog";
import { Button } from "@/components/catalyst/button";
import { Badge } from "@/components/catalyst/badge";
import { ProductScreenshot } from "@/components/product-screenshot";

function ProductCard({ 
  product, 
  onClick,
  size = "normal",
  index
}: { 
  product: Product; 
  onClick: () => void;
  size?: "featured" | "normal";
  index: number;
}) {
  const isFeatured = size === "featured";
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "glass glass-interactive rounded-2xl p-0 text-left overflow-hidden group cursor-pointer",
        "ring-1 ring-white/5 hover:ring-white/15 transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))]"
      )}
    >
      {/* Screenshot */}
      <div className="relative">
        <ProductScreenshot
          src={product.screenshot.src}
          alt={product.screenshot.alt}
          hint={`public${product.screenshot.src}`}
          featured={isFeatured}
        />
        <div className="absolute bottom-3 right-3 text-[11px] px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 z-20 font-medium">
          <span className="text-[rgb(var(--accent))]">Built in</span>{" "}
          <span className="text-white">{product.builtIn}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge color="zinc" className="text-[10px]">{product.industry}</Badge>
          {product.featured && <Badge color="cyan" className="text-[10px]">Featured</Badge>}
        </div>
        
        <h3 className="text-base font-semibold text-white tracking-tight">{product.name}</h3>
        <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed line-clamp-2">{product.oneLiner}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.stack.slice(0, 4).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/5">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function ProductDialog({ product, open, onClose }: { product: Product | null; open: boolean; onClose: () => void }) {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} size="3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <DialogTitle>{product.name}</DialogTitle>
          <p className="mt-1 text-sm text-zinc-400">{product.oneLiner}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge color="zinc">{product.industry}</Badge>
            <span className="text-xs text-zinc-400">
              Built in <span className="text-white font-medium">{product.builtIn}</span>
            </span>
          </div>
        </div>
        <Button plain onClick={onClose}>
          <XMarkIcon className="size-5" />
        </Button>
      </div>

      <DialogBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="premium-pill rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-white tracking-tight">Problem</h4>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{product.details.problem}</p>
          </div>
          <div className="premium-pill rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-white tracking-tight">Role</h4>
            <ul className="mt-3 text-sm text-zinc-400 leading-relaxed list-disc pl-5 space-y-1">
              {product.details.role.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <div className="premium-pill rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-white tracking-tight">Approach</h4>
            <ul className="mt-3 text-sm text-zinc-400 leading-relaxed list-disc pl-5 space-y-1">
              {product.details.approach.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <div className="premium-pill rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-white tracking-tight">Outcomes</h4>
            <ul className="mt-3 text-sm text-zinc-400 leading-relaxed list-disc pl-5 space-y-1">
              {product.details.outcomes.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>
      </DialogBody>

      <DialogActions>
        {product.details.links.map((l) => (
          <Button key={l.href} href={l.href} color="dark/zinc">
            {l.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}

export function ProductsBento({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Separate featured (Truvesta) from others
  const featured = products.find(p => p.featured);
  const others = products.filter(p => !p.featured);

  return (
    <section>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">What I&apos;ve Built</h2>
          <p className="mt-3 text-zinc-400 max-w-2xl leading-relaxed">
            Six shipped builds across four industries. Click a card for details.
          </p>
        </div>
      </motion.div>

      {/* Featured product - full width on mobile, 2/3 on desktop */}
      {featured && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ProductCard
              product={featured}
              size="featured"
              index={0}
              onClick={() => setSelectedProduct(featured)}
            />
          </div>
          {/* First regular product next to featured */}
          {others[0] && (
            <div className="lg:col-span-1">
              <ProductCard
                product={others[0]}
                size="normal"
                index={1}
                onClick={() => setSelectedProduct(others[0])}
              />
            </div>
          )}
        </div>
      )}

      {/* Remaining products in 3-column grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {others.slice(1).map((p, index) => (
          <ProductCard
            key={p.id}
            product={p}
            size="normal"
            index={index + 2}
            onClick={() => setSelectedProduct(p)}
          />
        ))}
      </div>

      <ProductDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
