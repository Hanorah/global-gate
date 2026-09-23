import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { pageHeroes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Global Gate Students Network collects, stores, and protects applicant information.",
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

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        body="How we collect, use, store, and protect your information when you work with Global Gate Students Network."
        image={pageHeroes.privacy.image}
        objectPosition={pageHeroes.privacy.objectPosition}
      />
      <section className="section-pad">
        <div className="container-page max-w-2xl space-y-8 text-muted-foreground">
          <p className="text-sm">Last updated: {LAST_UPDATED}</p>

          <p>
            This policy explains how {site.name} (“Global Gate”, “we”, “us”) collects and handles
            information when you enquire about or use our services. Global Gate is not yet
            registered as a separate company. Services are currently provided directly by{" "}
            {site.founder.name}, trading as {site.name}, based in Hungary.
          </p>

          <Section title="Information we collect">
            <p>When you submit our enquiry form, we collect:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Your full name, email address, and WhatsApp or phone number</li>
              <li>Your country of residence, current study stage, and study level</li>
              <li>Your field of study and how soon you hope to start</li>
              <li>How you heard about us, and any message you choose to add</li>
            </ul>
            <p>
              After we make contact with you, we may collect further information to support your
              case, including your date of birth, gender, nationality, highest qualification
              completed, grade or GPA, and application documents you choose to share with us (for
              example your passport, certificates, transcripts, or similar).
            </p>
            <p>
              We also keep a record of the messages you send us by WhatsApp, email, or phone in
              connection with your enquiry.
            </p>
          </Section>

          <Section title="How we use your information">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>To respond to your enquiry and assess how we can help</li>
              <li>
                To prepare and support university, Stipendium Hungaricum, visa, and related
                applications you ask us to help with
              </li>
              <li>To keep you updated on the progress of your case</li>
              <li>To meet legal or regulatory obligations where they apply to us</li>
            </ul>
          </Section>

          <Section title="Where your information is stored">
            <p>
              Enquiry details and case records are currently stored and managed using Google
              Workspace tools, specifically Google Sheets for case tracking and Google Drive for
              document storage, with access limited to our team. As our systems grow, this may
              move to dedicated case-management software, and this page will be updated to reflect
              that.
            </p>
            <p>
              We use Resend, an email delivery service, to send you enquiry confirmations and
              related messages. Your name and email address are shared with Resend only for this
              purpose.
            </p>
            <p>
              These providers may process your data on servers outside your country as part of
              providing their services to us. Their own privacy and security practices apply to how
              they handle data on our behalf.
            </p>
          </Section>

          <Section title="Who can see your information">
            <p>
              Only {site.founder.name} and any team member directly involved in supporting your
              case can see your information. We do not sell, rent, or trade your personal
              information to third parties for marketing purposes.
            </p>
            <p>
              We may share the specific details necessary to progress your case with universities,
              Stipendium Hungaricum, or Hungarian authorities, but only where you have asked us to
              submit an application or carry out a process on your behalf.
            </p>
          </Section>

          <Section title="How long we keep your information">
            <p>
              Applicant documents and case information are retained for up to 12 months after your
              case is closed, or deleted sooner at your request.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You can ask us to access, correct, or delete your information, or ask us any question
              about how it is used, at any time by emailing {site.contact.email}. We aim to respond
              within a reasonable time, normally within 30 days.
            </p>
          </Section>

          <Section title="Cookies and analytics">
            <p>
              This website does not use tracking or advertising cookies, and we do not run
              third-party analytics on the pages you use as an applicant. Our staff login system
              uses strictly necessary session cookies solely to keep our team securely signed in to
              internal case-management tools — these are not used to track you and are not shared
              for advertising.
            </p>
          </Section>

          <Section title="If you are under 18">
            <p>
              Some applicants finishing secondary school may be under 18. If you are under 18,
              please make sure a parent or guardian is aware of your enquiry, as we may ask for
              their contact details as part of supporting your case.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this page as our services and tools change. Material changes will be
              reflected here with an updated date at the top of this page.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              For any privacy question or request, contact us at{" "}
              <a className="font-medium text-foreground underline" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
              {" "}or at {site.contact.address}.
            </p>
          </Section>
        </div>
      </section>
    </>
  );
}
