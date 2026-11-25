"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Lock, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { summariseCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { site } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { buildOrderMessage, whatsappLink, type CustomerDetails } from "@/lib/whatsapp";
import { useStore } from "@/store/use-store";

type Errors = Partial<Record<"name" | "phone" | "city" | "address", string>>;

const paymentOptions = ["Cash on delivery", "Bank transfer"] as const;

export function CheckoutView() {
  const hydrated = useHydrated();
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const summary = useMemo(() => summariseCart(cart), [cart]);

  const [form, setForm] = useState<CustomerDetails>({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
    payment: paymentOptions[0],
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [lastLink, setLastLink] = useState("");

  if (!hydrated) {
    return (
      <div className="wrap grid gap-10 py-14 lg:grid-cols-12">
        <div className="h-96 animate-pulse rounded-3xl bg-shell/60 lg:col-span-7" />
        <div className="h-72 animate-pulse rounded-3xl bg-shell/60 lg:col-span-5" />
      </div>
    );
  }

  if (sent) {
    return (
      <div className="wrap py-16 md:py-24">
        <div className="mx-auto max-w-lg rounded-4xl border border-line bg-white/60 px-7 py-12 text-center sm:px-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-forest text-cream">
            <Check className="size-6" aria-hidden />
          </div>
          <h2 className="mt-6 font-display text-3xl text-forest">Order ready to send</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            WhatsApp should have opened with your order. Send that message and our team
            will confirm stock, delivery and the quote for any made-to-order pieces.
          </p>
          {lastLink && (
            <a
              href={lastLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream hover:bg-pine"
            >
              <MessageCircle className="size-4" aria-hidden />
              Open WhatsApp again
            </a>
          )}
          <div className="mt-6 flex flex-col items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => {
                clearCart();
                setSent(false);
                setForm({
                  name: "",
                  phone: "",
                  city: "",
                  address: "",
                  notes: "",
                  payment: paymentOptions[0],
                });
              }}
              className="text-forest underline decoration-line underline-offset-4 hover:decoration-clay"
            >
              Start a new order
            </button>
            <Link href="/shop" className="text-muted hover:text-forest">
              Back to the collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (summary.lines.length === 0) {
    return (
      <div className="wrap py-20 md:py-28">
        <div className="mx-auto max-w-md rounded-4xl border border-line bg-white/50 px-8 py-14 text-center">
          <h2 className="font-display text-2xl text-forest">Nothing to check out</h2>
          <p className="mt-2 text-sm text-muted">
            Add a few pieces to your cart first — priced items ship this week, the rest are
            quoted.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream hover:bg-pine"
          >
            Browse the collection
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  const update = (key: keyof CustomerDetails, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 10) next.phone = "Enter a valid phone number.";
    if (form.city.trim().length < 2) next.city = "Which city should we ship to?";
    if (form.address.trim().length < 10) next.address = "Add a street address or landmark.";
    return next;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    const message = buildOrderMessage(summary.lines, form);
    const link = whatsappLink(message);
    setLastLink(link);
    window.open(link, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="wrap grid gap-10 pt-8 pb-20 lg:grid-cols-12 lg:gap-14 lg:pb-28">
      <div className="min-w-0 lg:col-span-7">
        <section>
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-forest text-[0.7rem] font-semibold text-cream">
              1
            </span>
            <h2 className="font-display text-xl text-forest">Contact</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name} htmlFor="name">
              <input
                id="name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                autoComplete="name"
                className={inputClass(!!errors.name)}
                placeholder="Ayesha Khan"
              />
            </Field>
            <Field label="Phone / WhatsApp" error={errors.phone} htmlFor="phone">
              <input
                id="phone"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                inputMode="tel"
                autoComplete="tel"
                className={inputClass(!!errors.phone)}
                placeholder="0300 1234567"
              />
            </Field>
          </div>
        </section>

        <section className="mt-10 border-t border-line pt-8">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-forest text-[0.7rem] font-semibold text-cream">
              2
            </span>
            <h2 className="font-display text-xl text-forest">Delivery</h2>
          </div>

          <div className="mt-5 grid gap-4">
            <Field label="City" error={errors.city} htmlFor="city">
              <input
                id="city"
                value={form.city}
                onChange={(event) => update("city", event.target.value)}
                autoComplete="address-level2"
                className={inputClass(!!errors.city)}
                placeholder="Lahore"
              />
            </Field>

            <Field label="Street address" error={errors.address} htmlFor="address">
              <textarea
                id="address"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                rows={3}
                autoComplete="street-address"
                className={cn(inputClass(!!errors.address), "resize-none")}
                placeholder="House / street / area, plus a landmark if that helps the courier."
              />
            </Field>

            <Field label="Notes (optional)" htmlFor="notes">
              <textarea
                id="notes"
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                rows={2}
                className={cn(inputClass(false), "resize-none")}
                placeholder="School name, GST details, delivery timing…"
              />
            </Field>
          </div>
        </section>

        <section className="mt-10 border-t border-line pt-8">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-forest text-[0.7rem] font-semibold text-cream">
              3
            </span>
            <h2 className="font-display text-xl text-forest">Payment</h2>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {paymentOptions.map((option) => (
              <label
                key={option}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-colors",
                  form.payment === option
                    ? "border-forest bg-shell/60 text-forest"
                    : "border-line bg-white/50 text-muted hover:border-forest/30",
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  value={option}
                  checked={form.payment === option}
                  onChange={() => update("payment", option)}
                  className="size-4 accent-forest"
                />
                {option}
              </label>
            ))}
          </div>
          <p className="mt-3 text-[0.72rem] text-muted">
            No card details are taken online. We confirm the total and quote by WhatsApp
            before anything is dispatched.
          </p>
        </section>

        <button
          type="submit"
          className="mt-9 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-sm font-medium text-cream transition-colors hover:bg-pine sm:w-auto sm:px-10"
        >
          <MessageCircle className="size-4" aria-hidden />
          Send order on WhatsApp
        </button>
        <p className="mt-3 flex items-center gap-1.5 text-[0.72rem] text-muted">
          <Lock className="size-3" aria-hidden />
          Sent straight to the workshop. No account needed.
        </p>
      </div>

      <aside className="min-w-0 lg:col-span-5">
        <div className="rounded-3xl border border-line bg-shell/50 p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl text-forest">Your order</h2>

          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            {summary.lines.map((line) => (
              <li key={line.slug} className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                  {line.product.images[0] ? (
                    <Image
                      src={line.product.images[0]}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[0.82rem] font-medium text-ink">
                    {line.product.name}
                  </p>
                  <p className="text-[0.7rem] text-muted">
                    Qty {line.quantity} ·{" "}
                    {line.product.price === null
                      ? "on request"
                      : formatPrice(line.product.price * line.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium text-ink">{formatPrice(summary.pricedSubtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="text-[0.78rem] text-muted">
                {summary.pricedSubtotal >= 15000 ? "Free" : "Confirmed on WhatsApp"}
              </dd>
            </div>
            {summary.quoteCount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">On request</dt>
                <dd className="text-right text-[0.78rem] text-clay">
                  {summary.quoteCount} {summary.quoteCount === 1 ? "piece" : "pieces"}
                </dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-3">
              <dt className="font-medium text-forest">Total</dt>
              <dd className="font-display text-xl text-forest">
                {formatPrice(summary.pricedSubtotal)}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-[0.72rem] leading-relaxed text-muted">
            We will confirm availability, delivery charge and any made-to-order quotes
            before production. Nothing is charged online.
          </p>
          <p className="mt-3 text-[0.72rem] text-muted">
            Questions? {site.whatsappDisplay}
          </p>
        </div>
      </aside>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-2xl border bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-muted/50 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/10",
    hasError ? "border-clay/60" : "border-line",
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.72rem] font-medium text-forest">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-[0.7rem] text-clay">
          {error}
        </p>
      )}
    </div>
  );
}
