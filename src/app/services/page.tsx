import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pageHeroes, services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: "University selection, applications, visa support, arrival help, and post-arrival mentoring.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Support across the full student journey."
        body="From choosing a programme to finding your feet after landing in Hungary: practical, hands-on help at every stage."
        image={pageHeroes.services.image}
        objectPosition={pageHeroes.services.objectPosition}
        primaryHref="/enquire"
        primaryLabel="Ask about your case"
        secondaryHref="/fees"
        secondaryLabel="View fees"
      />

      <section className="section-pad">
        <div className="container-page grid gap-4 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 2) * 0.05}>
              <Card className="h-full rounded-[1.75rem] border-border/60 bg-white/90 shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(18,17,15,0.08)]">
                <CardContent className="p-8">
                  <p className="text-xs font-semibold tracking-[0.16em] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">{service.title}</h2>
                  <p className="mt-3 text-muted-foreground">{service.body}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="container-page mt-12">
          <Card className="overflow-hidden rounded-[2rem] border-0 shadow-none">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[280px]">
                <Image
                  src={site.images.portraitRed}
                  alt="Graduate in red stole"
                  fill
                  className="object-cover object-[center_40%]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <CardContent className="bg-burgundy p-8 text-white md:p-10">
                <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">Important</Badge>
                <h3 className="mt-4 font-display text-3xl md:text-4xl">Stipendium Hungaricum note</h3>
                <p className="mt-4 text-white/70">
                  We provide guidance and preparation support for scholarship pathways. Official
                  applications are free and submitted through official channels. We do not sell or
                  guarantee scholarship awards.
                </p>
                <Button
                  nativeButton={false}
                  render={<Link href="/enquire" />}
                  className="mt-6 h-11 rounded-full bg-white text-foreground hover:bg-white/90"
                >
                  Talk to us
                </Button>
              </CardContent>
            </div>
          </Card>
        </Reveal>
      </section>

      <section className="section-pad border-t border-border bg-surface">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Beyond admission</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Support doesn&apos;t stop at the airport.</h2>
            <p className="mt-4 text-muted-foreground">
              Visa prep, arrival, and settling in are part of the same journey, not an afterthought.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Visa & travel prep",
                body: "Appointment prep, checklist review, and travel planning before you fly.",
                image: site.images.visaPrep,
              },
              {
                title: "Airport & arrival",
                body: "Landing in a new country is easier when someone is expecting you.",
                image: site.images.airportArrival,
              },
              {
                title: "Post-arrival mentoring",
                body: "Support continues while you find your footing in Hungary.",
                image: site.images.mentoring,
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <Card className="h-full overflow-hidden rounded-[1.75rem] border-0 shadow-none">
                  <div className="relative h-52">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardContent className="bg-white p-6">
                    <h3 className="font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
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
