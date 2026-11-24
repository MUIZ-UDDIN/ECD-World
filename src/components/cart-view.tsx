"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { QuantityStepper } from "@/components/quantity-stepper";
import { ProductCard } from "@/components/product-card";
import { summariseCart } from "@/lib/cart";
import { featuredProducts, formatPrice } from "@/lib/catalog";
import { categoryCopy, site } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import { useStore } from "@/store/use-store";

export function CartView() {
  const hydrated = useHydrated();
  const lines = useStore((state) => state.cart);
  const setQuantity = useStore((state) => state.setQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const summary = useMemo(() => summariseCart(lines), [lines]);
  const suggestions = useMemo(() => {
    const inCart = new Set(lines.map((line) => line.slug));
    return featuredProducts(12)
      .filter((product) => !inCart.has(product.slug))
      .slice(0, 4);
  }, [lines]);

  if (!hydrated) {
    return (
      <div className="wrap py-16">
        <div className="h-8 w-40 animate-pulse rounded-full bg-shell" />
        <div className="mt-8 space-y-3">
          {[0, 1].map((index) => (
            <div key={index} className="h-28 animate-pulse rounded-3xl bg-shell/70" />
          ))}
        </div>
      </div>
    );
  }

  if (summary.lines.length === 0) {
    return (
      <div className="wrap py-20 md:py-28">
        <div className="mx-auto max-w-md rounded-4xl border border-line bg-white/50 px-8 py-14 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-shell">
            <ShoppingBag className="size-6 text-forest" aria-hidden />
          </div>
          <h2 className="mt-5 font-display text-2xl text-forest">Your cart is empty</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Nothing on the shelf yet. Start with a sensorial set or a language box.
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

  return (
    <>
      <div className="wrap grid gap-10 pt-10 pb-20 lg:grid-cols-12 lg:gap-14 lg:pb-28">
      <div className="lg:col-span-7 xl:col-span-8">
        <div className="flex items-baseline justify-between">
          <p className="text-[0.72rem] tracking-[0.14em] text-muted uppercase">
            {summary.itemCount} {summary.itemCount === 1 ? "item" : "items"} in cart
          </p>
          <Link href="/shop" className="text-[0.78rem] text-forest hover:underline">
            Add more
          </Link>
        </div>

        <ul className="mt-4 divide-y divide-line border-y border-line">
          {summary.lines.map((line) => {
            const category = categoryCopy[line.product.primaryCategory];
            return (
              <li key={line.slug} className="flex gap-4 py-5 sm:gap-5">
                <Link
                  href={`/product/${line.slug}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-line bg-white sm:size-28"
                >
                  {line.product.images[0] ? (
                    <Image
                      src={line.product.images[0]}
                      alt={line.product.name}
                      fill
                      sizes="112px"
                      className="object-contain p-2"
                    />
                  ) : null}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted/80 uppercase">
                        {category?.title ?? line.product.categories[0]?.name}
                      </p>
                      <Link
                        href={`/product/${line.slug}`}
                        className="mt-1 block truncate font-display text-lg leading-snug text-ink hover:text-forest"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-[0.78rem]">
                        {line.product.price === null ? (
                          <span className="text-clay">Price on request</span>
                        ) : (
                          <span className="text-forest">{formatPrice(line.product.price)}</span>
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(line.slug)}
                      aria-label={`Remove ${line.product.name}`}
                      className="rounded-full p-2 text-muted transition-colors hover:bg-shell hover:text-clay"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(value) => setQuantity(line.slug, value)}
                      min={1}
                    />
                    <p className="text-sm text-forest">
                      {line.product.price === null
                        ? "Quoted"
                        : formatPrice(line.product.price * line.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 text-[0.75rem] leading-relaxed text-muted">
          Free delivery on orders over ₨ 15,000. Made-to-order pieces are confirmed by
          our team before production begins.
        </p>
      </div>

      <aside className="lg:col-span-5 xl:col-span-4">
        <div className="rounded-3xl border border-line bg-shell/50 p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl text-forest">Order summary</h2>

          <dl className="mt-5 space-y-3 text-sm">
            {summary.quoteCount > 0 && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted">On request</dt>
                <dd className="text-right text-[0.78rem] text-clay">
                  {summary.quoteCount} {summary.quoteCount === 1 ? "item" : "items"}
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="text-[0.78rem] text-muted">
                {summary.pricedSubtotal >= 15000 ? "Free" : "Calculated on confirmation"}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt className="font-medium text-forest">Subtotal</dt>
              <dd className="font-display text-xl text-forest">
                {formatPrice(summary.pricedSubtotal)}
              </dd>
            </div>
          </dl>

          {summary.quoteCount > 0 && (
            <p className="mt-4 rounded-2xl bg-blush/40 px-4 py-3 text-[0.75rem] leading-relaxed text-clay">
              {summary.quoteCount} made-to-order{" "}
              {summary.quoteCount === 1 ? "piece is" : "pieces are"} not priced online. We
              will send a quote with your order confirmation.
            </p>
          )}

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-pine"
          >
            Continue to checkout
            <ArrowRight className="size-4" aria-hidden />
          </Link>

          <p className="mt-4 text-center text-[0.7rem] text-muted">
            Cash on delivery · Bank transfer ·{" "}
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-forest"
            >
              Order on WhatsApp
            </a>
          </p>
        </div>
      </aside>
      </div>

      {suggestions.length > 0 && (
        <section className="border-t border-line bg-shell/40">
          <div className="wrap py-14 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Complete the shelf</p>
                <h2 className="mt-3 font-display text-title text-forest">
                  Often ordered together
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-sm font-medium text-forest underline decoration-line underline-offset-4 transition-colors hover:decoration-clay"
              >
                All materials
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {suggestions.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
