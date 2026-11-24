"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { SearchDialog } from "@/components/search-dialog";
import { Wordmark } from "@/components/wordmark";
import { shopMenu, navLinks } from "@/lib/nav";
import { site } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/use-store";

export function SiteHeader() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = useStore((state) =>
    state.cart.reduce((sum, line) => sum + line.quantity, 0),
  );
  const wishlistCount = useStore((state) => state.wishlist.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (href: string) =>
    href === "/shop" ? pathname === "/shop" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-line bg-cream/88 backdrop-blur-xl"
            : "border-b border-transparent bg-cream",
        )}
      >
        <div className="wrap flex h-16 items-center justify-between gap-4 md:h-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ml-2 rounded-full p-2 text-forest transition-colors hover:bg-shell lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu className="size-5" aria-hidden />
            </button>

            <Link href="/" className="group" aria-label={`${site.name} home`}>
              <Wordmark className="transition-opacity group-hover:opacity-80" />
            </Link>
          </div>

          <nav className="hidden lg:flex lg:items-center lg:gap-8" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[0.82rem] font-medium tracking-wide transition-colors",
                  isActive(link.href) ? "text-forest" : "text-muted hover:text-forest",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-clay transition-transform duration-300",
                    isActive(link.href) ? "scale-x-100" : "scale-x-0",
                  )}
                  aria-hidden
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2.5 text-forest transition-colors hover:bg-shell"
              aria-label="Search"
            >
              <Search className="size-[1.15rem]" aria-hidden />
            </button>

            <Link
              href="/wishlist"
              className="relative rounded-full p-2.5 text-forest transition-colors hover:bg-shell"
              aria-label={`Wishlist${hydrated && wishlistCount ? `, ${wishlistCount} items` : ""}`}
            >
              <Heart className="size-[1.15rem]" aria-hidden />
              {hydrated && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-clay text-[0.6rem] font-semibold text-cream">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative ml-0.5 flex items-center gap-2 rounded-full bg-forest px-3.5 py-2.5 text-cream transition-colors hover:bg-pine sm:px-4"
              aria-label={`Cart${hydrated && cartCount ? `, ${cartCount} items` : ""}`}
            >
              <ShoppingBag className="size-[1.05rem]" aria-hidden />
              <span className="hidden text-[0.78rem] font-medium sm:inline">
                {hydrated ? cartCount : 0}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div
        className={cn(
          "fixed inset-0 z-90 bg-forest text-cream transition-all duration-400 lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        <div className="wrap flex h-16 items-center justify-between md:h-20">
          <span className="font-display text-xl tracking-[-0.02em] text-cream">Menu</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-full p-2 text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
            aria-label="Close menu"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <nav
          className="wrap mt-6 flex max-h-[calc(100dvh-9rem)] flex-col overflow-y-auto pb-10"
          aria-label="Mobile"
        >
          <Link
            href="/shop"
            className="border-b border-cream/15 py-4 font-display text-3xl tracking-[-0.02em] transition-colors hover:text-ember"
          >
            Shop all
          </Link>

          {shopMenu.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-baseline justify-between border-b border-cream/15 py-3.5 transition-colors hover:text-ember"
            >
              <span className="font-display text-2xl tracking-[-0.01em]">{item.label}</span>
              <span className="shrink-0 text-[0.65rem] tracking-[0.2em] whitespace-nowrap text-cream/40">
                {String(index + 1).padStart(2, "0")} · {item.count}
              </span>
            </Link>
          ))}

          <div className="mt-8 grid grid-cols-2 gap-2 text-[0.78rem]">
            {[
              { href: "/about", label: "Our workshop" },
              { href: "/contact", label: "Contact" },
              { href: "/wishlist", label: `Wishlist${hydrated && wishlistCount ? ` (${wishlistCount})` : ""}` },
              { href: "/cart", label: `Cart${hydrated && cartCount ? ` (${cartCount})` : ""}` },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-cream/20 px-4 py-2.5 text-center text-cream/80 transition-colors hover:border-cream/50 hover:text-cream"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-cream px-5 py-3.5 text-sm font-medium text-forest"
          >
            WhatsApp us · {site.whatsappDisplay}
          </a>
          <p className="mt-3 text-center text-[0.68rem] tracking-[0.18em] text-cream/40 uppercase">
            {site.hours}
          </p>
        </nav>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
