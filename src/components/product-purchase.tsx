"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { QuantityStepper } from "@/components/quantity-stepper";
import { WishlistButton } from "@/components/wishlist-button";
import { formatPrice, type Product } from "@/lib/catalog";
import { productEnquiryMessage, whatsappLink } from "@/lib/whatsapp";

export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const quote = product.price === null;
  const lineTotal = product.price === null ? null : product.price * quantity;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
        <div>
          <p className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">
            {quote ? "Price" : "Price"}
          </p>
          <p className="mt-1 flex items-baseline gap-3 font-display text-3xl text-forest">
            {quote ? (
              <span className="text-clay">On request</span>
            ) : (
              <>
                {formatPrice(product.price as number)}
                {product.onSale && product.regularPrice ? (
                  <span className="text-base font-normal text-muted line-through">
                    {formatPrice(product.regularPrice)}
                  </span>
                ) : null}
              </>
            )}
          </p>
          <p className="mt-1.5 text-[0.72rem] text-muted">
            {quote
              ? "Quoted per set — usually within a working day."
              : "Inclusive of taxes. Delivery calculated at checkout."}
          </p>
        </div>
        {!quote && lineTotal !== null && quantity > 1 ? (
          <p className="text-sm text-muted">
            {quantity} × {formatPrice(product.price as number)} ={" "}
            <span className="font-medium text-forest">{formatPrice(lineTotal)}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <QuantityStepper value={quantity} onChange={setQuantity} className="h-12 shrink-0 justify-between px-1" />
        <AddToCartButton
          slug={product.slug}
          quantity={quantity}
          quote={quote}
          className="h-12 flex-1"
        >
          {quote ? "Add to quote request" : "Add to cart"}
        </AddToCartButton>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <WishlistButton slug={product.slug} variant="inline" className="h-12 flex-1" />
        <a
          href={whatsappLink(productEnquiryMessage(product))}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-forest/20 px-5 text-sm font-medium text-forest transition-colors hover:border-forest/40 hover:bg-shell"
        >
          Ask on WhatsApp
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>

      <div className="mt-6 space-y-2.5 rounded-2xl border border-line bg-shell/40 px-4 py-4 text-[0.78rem] text-muted">
        <p className="flex items-start gap-2.5">
          <Truck className="mt-px size-3.5 shrink-0 text-forest" aria-hidden />
          {quote
            ? "Made to order — allow 2–3 weeks. Nationwide delivery."
            : "Ready to ship — allow 3–5 working days. Nationwide delivery."}
        </p>
        <p className="flex items-start gap-2.5">
          <Check className="mt-px size-3.5 shrink-0 text-forest" aria-hidden />
          Cash on delivery and bank transfer accepted.
        </p>
        <p className="flex items-start gap-2.5">
          <Check className="mt-px size-3.5 shrink-0 text-forest" aria-hidden />
          Spare pieces and replacements available for schools.
        </p>
      </div>
    </div>
  );
}
