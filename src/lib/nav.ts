import { categories } from "@/lib/catalog";
import { categoryCopy } from "@/lib/site";

export const navLinks = [
  { href: "/shop", label: "Shop all" },
  ...categories
    .filter((category) => category.slug !== "ecd-materials")
    .map((category) => ({
      href: `/shop/${category.slug}`,
      label: categoryCopy[category.slug]?.title ?? category.name,
    })),
];

export const shopMenu = categories.map((category) => ({
  href: `/shop/${category.slug}`,
  label: categoryCopy[category.slug]?.title ?? category.name,
  blurb: categoryCopy[category.slug]?.blurb ?? "",
  count: category.count,
  image: category.image,
}));
