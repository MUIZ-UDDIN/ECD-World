import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WishlistView } from "@/components/wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The materials you have saved for your classroom or nursery shelf.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <div className="border-b border-line bg-cream">
        <div className="wrap py-8 md:py-10">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
          <h1 className="mt-4 font-display text-display text-forest">Saved for later</h1>
          <p className="mt-2 max-w-md text-[0.88rem] leading-relaxed text-muted">
            Your list is kept on this device — no account needed. Move pieces to the cart
            when you are ready to order.
          </p>
        </div>
      </div>
      <WishlistView />
    </>
  );
}
