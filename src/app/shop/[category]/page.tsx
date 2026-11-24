import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { ShopBrowser } from "@/components/shop-browser";
import { getCategory, productsInCategory } from "@/lib/catalog";
import { categoryCopy } from "@/lib/site";

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return ["blocks", "sensorial", "language", "toys", "ecd-materials"].map((category) => ({
    category,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Collection not found" };
  const copy = categoryCopy[slug];
  const title = copy?.title ?? category.name;

  return {
    title,
    description: `${copy?.blurb ?? category.name} — ${category.count} handcrafted pieces from the ECD World workshop. Prices in PKR, shipped across Pakistan.`,
    alternates: { canonical: `/shop/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = productsInCategory(slug);
  const copy = categoryCopy[slug];

  return (
    <>
      <PageHeader
        eyebrow={`Collection ${copy?.index ?? ""}`}
        title={copy?.title ?? category.name}
        description={copy?.blurb}
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: copy?.title ?? category.name },
          ]}
          className="mb-6"
        />
      </PageHeader>

      <div className="wrap pt-2 pb-20 md:pb-28">
        <ShopBrowser items={items} fixedCategory={slug} />
      </div>
    </>
  );
}
