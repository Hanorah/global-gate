import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Production site URL — set NEXT_PUBLIC_SITE_URL in env when you have a domain */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://globalgatestudents.com";

export const defaultOgImage = `${siteUrl}/images/logo.png`;

export const siteKeywords = [
  "study in Hungary",
  "Hungary university admission",
  "Stipendium Hungaricum guidance",
  "study abroad Africa",
  "Hungarian student visa",
  "Global Gate Students Network",
  "Tommy Kaiza Koker",
  "international student consultancy Hungary",
  "Sierra Leone study abroad",
  "Nigeria study in Hungary",
  "Ghana study in Hungary",
  "student accommodation Hungary",
];

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
};

export function createPageMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
  keywords = siteKeywords,
  noIndex = false,
  type = "website",
}: PageSeoInput): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  const absoluteImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${site.shortName}`,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: `${site.name} — ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.shortName}`,
      description,
      images: [absoluteImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.name,
    alternateName: ["GGSN", site.shortName],
    description: site.description,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: `${siteUrl}/images/logo.png`,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
      addressCountry: "HU",
    },
    founder: {
      "@type": "Person",
      name: site.founder.name,
      jobTitle: site.founder.role,
    },
    sameAs: [site.contact.facebook, `https://wa.me/${site.contact.whatsappNumber}`],
    areaServed: ["Africa", "Europe", "Worldwide"],
    knowsAbout: [
      "Study in Hungary",
      "University admissions",
      "Student visa support",
      "Stipendium Hungaricum guidance",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: siteUrl,
    description: site.description,
    publisher: {
      "@type": "Organization",
      name: site.name,
    },
    potentialAction: {
      "@type": "CommunicateAction",
      name: "Enquire",
      target: `${siteUrl}/enquire`,
    },
  };
}

export function faqJsonLd(
  items: readonly { q: string; a: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Study in Hungary admissions support",
    provider: {
      "@type": "Organization",
      name: site.name,
    },
    description: site.description,
    areaServed: "Worldwide",
    offers: [
      {
        "@type": "Offer",
        name: site.pricing.application.label,
        price: String(site.pricing.application.price),
        priceCurrency: site.pricing.application.currency,
      },
      {
        "@type": "Offer",
        name: site.pricing.fullGuide.label,
        price: String(site.pricing.fullGuide.price),
        priceCurrency: site.pricing.fullGuide.currency,
      },
    ],
  };
}
