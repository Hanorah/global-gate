import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pageHeroes, testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What students and referrers say about working with Global Gate Students Network.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Trusted through referrals — and real conversations."
        body="Names and contexts below come from Tommy’s client list. Full programme details will be confirmed before final quote polish."
        image={pageHeroes.testimonials.image}
        objectPosition={pageHeroes.testimonials.objectPosition}
        primaryHref="/enquire"
        primaryLabel="Start your enquiry"
      />

      <section className="section-pad">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={(i % 2) * 0.06}>
              <Card className="h-full overflow-hidden rounded-[1.75rem] border-border/60 bg-white shadow-none">
                <div className="relative h-64 md:h-72">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover"
                    style={{ objectPosition: item.objectPosition }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm text-white/70">{item.context}</p>
                  </div>
                </div>
                <CardContent className="p-6 md:p-8">
                  <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="container-page mt-12 text-center">
          <Button nativeButton={false} render={<Link href="/enquire" />} className="h-11 rounded-full px-5">
            Become the next success story
          </Button>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
