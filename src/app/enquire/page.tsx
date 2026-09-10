import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pageHeroes, site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enquire",
  description: "Start your Global Gate Students Network enquiry. We typically reply within 24 hours.",
};

export default function EnquirePage() {
  return (
    <>
      <PageHero
        eyebrow="Enquire"
        title="Tell us about your study goals."
        body={`All fields are required so we can review your case properly. We typically reply ${site.responseSla}. Your answers are saved securely for our team to follow up.`}
        image={pageHeroes.enquire.image}
        objectPosition={pageHeroes.enquire.objectPosition}
      />

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
                  You will see a confirmation page. Our team reviews your details in Google Sheets
                  and follows up — usually {site.responseSla}.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
