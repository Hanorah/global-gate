import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enquire",
  description: "Start your Global Gate Students Network enquiry. We typically reply within 24 hours.",
};

export default function EnquirePage() {
  return (
    <>
      {/*
        Compact header instead of the usual full-photo PageHero — the wizard
        below is designed to feel like "the whole screen" on mobile, and a
        tall hero image would push it below the fold and undercut the
        "takes under 2 minutes" promise. See docs/PLAN.md Section 2b.
      */}
      <section className="bg-burgundy pt-24 pb-10 text-white md:pt-28 md:pb-12">
        <div className="container-page">
          <p className="eyebrow !text-gold-soft">Enquire</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">
            Tell us about your study goals.
          </h1>
          <p className="mt-4 max-w-xl text-white/80">
            A few quick taps, then your contact details. We typically reply {site.responseSla}.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-[2rem] border-border/70 bg-white/95 shadow-none">
            <CardContent className="p-6 md:p-10">
              <EnquiryForm />
            </CardContent>
          </Card>

          <aside className="space-y-5">
            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src={site.images.duoDiploma}
                alt="Graduates with diploma"
                width={800}
                height={900}
                quality={90}
                className="h-64 w-full object-cover object-[center_40%] md:h-80"
              />
            </div>
            <Card className="rounded-[2rem] border-0 bg-burgundy text-white shadow-none">
              <CardContent className="p-8">
                <p className="text-sm text-white/60">Prefer to talk now?</p>
                <ul className="mt-5 space-y-3 text-sm">
                  <li>
                    <a className="hover:underline" href={`mailto:${site.contact.email}`}>
                      {site.contact.email}
                    </a>
                  </li>
                  <li>
                    <a className="hover:underline" href={`tel:${site.contact.phone}`}>
                      {site.contact.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a className="hover:underline" href={whatsappUrl()} target="_blank" rel="noreferrer">
                      WhatsApp chat
                    </a>
                  </li>
                  <li className="text-white/70">{site.contact.address}</li>
                </ul>
                <Button
                  nativeButton={false}
                  render={<Link href={whatsappUrl()} target="_blank" rel="noreferrer" />}
                  className="mt-8 h-11 rounded-full bg-white text-foreground hover:bg-white/90"
                >
                  Message on WhatsApp
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-0 bg-surface shadow-none">
              <CardContent className="p-8">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  After you submit
                </p>
                <p className="mt-3 text-muted-foreground">
                  You will see a confirmation page. Our team reviews your details and follows up,
                  usually {site.responseSla}.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
