import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pageHeroes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fees & refunds",
  description: "Transparent pricing for Global Gate Students Network application and full guidance packages.",
};

export default function FeesPage() {
  return (
    <>
      <PageHero
        eyebrow="Fees"
        title="Transparent pricing, stated upfront."
        body="Know what you are paying for before you begin. Exact package prices are listed below."
        image={pageHeroes.fees.image}
        objectPosition={pageHeroes.fees.objectPosition}
        primaryHref="/enquire"
        primaryLabel="Enquire about packages"
      />

      <section className="section-pad">
        <div className="container-page grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5">
            <Reveal>
              <Card className="overflow-hidden rounded-[2rem] border-0 bg-burgundy text-white shadow-none">
                <CardContent className="flex min-h-[280px] flex-col justify-between p-8 md:p-10">
                  <div>
                    <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">Starter</Badge>
                    <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                      {site.pricing.application.label}
                    </h2>
                    <p className="mt-3 text-white/70">
                      Support focused on preparing and submitting your admission application materials.
                    </p>
                  </div>
                  <p className="font-display text-5xl">
                    ${site.pricing.application.price}
                    <span className="ml-2 text-lg text-white/50">USD</span>
                  </p>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.08}>
              <Card className="overflow-hidden rounded-[2rem] border-0 bg-blush shadow-none">
                <CardContent className="flex min-h-[280px] flex-col justify-between p-8 md:p-10">
                  <div>
                    <Badge className="rounded-full bg-white text-foreground hover:bg-white">Most chosen</Badge>
                    <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                      {site.pricing.fullGuide.label}
                    </h2>
                    <p className="mt-3 text-ink-soft">{site.pricing.fullGuide.includes}</p>
                  </div>
                  <p className="font-display text-5xl">
                    ${site.pricing.fullGuide.price}
                    <span className="ml-2 text-lg text-ink-soft">USD</span>
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src={site.images.duoPoint}
                alt="Happy graduates pointing at camera"
                width={900}
                height={1200}
                className="h-full min-h-[420px] w-full object-cover object-[center_42%]"
              />
            </div>
          </Reveal>
        </div>

        <Reveal className="container-page mt-12 max-w-3xl">
          <h3 className="font-display text-3xl">Refund summary</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Application fees (${site.pricing.application.price}) are not refundable, regardless of outcome.</li>
            <li>
              If your visa is refused after you followed the supported process fully and in good
              faith, a 50% refund applies to the {site.pricing.fullGuide.label.toLowerCase()} package.
            </li>
            <li>
              If a visa refusal results from your own actions or omissions (for example, missing
              appointments or providing false or incomplete information), no refund applies.
            </li>
          </ul>
          <Button nativeButton={false} render={<Link href="/terms" />} variant="link" className="mt-4 px-0">
            Read full terms
          </Button>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
