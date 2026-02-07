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

  // Consistent aspect ratio so all cards in a row match height
  const aspectClass = featured ? "aspect-[16/9]" : "aspect-[16/9]";

  return (
    <div className={featured ? "pt-4 px-4" : ""}>
    <div className={`relative ${aspectClass} overflow-hidden border-b border-white/10 bg-black/20 ring-1 ring-inset ring-white/5 ${featured ? "rounded-xl" : "rounded-t-xl"}`}>
      {ok ? (
        <>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-transparent z-10" />
          <Image
            src={srcWithCacheBust}
            alt={alt}
            fill
            className={`${featured ? "object-contain" : "object-cover"} object-center opacity-100 contrast-110 saturate-110 group-hover:contrast-125 group-hover:saturate-125 group-hover:scale-[1.02] transition duration-300`}
            onError={() => setOk(false)}
            sizes={featured ? "(max-width: 640px) 90vw, 1200px" : "(max-width: 640px) 90vw, 800px"}
            priority={featured}
            quality={95}
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
    </div>
  );
}
