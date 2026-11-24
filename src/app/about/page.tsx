import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { categories, getProduct, products } from "@/lib/catalog";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Our workshop",
  description:
    "How ECD World builds Montessori materials in Pakistan — solid hardwood, child-safe finishes, and made-to-order sets for classrooms.",
  alternates: { canonical: "/about" },
};

function shot(slug: string) {
  const product = getProduct(slug);
  return product?.images[0] ?? null;
}

export default function AboutPage() {
  const heroImage = shot("brown-stair-brown-lacquer");
  const secondaryImage = shot("geometric-solids-with-stand");

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Our workshop" }]} />
            <p className="eyebrow mt-6">Our workshop</p>
            <h1 className="mt-3 font-display text-display text-forest">
              A workshop,
              <br />
              <span className="text-clay italic">not a warehouse.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-muted">
              ECD World began with a simple frustration: the Montessori materials that
              schools needed were either imported and unaffordable, or locally made and
              badly finished. So we started making them ourselves — cut, sanded, joined
              and lacquered in our own workshop in Pakistan.
            </p>
            <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-muted">
              Every piece is built to the dimensions and sequence the method depends on.
              None of it is drop-shipped. Where we cannot make something well ourselves —
              a boxed building set, for instance — we stock a small, tested selection
              instead, and say so.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-5 gap-3 sm:gap-4">
              <div className="relative col-span-3 aspect-4/5 overflow-hidden rounded-3xl border border-line bg-white">
                {heroImage && (
                  <Image
                    src={heroImage}
                    alt="Brown stair — solid beech, hand-finished"
                    fill
                    priority
                    sizes="(max-width: 1024px) 55vw, 30vw"
                    className="object-contain p-5"
                  />
                )}
              </div>
              <div className="col-span-2 flex flex-col gap-3 pt-8 sm:gap-4 sm:pt-12">
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-white">
                  {secondaryImage && (
                    <Image
                      src={secondaryImage}
                      alt="Geometric solids with stand"
                      fill
                      sizes="(max-width: 1024px) 35vw, 18vw"
                      className="object-contain p-4"
                    />
                  )}
                </div>
                <div className="rounded-3xl border border-line bg-forest p-4 text-cream">
                  <p className="font-display text-2xl leading-none">{products.length}</p>
                  <p className="mt-1.5 text-[0.62rem] tracking-[0.14em] text-cream/60 uppercase">
                    Materials made
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-b border-line bg-shell/40">
        <div className="wrap grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {[
            { value: `${categories.length}`, label: "Collections" },
            { value: `${products.length}`, label: "Materials" },
            { value: `${products.filter((p) => p.price === null).length}`, label: "Made to order" },
            { value: "PK", label: "Made in Pakistan" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl text-forest">{stat.value}</p>
              <p className="mt-1 text-[0.66rem] tracking-[0.14em] text-muted uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="wrap py-16 md:py-24">
        <div className="max-w-xl">
          <p className="eyebrow">The process</p>
          <h2 className="mt-3 font-display text-title text-forest">Four passes, by hand</h2>
          <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">
            Nothing moves to the next stage until the previous one is right. That is why
            most of the catalogue is made to order rather than stacked on a shelf.
          </p>
        </div>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Select",
              body: "Beech and pine are chosen for straight grain and low movement, then left to settle before cutting.",
            },
            {
              title: "Cut & join",
              body: "Parts are cut to the exact dimensions the apparatus depends on — 1 cm increments, true right angles.",
            },
            {
              title: "Sand",
              body: "Every face and edge is worked through the grits until it is smooth enough for a child's palm.",
            },
            {
              title: "Finish",
              body: "Water-based lacquer and non-toxic pigment. Cured fully before it is wrapped or boxed.",
            },
          ].map((step, index) => (
            <li key={step.title} className="bg-cream p-6">
              <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-clay/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-xl text-forest">{step.title}</h3>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Philosophy */}
      <section className="bg-forest text-cream">
        <div className="wrap py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <blockquote className="lg:col-span-7">
              <p className="font-display text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.18] tracking-[-0.02em]">
                “The hand is the instrument of the mind. A material that wobbles, splinters
                or looks wrong teaches the wrong lesson.”
              </p>
              <footer className="mt-6 text-[0.68rem] tracking-[0.18em] text-cream/50 uppercase">
                The standard we build to
              </footer>
            </blockquote>

            <div className="lg:col-span-5">
              <p className="text-[0.9rem] leading-relaxed text-cream/70">
                We keep the catalogue close to the method: sensorial apparatus that isolates
                one quality, language materials that follow the child&apos;s own sequence,
                and blocks that do not prescribe an outcome.
              </p>
              <p className="mt-4 text-[0.9rem] leading-relaxed text-cream/70">
                If something on the shelf is not right for your room, we would rather adjust
                it than sell it.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-medium text-forest hover:bg-white"
                >
                  Browse materials
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a
                  href={whatsappLink(`Hello ${site.name}, I'd like to ask about a custom set.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-5 py-3 text-sm font-medium text-cream/90 hover:border-cream/50"
                >
                  Ask a question
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wrap py-16 md:py-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-4xl border border-line bg-shell px-6 py-10 sm:px-10 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-title text-forest">Visiting, or ordering for a school?</h2>
            <p className="mt-2 max-w-lg text-[0.88rem] leading-relaxed text-muted">
              We are happy to talk through a full classroom list, shelf by shelf.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream hover:bg-pine"
          >
            Get in touch
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
