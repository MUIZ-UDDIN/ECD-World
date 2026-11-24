"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, X } from "lucide-react";
import { useMemo, useState } from "react";
import { getProduct, priceLabel } from "@/lib/catalog";
import { categoryCopy } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import { useStore } from "@/store/use-store";

export function WishlistView() {
  const hydrated = useHydrated();
  const wishlist = useStore((state) => state.wishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const addToCart = useStore((state) => state.addToCart);
  const [addedAll, setAddedAll] = useState(false);

  const items = useMemo(
    () => wishlist.flatMap((slug) => {
      const product = getProduct(slug);
      return product ? [product] : [];
    }),
    [wishlist],
  );

  if (!hydrated) {
    return (
      <div className="wrap py-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="aspect-4/5 animate-pulse rounded-3xl bg-shell/70" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="wrap py-20 md:py-28">
        <div className="mx-auto max-w-md rounded-4xl border border-line bg-white/50 px-8 py-14 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-shell">
            <Heart className="size-6 text-clay" aria-hidden />
          </div>
          <h2 className="mt-5 font-display text-2xl text-forest">No saved pieces yet</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Tap the heart on any material to keep it here while you plan a classroom or a
            nursery shelf.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-pine"
          >
            Browse the collection
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  const addAll = () => {
    items.forEach((product) => addToCart(product.slug, 1));
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <div className="wrap pt-8 pb-20 md:pb-28">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <p className="text-[0.72rem] tracking-[0.14em] text-muted uppercase">
          {items.length} saved {items.length === 1 ? "piece" : "pieces"}
        </p>
        <button
          type="button"
          onClick={addAll}
          className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-4 py-2 text-[0.78rem] font-medium text-forest transition-colors hover:border-forest/40 hover:bg-shell"
        >
          <ShoppingBag className="size-3.5" aria-hidden />
          {addedAll ? "Added to cart" : "Add all to cart"}
        </button>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((product) => {
          const category = categoryCopy[product.primaryCategory];
          const quote = product.price === null;

          return (
            <li
              key={product.slug}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white/60 transition-all duration-500 hover:border-forest/15 hover:bg-white hover:shadow-lift"
            >
              <div className="relative aspect-4/5 overflow-hidden bg-shell/70">
                <Link href={`/product/${product.slug}`} aria-label={product.name}>
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.04] sm:p-7"
                    />
                  ) : null}
                </Link>
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.slug)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full border border-line/80 bg-cream/90 text-muted backdrop-blur-sm transition-colors hover:border-clay/40 hover:text-clay"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </div>

              <div className="flex flex-1 flex-col px-4 pt-4 pb-4 sm:px-5">
                <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted/80 uppercase">
                  {category?.title ?? product.categories[0]?.name}
                </p>
                <Link
                  href={`/product/${product.slug}`}
                  className="mt-1 font-display text-[1.02rem] leading-snug text-ink hover:text-forest"
                >
                  {product.name}
                </Link>
                <p
                  className={`mt-1.5 text-[0.8rem] font-medium ${quote ? "text-clay" : "text-forest"}`}
                >
                  {priceLabel(product)}
                </p>

                <button
                  type="button"
                  onClick={() => addToCart(product.slug, 1)}
                  className="mt-4 w-full rounded-full border border-forest/20 px-3 py-2.5 text-[0.75rem] font-medium text-forest transition-colors hover:border-forest hover:bg-forest hover:text-cream"
                >
                  {quote ? "Add to quote" : "Add to cart"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-pine"
        >
          Go to cart
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href="/shop" className="text-sm text-forest hover:underline">
          Keep browsing
        </Link>
      </div>
    </div>
  );
}
