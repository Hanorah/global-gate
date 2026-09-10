"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { navLinks, whatsappUrl } from "@/lib/site";
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        open
          ? "border-transparent bg-background"
          : inverted
            ? "bg-transparent"
            : "border-b border-border/70 bg-background/85 shadow-[0_10px_40px_rgba(18,17,15,0.06)] backdrop-blur-xl",
      )}
    >
      <div className="container-page relative z-[60] flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <BrandLogo
          showWordmark
          className={cn(
            inverted &&
              "[&_span:last-child>span:first-child]:text-white [&_span:last-child>span:last-child]:text-white/70",
          )}
        />

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
            className={cn("lg:hidden", inverted && "text-white hover:bg-white/10 hover:text-white")}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-background lg:hidden",
          "transition-opacity duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-24">
          <nav className="flex flex-1 flex-col justify-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b border-border/60 py-4 font-display text-3xl tracking-tight transition-colors sm:text-4xl",
                  pathname === link.href ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                )}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/enquire" onClick={() => setOpen(false)} />}
              className="h-12 w-full rounded-full"
              tabIndex={open ? 0 : -1}
            >
              Enquire now
              <ArrowUpRight className="size-4" />
            </Button>
            <Button
              nativeButton={false}
              render={
                <Link href={whatsappUrl()} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} />
              }
              variant="outline"
              className="h-12 w-full rounded-full"
              tabIndex={open ? 0 : -1}
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
