import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the materials in your cart and send your order to the workshop.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <div className="border-b border-line bg-cream">
        <div className="wrap py-8 md:py-10">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
          <h1 className="mt-4 font-display text-display text-forest">Your cart</h1>
          <p className="mt-2 max-w-md text-[0.88rem] leading-relaxed text-muted">
            Adjust quantities, then check out by WhatsApp. Priced pieces ship this week;
            made-to-order pieces are quoted first.
          </p>
        </div>
      </div>
      <CartView />
    </>
  );
}
