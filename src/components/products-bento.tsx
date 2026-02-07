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
  colSpan,
  index
}: { 
  product: Product; 
  onClick: () => void;
  colSpan: string;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-label={`${product.name} — ${product.oneLiner}`}
      className={cn(
        "glass glass-interactive rounded-3xl p-0 text-left overflow-hidden group cursor-pointer",
        "ring-1 ring-white/5 hover:ring-white/10",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--background))]",
        colSpan
      )}
    >
      {/* Screenshot on top with built-time badge */}
      <div className="relative">
        <ProductScreenshot
          src={product.screenshot.src}
          alt={product.screenshot.alt}
          hint={`public${product.screenshot.src}`}
          featured
        />
      </div>

      {/* Content below */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge color="zinc" className="text-xs">{product.industry}</Badge>
            <div className="mt-3 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white tracking-tight">{product.name}</h3>
              {product.featured && (
                <Badge color="cyan">Featured</Badge>
              )}
            </div>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{product.oneLiner}</p>
            <p className="mt-2 text-xs text-[rgb(var(--accent))] leading-relaxed">
              <span className="font-medium text-white/60">Outcome:</span> {product.businessImpact}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.stack.slice(0, 4).map((t) => (
            <Badge key={t} color="zinc">{t}</Badge>
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
            Seven shipped builds across four industries. Click a card for details.
          </p>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-5">
        {products.map((p, index) => {
          const spanFor = (pId: string) => {
            if (pId === "truvesta") return "md:col-span-4";
            return "md:col-span-2";
          };

          return (
            <ProductCard
              key={p.id}
              product={p}
              colSpan={spanFor(p.id)}
              index={index}
              onClick={() => setSelectedProduct(p)}
            />
          );
        })}
      </div>

      <ProductDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
