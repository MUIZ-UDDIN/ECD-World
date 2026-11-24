import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the ECD World workshop about classroom sets, bulk orders, replacement parts or a single piece. WhatsApp, email or the contact form.",
  alternates: { canonical: "/contact" },
};

const faqs = [
  {
    question: "Why are some prices missing?",
    answer:
      "Most classroom apparatus is made to order, so the price depends on the wood, the size of the set and the finish. Add those pieces to your cart or send them on WhatsApp and we will quote them — usually within a working day.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Priced, in-stock pieces are dispatched within 3–5 working days. Made-to-order pieces take 2–3 weeks before dispatch. Delivery is nationwide, and free on orders over ₨ 15,000.",
  },
  {
    question: "Do you offer school or bulk pricing?",
    answer:
      "Yes. Send a list of what you need — or your shelf dimensions — and we will quote the full set, including spares. Replacement parts are available individually.",
  },
  {
    question: "Are the finishes safe for young children?",
    answer:
      "We use water-based lacquers and non-toxic pigments throughout, and sand every edge by hand. Small parts are not suitable for children under three without supervision.",
  },
  {
    question: "Can I visit the workshop?",
    answer:
      "You are welcome to. Message us first so someone is free to walk you through the catalogue and show you the finishes.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <p className="eyebrow mt-6">Contact</p>
          <h1 className="mt-3 max-w-2xl font-display text-display text-forest">
            Tell us what the room needs.
          </h1>
          <p className="mt-4 max-w-xl text-[0.93rem] leading-relaxed text-muted">
            A single replacement rod, a full sensorial shelf, or a classroom list — send it
            over. WhatsApp is the fastest route; the form below opens straight into it.
          </p>
        </div>
      </section>

      <section className="wrap grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="space-y-3">
            <a
              href={whatsappLink(`Hello ${site.name}, I'd like to ask about an order.`)}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-4 rounded-3xl border border-line bg-white/50 p-5 transition-colors hover:border-forest/25 hover:bg-white"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest text-cream">
                <MessageCircle className="size-4.5" aria-hidden />
              </span>
              <span>
                <span className="block text-[0.66rem] tracking-[0.16em] text-muted uppercase">
                  WhatsApp
                </span>
                <span className="mt-1 block text-sm font-medium text-forest">
                  {site.whatsappDisplay}
                </span>
                <span className="mt-0.5 block text-[0.75rem] text-muted">
                  Fastest — usually answered within the hour.
                </span>
              </span>
            </a>

            <a
              href={`mailto:${site.email}`}
              className="group flex items-start gap-4 rounded-3xl border border-line bg-white/50 p-5 transition-colors hover:border-forest/25 hover:bg-white"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-shell text-forest">
                <Mail className="size-4.5" aria-hidden />
              </span>
              <span>
                <span className="block text-[0.66rem] tracking-[0.16em] text-muted uppercase">
                  Email
                </span>
                <span className="mt-1 block text-sm font-medium text-forest">{site.email}</span>
                <span className="mt-0.5 block text-[0.75rem] text-muted">
                  For school purchase orders and invoices.
                </span>
              </span>
            </a>

            <div className="flex items-start gap-4 rounded-3xl border border-line bg-white/50 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-shell text-forest">
                <MapPin className="size-4.5" aria-hidden />
              </span>
              <span>
                <span className="block text-[0.66rem] tracking-[0.16em] text-muted uppercase">
                  Workshop
                </span>
                <span className="mt-1 block text-sm font-medium text-forest">
                  {site.address.line1}, {site.address.line2}
                </span>
                <span className="mt-0.5 block text-[0.75rem] text-muted">
                  Visits by appointment.
                </span>
              </span>
            </div>

            <div className="flex items-start gap-4 rounded-3xl border border-line bg-white/50 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-shell text-forest">
                <Clock className="size-4.5" aria-hidden />
              </span>
              <span>
                <span className="block text-[0.66rem] tracking-[0.16em] text-muted uppercase">
                  Hours
                </span>
                <span className="mt-1 block text-sm font-medium text-forest">{site.hours}</span>
                <span className="mt-0.5 block text-[0.75rem] text-muted">
                  Closed on Sundays and public holidays.
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </section>

      <section className="border-t border-line bg-shell/40">
        <div className="wrap py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">Questions</p>
              <h2 className="mt-3 font-display text-title text-forest">Before you write</h2>
              <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">
                The answers most schools and parents ask for.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="divide-y divide-line border-y border-line">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.9rem] font-medium text-forest marker:hidden">
                      {faq.question}
                      <span
                        className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45"
                        aria-hidden
                      >
                        +
                      </span>
                    </summary>
                    <p className="pb-5 text-[0.84rem] leading-relaxed text-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
