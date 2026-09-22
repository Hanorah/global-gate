"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, CheckCircle2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { journeySteps, site, testimonials, faqs } from "@/lib/site";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const trustItems = [
  "Based in Hungary",
  "Africa → Europe pathways",
  "Referral-backed support",
  "Transparent USD pricing",
  "Reply within 24 hours",
  "Visa & arrival guidance",
];

function BigNumber() {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const obj = { n: 0 };
      gsap.to(obj, {
        n: 24,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = `${Math.round(obj.n)}h`;
        },
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className="font-display text-[clamp(5.5rem,18vw,13rem)] leading-none tracking-tight text-foreground">
      24h
    </p>
  );
}

export default function HomePageClient() {
  return (
    <>
      <HomeHero />

      <section className="border-y border-border bg-background/80 py-5 backdrop-blur-sm">
        <div className="marquee">
          <div className="marquee-track text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {[...trustItems, ...trustItems].map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-gold" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Badge className="rounded-full bg-blush text-foreground hover:bg-blush">Why students trust us</Badge>
            <h2 className="mt-5 font-display text-4xl md:text-6xl">
              Clear support. Honest pricing. A real person in Hungary.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Applicants often fear scams. We answer with named leadership, published contacts,
              transparent fees, and steady communication.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "On the ground",
                body: "Tommy is based in Hungary, so processing and follow-up feel closer, clearer, faster.",
              },
              {
                icon: ShieldCheck,
                title: "Referral-backed",
                body: "Students choose Global Gate because people they know already walked this path.",
              },
              {
                icon: Sparkles,
                title: "After arrival too",
                body: "Support continues past the airport: housing research, registration, mentoring.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <Card className="h-full rounded-[1.75rem] border-border/60 bg-white/80 shadow-none backdrop-blur">
                  <CardContent className="p-8">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-surface">
                      <item.icon className="size-5 text-gold" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-burgundy text-white">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <p className="eyebrow !text-gold-soft">The journey</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl">
              From first message to your first weeks in Hungary.
            </h2>
            <p className="mt-5 max-w-xl text-white/70 md:text-lg">
              One guided path: understand your goals, strengthen your file, prepare for visa and
              travel, then settle in with support that stays with you.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/how-it-works" />}
              className="mt-8 h-12 rounded-full bg-white px-6 text-foreground hover:bg-white/90"
            >
              See the full process
              <ArrowUpRight className="size-4" />
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-3">
              {journeySteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm md:p-6"
                >
                  <div className="flex gap-4">
                    <span className="text-sm font-semibold tracking-[0.16em] text-gold">{step.step}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="mt-1.5 text-sm text-white/65">{step.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(18,17,15,0.18)]">
              <Image
                src={site.images.duoDiploma}
                alt="Graduates celebrating with diploma"
                width={1024}
                height={682}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white md:p-8">
                <p className="text-sm text-white/70">Student success starts with trusted guidance</p>
                <p className="mt-1 font-display text-3xl">Admission → Visa → Arrival</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Badge className="rounded-full">End-to-end support</Badge>
            <h2 className="mt-5 font-display text-4xl md:text-5xl">
              Everything between “I want to study abroad” and “I have landed.”
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                "University & programme selection",
                "Document review and application filing",
                "Stipendium Hungaricum guidance",
                "Visa, accommodation, airport & mentoring",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button nativeButton={false} render={<Link href="/services" />} className="h-11 rounded-full px-5">
                Explore services
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/fees" />}
                variant="outline"
                className="h-11 rounded-full px-5"
              >
                View pricing
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-page text-center">
          <Reveal>
            <p className="eyebrow">Response time</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              We reply while the decision still feels urgent.
            </h2>
            <div className="mt-8">
              <BigNumber />
            </div>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Typical first response after you submit the enquiry form.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-5 text-left md:grid-cols-2">
            <Reveal>
              <Card className="overflow-hidden rounded-[2rem] border-0 bg-burgundy text-white shadow-none">
                <CardContent className="flex min-h-[300px] flex-col justify-between p-8 md:p-10">
                  <div>
                    <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">Starter</Badge>
                    <h3 className="mt-5 text-3xl font-semibold tracking-tight">
                      {site.pricing.application.label}
                    </h3>
                    <p className="mt-3 text-white/70">Focused help preparing and submitting applications.</p>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <p className="font-display text-5xl">${site.pricing.application.price}</p>
                    <span className="pb-2 text-sm text-white/50">USD</span>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.08}>
              <Card className="overflow-hidden rounded-[2rem] border-0 bg-blush shadow-none">
                <CardContent className="flex min-h-[300px] flex-col justify-between p-8 md:p-10">
                  <div>
                    <Badge className="rounded-full bg-white text-foreground hover:bg-white">Most chosen</Badge>
                    <h3 className="mt-5 text-3xl font-semibold tracking-tight">
                      {site.pricing.fullGuide.label}
                    </h3>
                    <p className="mt-3 text-ink-soft">{site.pricing.fullGuide.includes}</p>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <p className="font-display text-5xl">${site.pricing.fullGuide.price}</p>
                    <span className="pb-2 text-sm text-ink-soft">USD</span>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Testimonials</p>
              <h2 className="mt-3 font-display text-4xl md:text-6xl">Trusted across borders</h2>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/testimonials" />}
              variant="outline"
              className="h-11 w-fit rounded-full px-5"
            >
              All stories
            </Button>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((item, i) => (
              <Reveal key={item.name} delay={i * 0.07}>
                <Card className="h-full overflow-hidden rounded-[1.75rem] border-border/60 bg-white shadow-none">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: item.objectPosition }}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-white/65">{item.context}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="leading-relaxed text-muted-foreground">&ldquo;{item.quote}&rdquo;</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Common questions, answered clearly.</h2>
            <p className="mt-4 text-muted-foreground">
              Trust, pricing, timelines, and what we can help with, without the sales fog.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/faq" />}
              variant="outline"
              className="mt-6 h-11 rounded-full px-5"
            >
              View all FAQs
            </Button>
          </Reveal>
          <div className="space-y-3">
            {faqs.slice(0, 4).map((item, i) => (
              <Reveal key={item.q} delay={i * 0.04}>
                <details className="rounded-[1.25rem] border border-border/70 bg-white px-5 py-4">
                  <summary className="cursor-pointer list-none font-semibold tracking-tight marker:content-none [&::-webkit-details-marker]:hidden">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
