import { formatPrice, type Product } from "@/lib/catalog";
import type { ResolvedLine } from "@/lib/cart";
import { site } from "@/lib/site";

export type CustomerDetails = {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  payment?: string;
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(product: Product) {
  return [
    `Hello ${site.name},`,
    ``,
    `I'd like a quote for:`,
    `• ${product.name}${product.sku ? ` (SKU ${product.sku})` : ""}`,
    product.price === null ? `Price on request` : formatPrice(product.price),
    ``,
    `Could you share pricing and availability?`,
  ].join("\n");
}

export function buildOrderMessage(lines: ResolvedLine[], customer: CustomerDetails) {
  const priced = lines.filter((line) => line.product.price !== null);
  const quoted = lines.filter((line) => line.product.price === null);
  const subtotal = priced.reduce(
    (sum, line) => sum + (line.product.price as number) * line.quantity,
    0,
  );

  const itemLines = lines.map((line, index) => {
    const amount =
      line.product.price === null
        ? "price on request"
        : formatPrice(line.product.price * line.quantity);
    return `${index + 1}. ${line.product.name} × ${line.quantity} — ${amount}`;
  });

  const blocks = [
    `*New order — ${site.name}*`,
    ``,
    `*Items*`,
    ...itemLines,
    ``,
  ];

  if (priced.length > 0) {
    blocks.push(`Priced subtotal: ${formatPrice(subtotal)}`);
  }
  if (quoted.length > 0) {
    blocks.push(
      `${quoted.length} item${quoted.length > 1 ? "s" : ""} priced on request — please send a quote.`,
    );
  }

  blocks.push(
    ``,
    `*Delivery*`,
    `Name: ${customer.name || "-"}`,
    `Phone: ${customer.phone || "-"}`,
    `City: ${customer.city || "-"}`,
    `Address: ${customer.address || "-"}`,
  );

  if (customer.payment) {
    blocks.push(`Payment: ${customer.payment}`);
  }

  if (customer.notes.trim()) {
    blocks.push(``, `*Notes*`, customer.notes.trim());
  }

  blocks.push(``, `Please confirm availability and delivery time. Thank you!`);

  return blocks.join("\n");
}
