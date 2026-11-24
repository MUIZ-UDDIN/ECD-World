"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  quote,
}: {
  images: string[];
  name: string;
  quote: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-square overflow-hidden rounded-4xl border border-line bg-white lg:aspect-4/5">
        {current ? (
          <Image
            src={current}
            alt={`${name}${images.length > 1 ? ` — view ${active + 1}` : ""}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-contain p-8 transition-transform duration-700 group-hover:scale-[1.03] sm:p-12"
          />
        ) : null}

        <div className="pointer-events-none absolute top-4 left-4 flex flex-col gap-2">
          {quote && (
            <span className="rounded-full border border-line/70 bg-cream/90 px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.12em] text-muted uppercase backdrop-blur-sm">
              Made to order
            </span>
          )}
          {images.length > 1 && (
            <span className="rounded-full border border-line/70 bg-cream/90 px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.12em] text-muted uppercase backdrop-blur-sm">
              {active + 1} / {images.length}
            </span>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show view ${index + 1}`}
              aria-pressed={index === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border bg-white transition-all",
                index === active
                  ? "border-forest ring-1 ring-forest/20"
                  : "border-line opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="120px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
