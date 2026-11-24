import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";
import { priceLabel, type Product } from "@/lib/catalog";
import { categoryCopy } from "@/lib/site";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function ProductCard({ product, priority, className, sizes }: ProductCardProps) {
  const quote = product.price === null;
  const categoryLabel =
    categoryCopy[product.primaryCategory]?.title ?? product.categories[0]?.name ?? "ECD";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white/55 transition-all duration-500 hover:-translate-y-1 hover:border-forest/15 hover:bg-white hover:shadow-lift",
        className,
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="absolute inset-0 z-0 rounded-3xl"
        aria-label={product.name}
      />

      <div className="relative aspect-4/5 overflow-hidden bg-shell/70">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes={sizes ?? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:p-7"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">No image</div>
        )}

        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-1.5">
            {product.onSale && (
              <span className="rounded-full bg-clay px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-cream uppercase">
                Sale
              </span>
            )}
            {quote && (
              <span className="rounded-full border border-line/70 bg-cream/90 px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.1em] whitespace-nowrap text-muted uppercase backdrop-blur-sm">
                On request
              </span>
            )}
          </div>
          <WishlistButton slug={product.slug} className="pointer-events-auto" />
        </div>

        <div className="absolute right-3 bottom-3 z-10 translate-y-1 opacity-100 transition-all duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <AddToCartButton slug={product.slug} variant="icon" quote={quote} />
        </div>
      </div>

      <div className="relative z-0 flex flex-1 flex-col gap-1 px-4 pt-4 pb-5 sm:px-5">
        <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted/80 uppercase">
          {categoryLabel}
        </p>
        <h3 className="font-display text-[1.05rem] leading-snug tracking-[-0.01em] text-ink sm:text-lg">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span
            className={cn(
              "text-[0.82rem] font-medium",
              quote ? "text-clay" : "text-forest",
            )}
          >
            {priceLabel(product)}
          </span>
          {product.onSale && product.regularPrice && product.price ? (
            <span className="text-[0.72rem] text-muted line-through">
              ₨ {product.regularPrice.toLocaleString("en-PK")}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
