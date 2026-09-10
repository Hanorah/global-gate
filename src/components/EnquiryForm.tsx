"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site, whatsappUrl } from "@/lib/site";

const studyLevels = ["Bachelor", "Master", "PhD", "Other / transfer"];
const genders = ["Female", "Male", "Prefer not to say", "Other"];
const heardAbout = [
  "Referral from a student",
  "Facebook",
  "WhatsApp",
  "Google search",
  "Other",
];

export function EnquiryForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Could not send enquiry");
      router.push("/thank-you");
    } catch {
      setError(
        `Something went wrong. Please email ${site.contact.email} or message us on WhatsApp.`,
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
      <Field label="Full name" htmlFor="fullName">
        <Input id="fullName" name="fullName" required autoComplete="name" className="h-11 rounded-xl" />
      </Field>
      <Field label="Email address" htmlFor="email">
        <Input id="email" name="email" type="email" required autoComplete="email" className="h-11 rounded-xl" />
      </Field>
      <Field label="Phone or WhatsApp (with country code)" htmlFor="phone">
        <Input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+232..." className="h-11 rounded-xl" />
      </Field>
      <Field label="Country of residence" htmlFor="country">
        <Input id="country" name="country" required className="h-11 rounded-xl" />
      </Field>
      <Field label="Nationality" htmlFor="nationality">
        <Input id="nationality" name="nationality" required className="h-11 rounded-xl" />
      </Field>
      <Field label="Date of birth" htmlFor="dob">
        <Input id="dob" name="dob" type="date" required className="h-11 rounded-xl" />
      </Field>
      <Field label="Gender" htmlFor="gender">
        <select id="gender" name="gender" required defaultValue="" className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm">
          <option value="" disabled>Select</option>
          {genders.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </Field>
      <Field label="Highest qualification completed" htmlFor="qualification">
        <Input id="qualification" name="qualification" required className="h-11 rounded-xl" />
      </Field>
      <Field label="Grade or GPA" htmlFor="gpa">
        <Input id="gpa" name="gpa" required className="h-11 rounded-xl" />
      </Field>
      <Field label="Field of study wanted" htmlFor="fieldOfStudy">
        <Input id="fieldOfStudy" name="fieldOfStudy" required className="h-11 rounded-xl" />
      </Field>
      <Field label="Study level wanted" htmlFor="studyLevel">
        <select id="studyLevel" name="studyLevel" required defaultValue="" className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm">
          <option value="" disabled>Select</option>
          {studyLevels.map((level) => <option key={level} value={level}>{level}</option>)}
        </select>
      </Field>
      <Field label="How did you hear about us?" htmlFor="heardAbout">
        <select id="heardAbout" name="heardAbout" required defaultValue="" className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm">
          <option value="" disabled>Select</option>
          {heardAbout.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </Field>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required placeholder="Tell us briefly about your goals..." className="min-h-32 rounded-xl" />
      </div>

      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden="true" />

      {error ? (
        <p className="md:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      <div className="md:col-span-2">
        <Button type="submit" disabled={submitting} className="h-11 rounded-full px-6">
          {submitting ? "Sending..." : "Submit enquiry"}
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">
          We typically reply {site.responseSla}. You can also reach us on{" "}
          <a className="font-medium text-foreground underline" href={whatsappUrl()} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          .
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
