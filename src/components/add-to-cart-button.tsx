"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/use-store";

type AddToCartButtonProps = {
  slug: string;
  quantity?: number;
  variant?: "primary" | "ghost" | "icon";
  quote?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function AddToCartButton({
  slug,
  quantity = 1,
  variant = "primary",
  quote = false,
  className,
  children,
}: AddToCartButtonProps) {
  const addToCart = useStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  const handleClick = () => {
    addToCart(slug, quantity);
    setAdded(true);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={quote ? "Add to quote request" : "Add to cart"}
        title={quote ? "Add to quote request" : "Add to cart"}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full border shadow-lift transition-all duration-300",
          added
            ? "border-forest bg-forest text-cream"
            : "border-line/80 bg-cream/90 text-forest hover:border-forest hover:bg-forest hover:text-cream",
          className,
        )}
      >
        {added ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 active:scale-[0.98]",
        variant === "primary"
          ? "bg-forest text-cream hover:bg-pine"
          : "border border-forest/20 bg-transparent text-forest hover:border-forest/40 hover:bg-shell",
        added && "bg-pine",
        className,
      )}
    >
      {added ? <Check className="size-4" aria-hidden /> : null}
      {added ? "Added to cart" : (children ?? (quote ? "Add to quote" : "Add to cart"))}
    </button>
  );
}
