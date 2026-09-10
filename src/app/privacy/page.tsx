import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { pageHeroes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Global Gate Students Network handles applicant information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        body="Draft for review. Trading name and final legal wording to be confirmed with Tommy before launch."
        image={pageHeroes.privacy.image}
        objectPosition={pageHeroes.privacy.objectPosition}
      />
      <section className="section-pad">
        <div className="container-page max-w-2xl space-y-5 text-muted-foreground">
          <p>
            When you submit an enquiry, we collect the information you provide (such as name, contact
            details, education background, and your message) so we can respond and support your
            application journey.
          </p>
          <p>
            Enquiry data is received by our team at {site.contact.email}. We do not sell your
            personal information.
          </p>
          <p>
            Applicant documents shared with us are kept until you ask for deletion. You may request
            access, correction, or deletion by emailing {site.contact.email}.
          </p>
          <p>
            This page will be updated once the legal / trading name is confirmed and any email
            delivery provider is connected.
          </p>
        </div>
      </section>
    </>
  );
}
