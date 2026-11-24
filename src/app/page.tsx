import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import {
  categories,
  featuredProducts,
  getProduct,
  pricedProducts,
  products,
} from "@/lib/catalog";
import { categoryCopy, site, valueProps } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const heroImages = [
  { slug: "pink-tower", label: "Pink Tower", meta: "Sensorial · 10 cubes" },
  { slug: "long-red-rods", label: "Long Red Rods", meta: "Sensorial · 10 rods" },
  { slug: "binomial-cube", label: "Binomial Cube", meta: "Sensorial · 8 cubes" },
  { slug: "color-tablets", label: "Colour Tablets", meta: "Sensorial · 11 pairs" },
];

export default function HomePage() {
  const featured = featuredProducts(8);
  const readyToShip = pricedProducts.slice(0, 4);
  const categoryTiles = categories.filter((category) => category.slug !== "ecd-materials");

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-line bg-cream">
        <div
          className="pointer-events-none absolute -top-40 -right-32 size-[38rem] rounded-full bg-shell/70 blur-3xl"
          aria-hidden
        />
        <div className="wrap relative grid gap-12 pt-12 pb-14 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pt-16 lg:pb-24">
          <div className="animate-fade-up lg:col-span-6 xl:col-span-5">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-clay" aria-hidden />
              Montessori · Early years
            </p>

            <h1 className="mt-6 font-display text-display-xl text-forest">
              Materials that teach
              <span className="block text-clay italic">the hand</span>
              before the mind.
            </h1>

            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-muted">
              Montessori apparatus cut, sanded and finished by hand in our own workshop —
              plus a small, carefully chosen set of blocks and toys for the years before
              formal materials.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-pine"
              >
                Shop the collection
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-6 py-3.5 text-sm font-medium text-forest transition-colors hover:border-forest/40 hover:bg-shell"
              >
                For schools
              </Link>
            </div>

            <dl className="mt-10 grid max-w-sm grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                { value: `${products.length}`, label: "Materials" },
                { value: `${categories.length}`, label: "Collections" },
                { value: `${products.filter((p) => p.price === null).length}`, label: "Made to order" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-2xl text-forest">{stat.value}</dt>
                  <dd className="mt-0.5 text-[0.68rem] tracking-[0.14em] text-muted uppercase">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Collage */}
          <div className="relative lg:col-span-6 xl:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                <HeroTile item={heroImages[0]} className="aspect-3/4" priority />
                <HeroTile item={heroImages[2]} className="aspect-4/3" />
              </div>
              <div className="flex flex-col gap-3 pt-6 sm:gap-4 sm:pt-10">
                <HeroTile item={heroImages[1]} className="aspect-4/3" priority />
                <HeroTile item={heroImages[3]} className="aspect-3/4" />
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-line bg-cream/95 px-5 py-2.5 shadow-lift backdrop-blur-sm sm:flex">
              <span className="size-1.5 rounded-full bg-clay" aria-hidden />
              <span className="text-[0.68rem] font-medium tracking-[0.14em] text-forest uppercase">
                Made by hand in our workshop
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Value props ---------------- */}
      <section className="border-b border-line bg-cream">
        <div className="wrap grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-4 md:gap-8 md:py-12">
          {valueProps.map((prop, index) => (
            <div key={prop.title} className="flex flex-col gap-2">
              <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-clay/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-[0.82rem] font-medium text-forest">{prop.title}</p>
              <p className="text-[0.78rem] leading-relaxed text-muted">{prop.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section className="wrap py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Collections</p>
            <h2 className="mt-3 max-w-xl font-display text-title text-forest">
              Shop by sense and stage
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-forest"
          >
            All {products.length} materials
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categoryTiles.map((category) => {
            const copy = categoryCopy[category.slug];
            return (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white/60 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-forest/15 hover:bg-white hover:shadow-lift sm:p-5"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 22vw"
                      className="object-contain p-3 transition-transform duration-700 group-hover:scale-105 sm:p-4"
                    />
                  ) : null}
                </div>
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl leading-none tracking-[-0.01em] text-forest">
                      {copy?.title ?? category.name}
                    </h3>
                    <p className="mt-2 text-[0.72rem] leading-snug text-muted">{copy?.blurb}</p>
                  </div>
                  <span className="mt-1 font-display text-[0.8rem] text-muted/70">
                    {String(category.count).padStart(2, "0")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------------- Featured ---------------- */}
      <section className="border-y border-line bg-shell/40">
        <div className="wrap py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">From the workshop</p>
              <h2 className="mt-3 max-w-xl font-display text-title text-forest">
                Pieces worth handing down
              </h2>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-forest"
            >
              View all
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                priority={index < 4}
                className="bg-white/70"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Editorial / made to order ---------------- */}
      <section className="bg-forest text-cream">
        <div className="wrap grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-cream/10 bg-cream/5">
              <div className="relative aspect-4/5">
                <Image
                  src="/products/metal-insets-1.webp"
                  alt="Metal insets for handwriting practice"
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-contain p-8"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-cream/10 bg-forest/70 px-5 py-3 backdrop-blur-sm">
                <span className="text-[0.65rem] tracking-[0.18em] text-cream/60 uppercase">
                  Metal Insets
                </span>
                <span className="text-[0.65rem] tracking-[0.18em] text-cream/60 uppercase">
                  Language
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:py-4">
            <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-sage uppercase">
              How we make it
            </p>
            <h2 className="mt-4 max-w-xl font-display text-title text-cream">
              Made by hand, to be handled.
            </h2>
            <p className="mt-5 max-w-xl text-[0.92rem] leading-relaxed text-cream/70">
              Most of our classroom materials are made to order. That is deliberate: a
              Pink Tower or a set of grammar boxes should be cut, sanded and finished
              properly, not pulled off a shelf. It also means we can size a set to your
              room, your shelf and your budget.
            </p>

            <div className="mt-9 divide-y divide-cream/10 border-y border-cream/10">
              {[
                {
                  title: "Solid beech & pine",
                  body: "Bodies and boxes are cut from solid stock, then sanded by hand at every grit.",
                },
                {
                  title: "Child-safe finishes",
                  body: "Water-based lacquer and non-toxic pigments — safe for mouths and hands.",
                },
                {
                  title: "Made to your classroom",
                  body: "Bulk sets, spare pieces and replacements, quoted per order.",
                },
              ].map((item, index) => (
                <div key={item.title} className="flex gap-5 py-4">
                  <span className="pt-0.5 font-display text-sm text-clay">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-cream">{item.title}</p>
                    <p className="mt-1 max-w-md text-[0.82rem] leading-relaxed text-cream/60">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={whatsappLink(
                  `Hello ${site.name}, I'd like to discuss a made-to-order set for our classroom.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-medium text-forest transition-colors hover:bg-white"
              >
                Request a quote
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <Link
                href="/about"
                className="text-sm text-cream/70 underline decoration-cream/20 underline-offset-4 transition-colors hover:text-cream"
              >
                About the workshop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Ready to ship ---------------- */}
      <section className="wrap py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">In stock</p>
            <h2 className="mt-3 max-w-xl font-display text-title text-forest">
              Ready to ship this week
            </h2>
          </div>
          <p className="max-w-xs text-[0.78rem] leading-relaxed text-muted">
            Priced and packed for immediate delivery. Everything else is made to order.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {readyToShip.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* ---------------- Schools CTA ---------------- */}
      <section className="wrap pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-4xl border border-line bg-shell px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <div
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-blush/50 blur-3xl"
            aria-hidden
          />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow">Schools &amp; teachers</p>
              <h2 className="mt-3 max-w-lg font-display text-title text-forest">
                Outfitting a classroom?
              </h2>
              <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-muted">
                Send us your list — or your shelf dimensions — and we&apos;ll quote the
                full set, including spares and replacements. We ship nationwide.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
              <a
                href={whatsappLink(
                  `Hello ${site.name}, we are outfitting a classroom and would like a quote.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-pine"
              >
                WhatsApp us
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-6 py-3.5 text-sm font-medium text-forest transition-colors hover:border-forest/40 hover:bg-cream"
              >
                Contact form
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroTile({
  item,
  className,
  priority,
}: {
  item: { slug: string; label: string; meta: string };
  className?: string;
  priority?: boolean;
}) {
  const product = getProduct(item.slug);
  if (!product?.images[0]) return null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group relative block overflow-hidden rounded-3xl border border-line bg-white ${className ?? ""}`}
    >
      <Image
        src={product.images[0]}
        alt={product.name}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 45vw, 26vw"
        className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105 sm:p-6"
      />
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 transition-opacity duration-300">
        <div className="rounded-2xl border border-line/70 bg-cream/90 px-3 py-2 backdrop-blur-sm">
          <p className="text-[0.72rem] leading-none font-medium text-forest">{item.label}</p>
          <p className="mt-1 text-[0.58rem] tracking-[0.12em] text-muted uppercase">{item.meta}</p>
        </div>
      </div>
    </Link>
  );
}
