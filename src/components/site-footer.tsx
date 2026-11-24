import Link from "next/link";
import { categories } from "@/lib/catalog";
import { categoryCopy, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-shell/60 md:mt-20">
      <div className="wrap py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl leading-[1.1] tracking-[-0.02em] text-forest">
              Made slowly,
              <br />
              for small hands.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              {site.description}
            </p>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-forest underline decoration-line decoration-1 underline-offset-4 transition-colors hover:decoration-clay"
            >
              Talk to us on WhatsApp
              <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/shop/${category.slug}`}
                    className="text-muted transition-colors hover:text-forest"
                  >
                    {categoryCopy[category.slug]?.title ?? category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/about", label: "Our workshop" },
                { href: "/contact", label: "Contact" },
                { href: "/wishlist", label: "Wishlist" },
                { href: "/cart", label: "Cart" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted transition-colors hover:text-forest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow">Visit &amp; order</p>
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
              <p>
                {site.address.line1}
                <br />
                {site.address.line2}
              </p>
              <p>{site.hours}</p>
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-forest">
                  {site.email}
                </a>
              </p>
              <p>{site.whatsappDisplay}</p>
            </div>
            <div className="mt-5 flex gap-2">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-line px-3 py-1.5 text-[0.7rem] font-medium tracking-wide text-muted transition-colors hover:border-forest hover:text-forest"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[0.72rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-4">
            <span>Cash on delivery</span>
            <span className="h-3 w-px bg-line" aria-hidden />
            <span>Bank transfer</span>
            <span className="h-3 w-px bg-line" aria-hidden />
            <span>Nationwide shipping</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
