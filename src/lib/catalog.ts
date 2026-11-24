import catalogJson from "@/data/catalog.json";

export type Category = {
  slug: string;
  name: string;
  count: number;
  image: string | null;
};

export type ProductCategory = {
  slug: string;
  name: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  sku: string | null;
  shortDescription: string;
  description: string[];
  price: number | null;
  regularPrice: number | null;
  onSale: boolean;
  currency: string;
  inStock: boolean;
  categories: ProductCategory[];
  primaryCategory: string;
  images: string[];
  updated: string | null;
};

type Catalog = {
  generatedAt: string;
  categories: Category[];
  products: Product[];
};

const catalog = catalogJson as Catalog;

export const products: Product[] = catalog.products;
export const categories: Category[] = catalog.categories;
export const catalogGeneratedAt = catalog.generatedAt;

export const pricedProducts = products.filter((p) => p.price !== null);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsInCategory(slug: string): Product[] {
  return products.filter((p) => p.categories.some((c) => c.slug === slug));
}

const FEATURED_ORDER = [
  "pink-tower",
  "long-red-rods",
  "cylinder-block-part-1",
  "roman-arch",
  "binomial-cube",
  "color-tablets",
  "geometric-solids-with-stand",
  "brown-stair-brown-lacquer",
  "metal-insets",
  "constructive-triangles-in-five-boxes",
];

export function featuredRank(slug: string): number {
  const index = FEATURED_ORDER.indexOf(slug);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

/** Deterministic "featured" selection so the home page is stable between builds. */
export function featuredProducts(count = 8): Product[] {
  const picked: Product[] = [];
  for (const slug of FEATURED_ORDER) {
    const found = getProduct(slug);
    if (found && !picked.includes(found)) picked.push(found);
  }
  for (const product of products) {
    if (picked.length >= count) break;
    if (!picked.includes(product)) picked.push(product);
  }
  return picked.slice(0, count);
}

export function relatedProducts(product: Product, count = 4): Product[] {
  const shared = new Set(
    product.categories.map((c) => c.slug).filter((slug) => slug !== "ecd-materials"),
  );

  const scored = products
    .filter((candidate) => candidate.slug !== product.slug)
    .map((candidate) => ({
      product: candidate,
      score: candidate.categories.filter(
        (c) => shared.has(c.slug) && c.slug !== "ecd-materials",
      ).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = scored.slice(0, count).map((entry) => entry.product);
  if (picked.length < count) {
    for (const candidate of products) {
      if (picked.length >= count) break;
      if (candidate.slug === product.slug || picked.includes(candidate)) continue;
      picked.push(candidate);
    }
  }
  return picked;
}

export function priceLabel(product: Pick<Product, "price">): string {
  return product.price === null ? "Price on request" : formatPrice(product.price);
}

export function formatPrice(value: number): string {
  return `₨ ${value.toLocaleString("en-PK")}`;
}

export function formatPriceCompact(value: number): string {
  if (value >= 1000) {
    const thousands = value / 1000;
    return `₨ ${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}k`;
  }
  return `₨ ${value}`;
}

export const priceBounds = (() => {
  const values = pricedProducts.map((p) => p.price as number);
  return {
    min: values.length ? Math.min(...values) : 0,
    max: values.length ? Math.max(...values) : 0,
  };
})();
