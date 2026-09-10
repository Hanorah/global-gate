import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { JsonLd } from "@/components/JsonLd";
import { createPageMetadata, serviceJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Study in Hungary Admissions Support",
  description: `${site.description} Transparent fees from $${site.pricing.application.price}. Reply within 24 hours.`,
  path: "/",
  image: site.images.hero,
  keywords: [
    "study in Hungary",
    "Hungary admissions consultancy",
    "Stipendium Hungaricum help",
    "African students Hungary",
    "student visa Hungary support",
    "Global Gate Students Network",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={serviceJsonLd()} />
      <HomePageClient />
    </>
  );
}
