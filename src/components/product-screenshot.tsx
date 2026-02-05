"use client";

import Image from "next/image";
import { useId, useState } from "react";

export function ProductScreenshot({
  src,
  alt,
  hint,
  featured = false,
}: {
  src: string;
  alt: string;
  hint: string;
  featured?: boolean;
}) {
  const [ok, setOk] = useState(true);
  
  // Use React's useId for a stable, unique identifier per component instance
  // In dev, we append this to bust the image cache on each page load
  const instanceId = useId();

  const srcWithCacheBust =
    process.env.NODE_ENV === "development" ? `${src}?id=${instanceId}` : src;

  // Featured cards get taller screenshots
  const heightClass = featured ? "h-48 sm:h-56 lg:h-64" : "h-40 sm:h-48";

  return (
    <div className={`relative ${heightClass} overflow-hidden border-b border-white/5 bg-black/30`}>
      {ok ? (
        <>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
          <Image
            src={srcWithCacheBust}
            alt={alt}
            fill
            className="object-cover object-top group-hover:scale-[1.02] transition duration-500"
            onError={() => setOk(false)}
            sizes={featured ? "(max-width: 640px) 90vw, 800px" : "(max-width: 640px) 90vw, 400px"}
            priority={featured}
            quality={90}
            unoptimized={process.env.NODE_ENV === "development"}
          />
        </>
      ) : (
        <div className="absolute inset-0">
          {/* tasteful fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.10)_1px,transparent_0)] [background-size:16px_16px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs text-zinc-500 text-center px-3">
              Add screenshot:
              <div className="mt-1 text-[11px] text-white/70">{hint}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
