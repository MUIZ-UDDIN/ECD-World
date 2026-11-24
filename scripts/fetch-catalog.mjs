/**
 * Pulls the live ECD World catalogue from the public WooCommerce Store API,
 * normalises it into src/data/catalog.json, and downloads/resizes product
 * imagery into public/products.
 *
 * Run with: npm run fetch:catalog
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const API = "https://ecdworld.com/wp-json/wc/store/v1/products";
const PER_PAGE = 100;
const ROOT = path.resolve(import.meta.dirname, "..");
const IMAGE_DIR = path.join(ROOT, "public", "products");
const DATA_DIR = path.join(ROOT, "src", "data");

const CATEGORY_ORDER = ["blocks", "sensorial", "language", "toys", "ecd-materials"];

/** Representative product per collection, chosen so the tile reads well at small sizes. */
const CATEGORY_IMAGE_PRODUCT = {
  blocks: "city-building-36-pcs",
  sensorial: "pink-tower",
  language: "lower-case-double-sandpaper-letters",
  toys: "mini-farm-15-pieces",
  "ecd-materials": "pink-tower",
};

/** Decode the HTML entities WooCommerce emits in names and copy. */
function decodeEntities(input = "") {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    ndash: "–",
    mdash: "—",
    hellip: "…",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
  };
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

/** Turn WordPress HTML into plain paragraphs we can render safely. */
function toParagraphs(html = "") {
  return decodeEntities(
    html
      .replace(/<\/(p|div|li|h[1-6])>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .split(/\n{2,}/)
    .map((block) => block.replace(/[ \t]+/g, " ").replace(/\n/g, " ").trim())
    .filter(Boolean);
}

function pickPrimaryCategory(categories) {
  for (const slug of CATEGORY_ORDER) {
    if (categories.some((c) => c.slug === slug)) return slug;
  }
  return categories[0]?.slug ?? "ecd-materials";
}

async function fetchAllProducts() {
  const products = [];
  for (let page = 1; page <= 10; page += 1) {
    const url = `${API}?per_page=${PER_PAGE}&page=${page}&orderby=title&order=asc`;
    const res = await fetch(url, { headers: { "User-Agent": "ecd-world-rebuild/1.0" } });
    if (!res.ok) throw new Error(`Store API ${res.status} on ${url}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    products.push(...batch);
    if (batch.length < PER_PAGE) break;
  }
  return products;
}

async function downloadImage(url, destFile) {
  const res = await fetch(url, { headers: { "User-Agent": "ecd-world-rebuild/1.0" } });
  if (!res.ok) throw new Error(`image ${res.status} ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await sharp(buffer)
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(destFile);
}

async function main() {
  console.log("Fetching catalogue from Store API…");
  const raw = await fetchAllProducts();
  console.log(`  received ${raw.length} products`);

  await rm(IMAGE_DIR, { recursive: true, force: true });
  await mkdir(IMAGE_DIR, { recursive: true });
  await mkdir(DATA_DIR, { recursive: true });

  const products = [];

  for (const item of raw) {
    const images = [];
    const unique = [...new Set(item.images.map((img) => img.src))];

    for (const [index, src] of unique.entries()) {
      const file = `${item.slug}-${index + 1}.webp`;
      try {
        await downloadImage(src, path.join(IMAGE_DIR, file));
        images.push(`/products/${file}`);
      } catch (error) {
        console.warn(`  ! image failed for ${item.slug}: ${error.message}`);
      }
    }

    const priceValue = Number(item.prices.price);
    const regularValue = Number(item.prices.regular_price);
    const saleValue = Number(item.prices.sale_price);

    products.push({
      id: item.id,
      slug: item.slug,
      name: decodeEntities(item.name).trim(),
      sku: item.sku || null,
      shortDescription: toParagraphs(item.short_description).join(" "),
      description: toParagraphs(item.description),
      price: priceValue > 0 ? priceValue : null,
      regularPrice: regularValue > 0 ? regularValue : null,
      onSale: Boolean(item.on_sale) && saleValue > 0,
      currency: item.prices.currency_code || "PKR",
      inStock: Boolean(item.is_in_stock),
      categories: item.categories.map((c) => ({ slug: c.slug, name: decodeEntities(c.name) })),
      primaryCategory: pickPrimaryCategory(item.categories),
      images,
      updated: null,
    });
  }

  products.sort((a, b) => a.name.localeCompare(b.name));

  const categories = ["blocks", "sensorial", "language", "toys", "ecd-materials"]
    .map((slug) => {
      const members = products.filter((p) => p.categories.some((c) => c.slug === slug));
      const curated = products.find((p) => p.slug === CATEGORY_IMAGE_PRODUCT[slug]);
      return {
        slug,
        name: members[0]?.categories.find((c) => c.slug === slug)?.name ?? slug,
        count: members.length,
        image: curated?.images[0] ?? members.find((p) => p.images.length)?.images[0] ?? null,
      };
    })
    .filter((c) => c.count > 0);

  const priced = products.filter((p) => p.price !== null);

  await writeFile(
    path.join(DATA_DIR, "catalog.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), categories, products }, null, 2),
    "utf8",
  );

  const imageCount = products.reduce((sum, p) => sum + p.images.length, 0);
  console.log(`\nWrote src/data/catalog.json`);
  console.log(`  products: ${products.length} (priced: ${priced.length}, price-on-request: ${products.length - priced.length})`);
  console.log(`  categories: ${categories.map((c) => `${c.slug}(${c.count})`).join(", ")}`);
  console.log(`  images: ${imageCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
