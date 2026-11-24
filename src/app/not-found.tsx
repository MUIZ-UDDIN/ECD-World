import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/catalog";
import { categoryCopy } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="wrap py-20 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-[6rem] leading-none tracking-[-0.04em] text-sand">404</p>
        <h1 className="mt-2 font-display text-display text-forest">This shelf is empty.</h1>
        <p className="mx-auto mt-4 max-w-md text-[0.92rem] leading-relaxed text-muted">
          The page you were looking for is not here. The catalogue is, though — start with a
          collection below.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-pine"
        >
          Shop all materials
          <ArrowRight className="size-4" aria-hidden />
        </Link>

        <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categories
            .filter((category) => category.slug !== "ecd-materials")
            .map((category) => (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="rounded-2xl border border-line bg-white/60 px-4 py-3 text-sm font-medium text-forest transition-colors hover:border-forest/30 hover:bg-white"
              >
                {categoryCopy[category.slug]?.title ?? category.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
