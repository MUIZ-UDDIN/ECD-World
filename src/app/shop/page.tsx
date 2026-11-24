import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ShopBrowser } from "@/components/shop-browser";
import { categories, pricedProducts, products } from "@/lib/catalog";
import { categoryCopy, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop all materials",
  description:
    "Browse every Montessori and early-childhood material in the ECD World catalogue — blocks, sensorial apparatus, language sets and wooden toys. Prices in PKR, shipped nationwide.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <>
      <div className="border-b border-line bg-cream">
        <div className="wrap py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} className="mb-6" />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7 xl:col-span-8">
              <p className="eyebrow">The catalogue</p>
              <h1 className="mt-3 font-display text-display text-forest">
                Every material,
                <br />
                <span className="text-clay italic">one shelf.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[0.92rem] leading-relaxed text-muted">
                {products.length} pieces, made and finished in our workshop.{" "}
                {pricedProducts.length} are priced and ready to ship; the rest are made to
                order and quoted per set.
              </p>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <p className="text-[0.62rem] tracking-[0.18em] text-muted uppercase">Jump to</p>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {categories
                  .filter((category) => category.slug !== "ecd-materials")
                  .map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/shop/${category.slug}`}
                        className="group flex items-center justify-between gap-3 py-2.5 text-sm text-forest transition-colors hover:text-clay"
                      >
                        <span className="font-medium">
                          {categoryCopy[category.slug]?.title ?? category.name}
                        </span>
                        <span className="flex items-center gap-2 text-[0.7rem] text-muted">
                          {category.count}
                          <ArrowUpRight
                            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap pt-2 pb-20 md:pb-28">
        <ShopBrowser items={products} initialQuery={q ?? ""} />
      </div>

      <div className="wrap pb-20">
        <div className="rounded-3xl border border-line bg-shell/50 px-6 py-8 sm:px-8">
          <p className="eyebrow">Can&apos;t find it?</p>
          <p className="mt-2 max-w-2xl font-display text-xl leading-snug text-forest">
            We build custom classroom sets. Send a list or a drawing and we&apos;ll quote it.
          </p>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest transition-colors hover:border-forest/40 hover:bg-cream"
          >
            Message the workshop
          </a>
        </div>
      </div>
    </>
  );
}
