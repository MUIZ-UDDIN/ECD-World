"use client";

import { Check, MessageCircle } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

type Errors = Partial<Record<"name" | "phone" | "message", string>>;

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", organisation: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [lastLink, setLastLink] = useState("");

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (form.phone.replace(/\D/g, "").length < 10) next.phone = "Enter a valid phone number.";
    if (form.message.trim().length < 10) next.message = "Tell us a little more.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const message = [
      `Hello ${site.name},`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.organisation.trim() ? `School / organisation: ${form.organisation}` : null,
      ``,
      form.message.trim(),
    ]
      .filter((line) => line !== null)
      .join("\n");

    const link = whatsappLink(message);
    setLastLink(link);
    window.open(link, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-3xl border border-line bg-white/60 p-7 text-center sm:p-10">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-forest text-cream">
          <Check className="size-5" aria-hidden />
        </div>
        <h3 className="mt-5 font-display text-2xl text-forest">Message ready</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          WhatsApp should have opened with your message. If it didn&apos;t, use the button
          below — we usually reply within a working day.
        </p>
        <a
          href={lastLink}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream hover:bg-pine"
        >
          <MessageCircle className="size-4" aria-hidden />
          Open WhatsApp
        </a>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({ name: "", phone: "", organisation: "", message: "" });
          }}
          className="mt-4 block w-full text-[0.78rem] text-muted underline underline-offset-4 hover:text-forest"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-line bg-white/50 p-6 sm:p-8">
      <h2 className="font-display text-2xl text-forest">Send a message</h2>
      <p className="mt-1.5 text-[0.82rem] text-muted">
        Goes straight to WhatsApp — the fastest way to reach the workshop.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="c-name" className="mb-1.5 block text-[0.72rem] font-medium text-forest">
              Name
            </label>
            <input
              id="c-name"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              autoComplete="name"
              className={inputClass(!!errors.name)}
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1.5 text-[0.7rem] text-clay">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="c-phone" className="mb-1.5 block text-[0.72rem] font-medium text-forest">
              Phone
            </label>
            <input
              id="c-phone"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              inputMode="tel"
              autoComplete="tel"
              className={inputClass(!!errors.phone)}
              placeholder="0300 1234567"
            />
            {errors.phone && <p className="mt-1.5 text-[0.7rem] text-clay">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="c-org" className="mb-1.5 block text-[0.72rem] font-medium text-forest">
            School / organisation <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="c-org"
            value={form.organisation}
            onChange={(event) => update("organisation", event.target.value)}
            className={inputClass(false)}
            placeholder="e.g. Little Oaks Montessori"
          />
        </div>

        <div>
          <label htmlFor="c-message" className="mb-1.5 block text-[0.72rem] font-medium text-forest">
            Message
          </label>
          <textarea
            id="c-message"
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            rows={4}
            className={cn(inputClass(!!errors.message), "resize-none")}
            placeholder="What are you looking for? A set, a single piece, a quote for a classroom…"
          />
          {errors.message && <p className="mt-1.5 text-[0.7rem] text-clay">{errors.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-pine"
      >
        <MessageCircle className="size-4" aria-hidden />
        Send via WhatsApp
      </button>
      <p className="mt-3 text-center text-[0.7rem] text-muted">
        Prefer email? Write to{" "}
        <a href={`mailto:${site.email}`} className="underline underline-offset-2 hover:text-forest">
          {site.email}
        </a>
      </p>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-2xl border bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-muted/50 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/10",
    hasError ? "border-clay/60" : "border-line",
  );
}
