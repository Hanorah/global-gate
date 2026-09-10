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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        inverted
          ? "bg-transparent"
          : "border-b border-border/70 bg-background/85 shadow-[0_10px_40px_rgba(18,17,15,0.06)] backdrop-blur-xl",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
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
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              nativeButton={false}
              render={<Link href="/enquire" onClick={() => setOpen(false)} />}
              className="mt-2 rounded-full"
            >
              Enquire now
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
