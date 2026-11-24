"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { priceLabel, products } from "@/lib/catalog";
import { shopMenu } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 60);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((product) => {
        const haystack = [
          product.name,
          product.sku ?? "",
          ...product.categories.map((c) => c.name),
        ]
          .join(" ")
          .toLowerCase();
        return term.split(/\s+/).every((word) => haystack.includes(word));
      })
      .slice(0, 6);
  }, [query]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[12vh] pb-10"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-forest/35 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-2xl animate-fade-up overflow-hidden rounded-4xl border border-line bg-cream shadow-deep">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Search className="size-4.5 shrink-0 text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") onClose();
              if (event.key === "Enter") {
                const target = results[0];
                if (target) {
                  onClose();
                  router.push(`/product/${target.slug}`);
                } else if (query.trim()) {
                  onClose();
                  router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
                }
              }
            }}
            placeholder="Search materials, blocks, language sets…"
            className="w-full bg-transparent text-[0.95rem] text-ink placeholder:text-muted/70 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted transition-colors hover:bg-shell hover:text-ink"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="max-h-[58vh] overflow-y-auto">
          {!query.trim() && (
            <div className="p-5">
              <p className="eyebrow">Browse</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {shopMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center justify-between rounded-2xl border border-line bg-white/60 px-4 py-3 text-sm font-medium text-forest transition-colors hover:border-forest/30 hover:bg-white"
                  >
                    {item.label}
                    <span className="text-[0.7rem] font-normal text-muted">{item.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="font-display text-xl text-forest">Nothing matched “{query}”</p>
              <p className="mt-2 text-sm text-muted">
                We may still make it. Ask us directly and we&apos;ll check the workshop.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="divide-y divide-line/80">
              {results.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/70"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-shell">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                      <p className="mt-0.5 text-[0.7rem] tracking-wide text-muted uppercase">
                        {product.categories[0]?.name}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-xs",
                        product.price === null ? "text-clay" : "text-forest",
                      )}
                    >
                      {priceLabel(product)}
                    </span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line bg-shell/50 px-5 py-2.5 text-[0.68rem] text-muted">
          <span>{products.length} materials in the catalogue</span>
          <span className="hidden sm:inline">
            <kbd className="rounded border border-line bg-white px-1.5 py-0.5">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
