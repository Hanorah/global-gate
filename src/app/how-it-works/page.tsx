import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/seo";
import { journeySteps, pageHeroes, site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "How It Works",
  description:
    "See how Global Gate guides you from first enquiry to arrival in Hungary: programme choice, applications, visa prep, and post-arrival support.",
  path: "/how-it-works",
  image: pageHeroes.howItWorks.image,
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="A clear path from enquiry to arrival."
        body="We keep the journey simple: understand your goals, prepare a strong file, support visa steps, then help you settle in Hungary."
        image={pageHeroes.howItWorks.image}
        objectPosition={pageHeroes.howItWorks.objectPosition}
        primaryHref="/enquire"
        primaryLabel="Start enquiry"
      />

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src={site.images.seatedGraduates}
                alt="Graduates at ceremony"
                width={900}
                height={1100}
                className="h-full w-full object-cover object-[center_top]"
              />
            </div>
            <p className="mt-5 text-muted-foreground">
              Every step is designed to reduce uncertainty, especially for first-time international applicants.
            </p>
            <Button nativeButton={false} render={<Link href="/services" />} className="mt-6 h-11 rounded-full px-5">
              Explore services
            </Button>
          </Reveal>

          <div className="space-y-4">
            {journeySteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.04}>
                <Card className="rounded-[1.75rem] border-border/60 bg-white/90 shadow-none">
                  <CardContent className="grid gap-4 p-7 md:grid-cols-[88px_1fr] md:p-8">
                    <p className="text-sm font-semibold tracking-[0.16em] text-gold">{step.step}</p>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight">{step.title}</h2>
                      <p className="mt-3 text-muted-foreground">{step.body}</p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
