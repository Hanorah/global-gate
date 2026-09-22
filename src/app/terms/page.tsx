import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { pageHeroes, services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using Global Gate Students Network services and website.",
};

const LAST_UPDATED = "22 September 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-2">
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        body="Please read carefully. These terms apply to every service booked through Global Gate Students Network."
        image={pageHeroes.terms.image}
        objectPosition={pageHeroes.terms.objectPosition}
      />
      <section className="section-pad">
        <div className="container-page max-w-2xl space-y-8 text-muted-foreground">
          <p className="text-sm">Last updated: {LAST_UPDATED}</p>

          <p>
            By submitting an enquiry or engaging our services, you agree to these terms. {site.name}
            (“Global Gate”, “we”, “us”) is not yet registered as a separate company. Services are
            currently provided directly by {site.founder.name}, trading as {site.name}, based in
            Hungary.
          </p>

          <Section title="Services we provide">
            <p>{site.name} provides guidance and support services for students exploring study pathways in Hungary, including:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              {services.map((s) => (
                <li key={s.title}>{s.title}</li>
              ))}
            </ul>
            <p>Full details for each service are published on the Services page.</p>
          </Section>

          <Section title="Your responsibilities">
            <p>
              You agree to give us accurate, complete, and truthful information, and genuine
              documents. You agree to respond to our requests and attend required appointments
              (such as university, scholarship, or visa appointments) in reasonable time. Providing
              false or incomplete information, or missing required appointments, may affect your
              eligibility for our support and for any refund described below.
            </p>
          </Section>

          <Section title="Fees and refunds">
            <p>
              Fees for each package are published on the Fees page. Application fees (${site.pricing.application.price})
              are not refundable, regardless of outcome.
            </p>
            <p>
              If your visa is refused after you followed the supported process fully and in good
              faith, a 50% refund applies to the {site.pricing.fullGuide.label.toLowerCase()} package.
              If a visa refusal results from your own actions or omissions (for example, missing
              appointments or providing false or incomplete information), no refund applies.
            </p>
          </Section>

          <Section title="No guarantee of outcome">
            <p>
              We provide process support, document guidance, and preparation assistance. We do not
              guarantee admission, a scholarship award, or a visa. Final decisions are made solely
              by universities, scholarship bodies (including Stipendium Hungaricum), and Hungarian
              immigration authorities, not by Global Gate.
            </p>
          </Section>

          <Section title="How we handle your information">
            <p>
              We use Google Workspace tools, specifically Google Sheets and Google Drive, to track
              your case and store documents you share with us. Full detail is available on our{" "}
              <a className="font-medium text-foreground underline" href="/privacy">
                Privacy Policy
              </a>
              .
            </p>
          </Section>

          <Section title="Intellectual property">
            <p>
              The text, branding, and design of this website belong to {site.name} unless otherwise
              stated, and may not be copied or reused without our permission.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              We provide guidance and support in good faith and to a reasonable standard of care.
              We are not liable for decisions made by universities, scholarship bodies, or
              immigration authorities, or for losses arising from information or documents you
              provide that later turn out to be inaccurate or incomplete.
            </p>
          </Section>

          <Section title="Governing law">
            <p>These terms are governed by the laws of Hungary, where Global Gate operates.</p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              We may update these terms as our services change. Material changes will be reflected
              here with an updated date at the top of this page.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              For questions about these terms, contact us at{" "}
              <a className="font-medium text-foreground underline" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
              .
            </p>
          </Section>
        </div>
      </section>
    </>
  );
}
