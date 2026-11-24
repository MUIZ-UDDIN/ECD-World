import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { getProduct, products, relatedProducts } from "@/lib/catalog";
import { categoryCopy, site } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  const description =
    product.shortDescription ||
    `${product.name} — handcrafted Montessori material from ${site.name}.`;

  return {
    title: product.name,
    description: description.slice(0, 158),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: description.slice(0, 158),
      type: "website",
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = product.categories.find((c) => c.slug === product.primaryCategory);
  const categoryTitle = categoryCopy[category?.slug ?? ""]?.title ?? category?.name ?? "Shop";
  const related = relatedProducts(product, 4);
  const quote = product.price === null;
  const workshopMade = !["blocks", "toys"].includes(product.primaryCategory);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku ?? undefined,
    description: product.shortDescription || product.description.join(" "),
    image: product.images.map((image) => `${site.url ?? "https://ecdworld.com"}${image}`),
    brand: { "@type": "Brand", name: site.name },
    category: category?.name,
    ...(product.price !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "PKR",
            price: product.price,
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `https://ecdworld.com/product/${product.slug}`,
          },
        }
      : {}),
  };

  return (
    <>
      <div className="wrap pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: categoryTitle, href: `/shop/${category?.slug ?? ""}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="wrap mt-6 grid gap-10 pt-2 pb-16 lg:grid-cols-12 lg:gap-14 lg:pb-24">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} name={product.name} quote={quote} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <Link
                href={`/shop/${category?.slug ?? ""}`}
                className="text-[0.65rem] font-semibold tracking-[0.18em] text-clay uppercase transition-colors hover:text-ember"
              >
                {categoryTitle}
              </Link>
              {product.sku && (
                <>
                  <span className="h-2.5 w-px bg-line" aria-hidden />
                  <span className="text-[0.65rem] tracking-[0.14em] text-muted uppercase">
                    {product.sku}
                  </span>
                </>
              )}
              <span className="ml-auto flex items-center gap-1.5 text-[0.65rem] tracking-[0.12em] text-moss uppercase">
                <span className="size-1.5 rounded-full bg-moss" aria-hidden />
                {quote ? "Made to order" : "In stock"}
              </span>
            </div>

            <h1 className="mt-4 font-display text-[2.1rem] leading-[1.05] tracking-[-0.02em] text-forest sm:text-[2.6rem]">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">
                {product.shortDescription}
              </p>
            )}

            <ProductPurchase product={product} />

            <div className="mt-8 divide-y divide-line border-t border-line">
              <Detail title="Description" defaultOpen>
                {product.description.length > 0 ? (
                  <div className="space-y-3">
                    {product.description.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p>{product.shortDescription}</p>
                )}
              </Detail>

              <Detail title={workshopMade ? "Materials & care" : "Contents & care"}>
                <ul className="space-y-2">
                  {workshopMade ? (
                    <>
                      <li>Solid beech or pine body, sanded and sealed by hand.</li>
                      <li>Water-based, child-safe lacquer and non-toxic pigments.</li>
                      <li>Wipe with a soft dry cloth. Avoid soaking or harsh cleaners.</li>
                      <li>Small parts — adult supervision recommended under 3 years.</li>
                    </>
                  ) : (
                    <>
                      <li>Supplied boxed, with the piece count shown on the packaging.</li>
                      <li>Wipe clean with a damp cloth. Do not soak or sterilise.</li>
                      <li>Small parts — not suitable for children under 3 unsupervised.</li>
                      <li>Packaging and colours may vary slightly between batches.</li>
                    </>
                  )}
                </ul>
              </Detail>

              <Detail title="Shipping & returns">
                <ul className="space-y-2">
                  <li>
                    {quote
                      ? "Made to order: allow 2–3 weeks before dispatch."
                      : "Ready to ship: dispatched within 3–5 working days."}
                  </li>
                  <li>Nationwide delivery across Pakistan; free over ₨ 15,000.</li>
                  <li>Cash on delivery or bank transfer.</li>
                  <li>
                    Damaged in transit? Send a photo within 48 hours and we will replace the
                    piece or part.
                  </li>
                </ul>
              </Detail>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-shell/40">
          <div className="wrap py-14 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Continue</p>
                <h2 className="mt-3 font-display text-title text-forest">
                  Often shelved together
                </h2>
              </div>
              <Link
                href={`/shop/${category?.slug ?? ""}`}
                className="text-sm font-medium text-forest underline decoration-line underline-offset-4 transition-colors hover:decoration-clay"
              >
                All {categoryTitle.toLowerCase()}
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

function Detail({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group py-1">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.8rem] font-medium tracking-[0.02em] text-forest marker:hidden">
        {title}
        <span
          className="text-muted transition-transform duration-300 group-open:rotate-45"
          aria-hidden
        >
          +
        </span>
      </summary>
      <div className="pb-5 text-[0.82rem] leading-relaxed text-muted">{children}</div>
    </details>
  );
}
