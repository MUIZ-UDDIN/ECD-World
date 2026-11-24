"use client";

import { Heart } from "lucide-react";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/use-store";

type WishlistButtonProps = {
  slug: string;
  className?: string;
  variant?: "icon" | "inline";
  label?: string;
};

export function WishlistButton({
  slug,
  className,
  variant = "icon",
  label = "Save to wishlist",
}: WishlistButtonProps) {
  const hydrated = useHydrated();
  const saved = useStore((state) => state.wishlist.includes(slug));
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const active = hydrated && saved;

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={() => toggleWishlist(slug)}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-all",
          active
            ? "border-clay/30 bg-blush/60 text-clay"
            : "border-line bg-transparent text-forest hover:border-forest/40 hover:bg-shell",
          className,
        )}
      >
        <Heart className={cn("size-4", active && "fill-clay")} aria-hidden />
        {active ? "Saved to wishlist" : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(slug)}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : label}
      title={active ? "Remove from wishlist" : label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
        active
          ? "border-blush bg-cream text-clay"
          : "border-line/80 bg-cream/85 text-forest hover:border-forest/30 hover:bg-cream",
        className,
      )}
    >
      <Heart className={cn("size-4 transition-transform", active && "scale-110 fill-clay")} aria-hidden />
    </button>
  );
}
