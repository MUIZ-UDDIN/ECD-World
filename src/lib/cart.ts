import { getProduct, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/catalog";
import type { CartLine } from "@/store/use-store";

export type ResolvedLine = CartLine & { product: Product };

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = getProduct(line.slug);
    return product ? [{ ...line, product }] : [];
  });
}

export type CartSummary = {
  lines: ResolvedLine[];
  itemCount: number;
  pricedSubtotal: number;
  quoteCount: number;
  pricedCount: number;
};

export function summariseCart(lines: CartLine[]): CartSummary {
  const resolved = resolveLines(lines);
  const priced = resolved.filter((line) => line.product.price !== null);
  return {
    lines: resolved,
    itemCount: resolved.reduce((sum, line) => sum + line.quantity, 0),
    pricedSubtotal: priced.reduce(
      (sum, line) => sum + (line.product.price as number) * line.quantity,
      0,
    ),
    quoteCount: resolved.filter((line) => line.product.price === null).length,
    pricedCount: priced.length,
  };
}

export function lineTotal(line: ResolvedLine): number | null {
  return line.product.price === null ? null : line.product.price * line.quantity;
}

export function summariseOrder(lines: ResolvedLine[]) {
  const priced = lines.filter((line) => line.product.price !== null);
  const subtotal = priced.reduce(
    (sum, line) => sum + (line.product.price as number) * line.quantity,
    0,
  );
  return {
    subtotal,
    hasQuoteItems: priced.length !== lines.length,
    pricedLabels: priced.map((line) => formatPrice((line.product.price as number) * line.quantity)),
  };
}
