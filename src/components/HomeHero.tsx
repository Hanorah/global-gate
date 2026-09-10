"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

gsap.registerPlugin(useGSAP);

export function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-media img", { scale: 1.04, duration: 1.6 }, 0)
        .from(".hero-left > *", { y: 32, opacity: 0, duration: 0.85, stagger: 0.12 }, 0.35)
        .from(".hero-display", { y: 56, opacity: 0, duration: 1.1 }, 0.45)
        .from(".hero-chip", { y: 18, opacity: 0, duration: 0.7 }, 0.85);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden bg-burgundy text-white">
      <div className="hero-media absolute inset-0">
        <Image
          src="/images/hero-graduate.jpg"
          alt="Graduate celebrating academic success"
          fill
          priority
          quality={95}
          className="object-cover object-[center_38%] sm:object-[center_36%] lg:object-[72%_40%]"
          sizes="100vw"
        />
        {/* Lighter overlays so the photo stays sharp and readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 container-page flex min-h-[100svh] flex-col justify-between pb-10 pt-28 md:pb-14 md:pt-32">
        <div className="hero-left max-w-lg">
          <p className="eyebrow !text-gold-soft">Study in Hungary</p>
          <p className="mt-5 text-xl font-medium leading-snug text-white/95 md:text-2xl lg:text-[1.7rem]">
            Trusted guidance from first enquiry to arrival — led by a team living in Hungary.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/enquire" />}
              size="lg"
              className="h-12 rounded-full bg-white px-6 text-foreground hover:bg-white/92"
            >
              Start your enquiry
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/how-it-works" />}
              size="icon-lg"
              className="size-12 rounded-full border-0 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
              aria-label="See how it works"
            >
              <ArrowUpRight className="size-5" />
            </Button>
          </div>
          <div className="hero-chip mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md">
            <span className="size-2 rounded-full bg-gold" />
            Based in Hungary · Reply within 24 hours
          </div>
        </div>

        <div className="hero-display mt-16 self-stretch text-left md:mt-0 md:self-end md:text-right">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase md:mb-4">
            Opening doors. Expanding futures.
          </p>
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] text-white">
            Your gate
            <br />
            to Hungary.
          </h1>
        </div>
      </div>
    </section>
  );
}
