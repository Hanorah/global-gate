import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your enquiry was received by Global Gate Students Network.",
};

export default function ThankYouPage() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="absolute inset-0">
        <Image
          src={site.images.groupCampus}
          alt=""
          fill
          className="object-cover object-[center_45%] opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/90" />
      </div>
      <div className="container-page relative max-w-2xl text-center">
        <p className="eyebrow">Enquiry received</p>
        <h1 className="mt-4 font-display text-4xl md:text-6xl">
          Thank you for contacting Global Gate.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Our team will review your details and get back to you shortly — usually {site.responseSla}.
          If you need anything sooner, message us on WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button nativeButton={false} render={<Link href="/" />} className="h-11 rounded-full px-5">
            Back to home
          </Button>
          <Button
            nativeButton={false}
            render={<Link href={whatsappUrl("Hi Global Gate, I just submitted an enquiry and would like to follow up.")} target="_blank" rel="noreferrer" />}
            variant="outline"
            className="h-11 rounded-full px-5"
          >
            WhatsApp us
          </Button>
        </div>
      </div>
    </section>
  );
}
