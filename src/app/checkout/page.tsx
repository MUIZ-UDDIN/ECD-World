import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CheckoutView } from "@/components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirm your delivery details and send the order to our workshop.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <div className="border-b border-line bg-cream">
        <div className="wrap py-8 md:py-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Cart", href: "/cart" },
              { label: "Checkout" },
            ]}
          />
          <h1 className="mt-4 font-display text-display text-forest">Checkout</h1>
          <p className="mt-2 max-w-md text-[0.88rem] leading-relaxed text-muted">
            Three short steps, then your order goes straight to the workshop on WhatsApp.
          </p>
        </div>
      </div>
      <CheckoutView />
    </>
  );
}
