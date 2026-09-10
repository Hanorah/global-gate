import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { pageHeroes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using Global Gate Students Network services and website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        body="Draft for review. Outcome and refund wording must be approved before public launch."
        image={pageHeroes.terms.image}
        objectPosition={pageHeroes.terms.objectPosition}
      />
      <section className="section-pad">
        <div className="container-page max-w-2xl space-y-5 text-muted-foreground">
          <p>
            {site.name} provides guidance and support services for students exploring study pathways
            in Hungary. Fees for packages are published on the Fees page.
          </p>
          <p>
            Application fees are not refundable. Where a visa is refused after the supported process,
            a partial refund may apply as described on the Fees page and confirmed in writing before
            payment.
          </p>
          <p>
            We provide process support and preparation assistance. Admission decisions, scholarship
            awards, and visa outcomes are made by universities, scholarship bodies, and immigration
            authorities — not by Global Gate. Final public wording on this point will follow Tommy’s
            approved alternative to a flat “no guarantee” statement.
          </p>
          <p>For questions about these terms, contact {site.contact.email}.</p>
        </div>
      </section>
    </>
  );
}
