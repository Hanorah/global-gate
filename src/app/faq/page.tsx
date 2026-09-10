import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Button } from "@/components/ui/button";
import { faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about Global Gate Students Network, fees, visas, and studying in Hungary.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Answers before you enquire."
        body="Clear answers on trust, pricing, timelines, and what we do — and do not — promise."
        image={site.images.groupCampus}
        objectPosition="center 45%"
        primaryHref="/enquire"
        primaryLabel="Start enquiry"
      />

      <section className="section-pad">
        <div className="container-page max-w-3xl space-y-4">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.03}>
              <details className="group rounded-[1.5rem] border border-border/70 bg-white px-6 py-5 open:shadow-[0_16px_40px_rgba(18,17,15,0.06)]">
                <summary className="cursor-pointer list-none text-lg font-semibold tracking-tight marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.q}
                    <span className="mt-1 text-gold transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-muted-foreground">{item.a}</p>
              </details>
            </Reveal>
          ))}
          <div className="pt-6">
            <Button nativeButton={false} render={<Link href="/enquire" />} className="h-11 rounded-full px-5">
              Still have a question? Enquire
            </Button>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
