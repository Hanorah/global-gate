"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { navLinks, site, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const inverted = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        open
          ? "border-transparent bg-transparent"
          : inverted
            ? "bg-transparent"
            : "border-b border-border/70 bg-background/85 shadow-[0_10px_40px_rgba(18,17,15,0.06)] backdrop-blur-xl",
      )}
    >
      <div className="container-page relative z-[70] flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <div className={cn(open && "opacity-0 pointer-events-none")}>
          <BrandLogo
            showWordmark
            className={cn(
              inverted &&
                "[&_span:last-child>span:first-child]:text-white [&_span:last-child>span:last-child]:text-white/70",
            )}
          />
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.filter((l) => l.href !== "/").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-medium transition-opacity hover:opacity-70",
                inverted ? "text-white/80" : "text-muted-foreground",
                pathname === link.href && (inverted ? "text-white" : "text-foreground"),
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            nativeButton={false}
            render={<Link href={whatsappUrl()} target="_blank" rel="noreferrer" />}
            variant="ghost"
            className={cn(
              "hidden rounded-full sm:inline-flex",
              inverted && "text-white hover:bg-white/10 hover:text-white",
            )}
          >
            WhatsApp
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/enquire" />}
            className={cn(
              "hidden rounded-full px-5 sm:inline-flex",
              inverted
                ? "bg-white text-foreground hover:bg-white/90"
                : "bg-foreground text-background hover:bg-foreground/90",
            )}
          >
            Enquire
            <ArrowUpRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "relative z-[80] lg:hidden",
              open
                ? "text-white hover:bg-white/10 hover:text-white"
                : inverted && "text-white hover:bg-white/10 hover:text-white",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          "transition-[opacity,visibility] duration-400 ease-out",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-burgundy" />
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blush/10 blur-3xl" />

        <div
          className={cn(
            "relative flex h-[100dvh] flex-col overflow-y-auto overscroll-contain",
            "[-webkit-overflow-scrolling:touch]",
          )}
        >
          <div className="flex items-center justify-between px-6 pb-2 pt-5">
            <BrandLogo
              className="[&_span]:ring-white/10"
            />
            <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-soft uppercase">
              Menu
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-6 pb-10 pt-6">
            <p className="text-xs font-medium tracking-[0.18em] text-white/40 uppercase">
              Explore
            </p>

            <nav className="mt-6 flex flex-col">
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-baseline justify-between gap-4 border-b border-white/10 py-5 transition-colors",
                      active ? "border-gold/40" : "hover:border-white/25",
                    )}
                    style={{
                      transitionDelay: open ? `${i * 40}ms` : "0ms",
                    }}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="w-6 text-[11px] font-semibold tracking-[0.14em] text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-[2rem] leading-none tracking-tight sm:text-[2.35rem]",
                          active ? "text-white" : "text-white/75 group-hover:text-white",
                        )}
                      >
                        {link.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "size-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                        active ? "text-gold" : "text-white/35 group-hover:text-gold-soft",
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4 pt-10">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold tracking-[0.16em] text-gold-soft uppercase">
                  Talk to us
                </p>
                <p className="mt-2 text-sm text-white/65">
                  Reply usually within 24 hours · Based in Hungary
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <Button
                    nativeButton={false}
                    render={<Link href="/enquire" onClick={() => setOpen(false)} />}
                    className="h-12 w-full rounded-full bg-white text-foreground hover:bg-white/90"
                    tabIndex={open ? 0 : -1}
                  >
                    Enquire now
                    <ArrowUpRight className="size-4" />
                  </Button>
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        href={whatsappUrl()}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setOpen(false)}
                      />
                    }
                    variant="outline"
                    className="h-12 w-full rounded-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    tabIndex={open ? 0 : -1}
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 px-1 text-xs text-white/40">
                <a href={`tel:${site.contact.phone}`} className="hover:text-white/70" tabIndex={open ? 0 : -1}>
                  {site.contact.phoneDisplay}
                </a>
                <span className="tracking-[0.14em] uppercase">GGSN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
