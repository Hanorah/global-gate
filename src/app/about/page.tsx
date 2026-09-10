import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pageHeroes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${site.founder.name}, Co-Founder & CEO of ${site.name}.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={site.founder.name}
        body={`${site.founder.role} · ${site.name}`}
        image={pageHeroes.about.image}
        objectPosition={pageHeroes.about.objectPosition}
      />

      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] bg-white p-4 shadow-[0_20px_50px_rgba(18,17,15,0.08)]">
              <Image
                src="/images/logo.png"
                alt={site.name}
                width={480}
                height={480}
                quality={95}
                className="mx-auto h-auto w-full max-w-[280px] object-contain"
              />
            </div>
            <Card className="mt-5 rounded-[1.5rem] border-0 bg-burgundy text-white shadow-none">
              <CardContent className="p-6">
                <p className="text-sm text-gold-soft">Photo of Tommy coming soon</p>
                <p className="mt-2 font-display text-2xl">{site.founder.name}</p>
                <p className="mt-1 text-sm text-white/65">{site.founder.role}</p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.08} className="space-y-5 text-lg text-muted-foreground">
            <p>
              Tommy Kaiza Koker is a Sierra Leonean student leader, entrepreneur, and creative
              professional — and the Co-Founder & Chief Executive Officer of Global Gate Students
              Network.
            </p>
            <p>
              The initiative connects students across borders and creates pathways to education,
              opportunity, networking, and personal development. Tommy founded Global Gate with a
              vision of helping young people access reliable information and pursue education beyond
              their home countries.
            </p>
            <p>
              Coming from Sierra Leone and pursuing higher education internationally, he understands
              the challenges students face: finding trustworthy guidance, preparing strong files,
              adapting to new environments, and building networks abroad.
            </p>
            <p>
              As CEO, Tommy leads the organisation’s vision, partnerships, communications, and
              growth — with a simple commitment: connect students globally, create opportunities,
              and help the next generation learn, connect, and grow.
            </p>
            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[1.25rem]">
                <Image
                  src={site.images.seatedGraduates}
                  alt="Graduates seated at ceremony"
                  width={600}
                  height={400}
                  className="h-40 w-full object-cover object-[center_35%]"
                />
              </div>
              <div className="overflow-hidden rounded-[1.25rem]">
                <Image
                  src={site.images.groupCampus}
                  alt="Campus graduates"
                  width={600}
                  height={400}
                  className="h-40 w-full object-cover object-[center_45%]"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button nativeButton={false} render={<Link href="/enquire" />} className="h-11 rounded-full px-5">
                Work with Global Gate
              </Button>
              <Button
                nativeButton={false}
                render={<Link href={site.contact.facebook} target="_blank" rel="noreferrer" />}
                variant="outline"
                className="h-11 rounded-full px-5"
              >
                Facebook page
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Let’s build your pathway." />
    </>
  );
}
