import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { documents, hungarianUniversities, pageHeroes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Study guide",
  description: "What bachelor, master, and PhD applicants typically need when preparing to study in Hungary.",
};

export default function GuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Program guide"
        title="What you need before you apply."
        body="Whether you are finishing secondary school or aiming for a master’s or PhD, strong documents and clear goals make the process smoother."
        image={pageHeroes.guide.image}
        objectPosition={pageHeroes.guide.objectPosition}
        primaryHref="/enquire"
        primaryLabel="Get personalised guidance"
      />

      <section className="section-pad border-b border-border">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Bachelor",
              body: "Usually after secondary school (WAEC, NECO or equivalent). Focus on certificates, transcripts, and a clear programme fit.",
              image: site.images.groupCampus,
            },
            {
              title: "Master",
              body: "Built on a completed bachelor degree. Expect closer review of transcripts, motivation letter, and field alignment.",
              image: site.images.duoDiploma,
            },
            {
              title: "PhD / transfer",
              body: "Research fit and documentation matter even more. Already in Europe? We help you plan the next step carefully.",
              image: site.images.portraitLookback,
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <Card className="overflow-hidden rounded-[1.75rem] border-0 shadow-none">
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardContent className="bg-white p-6">
                  <h2 className="font-display text-3xl">{item.title}</h2>
                  <p className="mt-3 text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <Reveal>
            <p className="eyebrow">Documents</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Typical checklist</h2>
            <p className="mt-4 text-muted-foreground">
              Universities may request extras. After your enquiry, we will tell you exactly what to
              send, with an email option if online uploads are difficult.
            </p>
            <div className="mt-8 overflow-hidden rounded-[1.75rem]">
              <Image
                src={site.images.documentFlatlay}
                alt="Application documents laid out for review"
                width={1000}
                height={560}
                className="h-auto w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="rounded-[1.75rem] border-border/60 bg-white/90 shadow-none">
              <CardContent className="p-8">
                <ul className="space-y-3">
                  {documents.map((doc) => (
                    <li key={doc} className="border-b border-border pb-3 text-muted-foreground last:border-0">
                      {doc}
                    </li>
                  ))}
                </ul>
                <Button nativeButton={false} render={<Link href="/enquire" />} className="mt-8 h-11 rounded-full px-5">
                  Start with an enquiry
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-surface">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Universities</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Hungarian universities to know</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              A general shortlist of well-known Stipendium Hungaricum partner universities offering
              English-taught programmes, not a list of confirmed placements. Your advisor will
              discuss which specific universities fit your field, grades, and budget once you
              enquire.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hungarianUniversities.map((uni, i) => (
              <Reveal key={uni.name} delay={i * 0.04}>
                <Card className="h-full rounded-[1.5rem] border-border/60 bg-white/90 shadow-none">
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl leading-tight">{uni.name}</h3>
                    <p className="eyebrow mt-2">{uni.location}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{uni.note}</p>
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
