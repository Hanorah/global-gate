"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

type CardOption = { value: string; label: string };

type CardStep = {
  kind: "card";
  field: string;
  question: string;
  options: CardOption[];
};

type TextStep = {
  kind: "text";
  field: string;
  question: string;
  placeholder?: string;
};

type Step = CardStep | TextStep;

const steps: Step[] = [
  {
    kind: "card",
    field: "country",
    question: "Which country are you applying from?",
    options: [
      { value: "Sierra Leone", label: "Sierra Leone" },
      { value: "Nigeria", label: "Nigeria" },
      { value: "Ghana", label: "Ghana" },
      { value: "Liberia", label: "Liberia" },
      { value: "Gambia", label: "Gambia" },
      { value: "Kenya", label: "Kenya" },
      { value: "Cameroon", label: "Cameroon" },
      { value: "Other African country", label: "Other African country" },
      { value: "Outside Africa", label: "Outside Africa" },
    ],
  },
  {
    kind: "card",
    field: "stage",
    question: "What stage are you at right now?",
    options: [
      { value: "Finished secondary school", label: "Finished secondary school" },
      { value: "Finished a bachelor's", label: "Finished a bachelor's" },
      { value: "Applying for a PhD", label: "Applying for a PhD" },
      { value: "Already in Europe / transferring", label: "Already in Europe / transferring" },
    ],
  },
  {
    kind: "card",
    field: "studyLevel",
    question: "What level are you applying for?",
    options: [
      { value: "Bachelor", label: "Bachelor" },
      { value: "Master", label: "Master" },
      { value: "PhD", label: "PhD" },
      { value: "Other / transfer", label: "Other / transfer" },
    ],
  },
  {
    kind: "text",
    field: "fieldOfStudy",
    question: "What field do you want to study?",
    placeholder: "e.g. Computer Science, Medicine, Business...",
  },
  {
    kind: "card",
    field: "timeline",
    question: "How soon are you hoping to start?",
    options: [
      { value: "As soon as possible", label: "As soon as possible" },
      { value: "Next intake", label: "Next intake" },
      { value: "6–12 months", label: "6–12 months" },
      { value: "Just exploring", label: "Just exploring" },
    ],
  },
  {
    kind: "card",
    field: "heardAbout",
    question: "How did you hear about us?",
    options: [
      { value: "Referral from a student", label: "Referral from a student" },
      { value: "Facebook", label: "Facebook" },
      { value: "WhatsApp", label: "WhatsApp" },
      { value: "Google search", label: "Google search" },
      { value: "Other", label: "Other" },
    ],
  },
];

const cardSteps = steps.filter((s): s is CardStep => s.kind === "card");
const textSteps = steps.filter((s): s is TextStep => s.kind === "text");
const TOTAL_STEPS = steps.length + 1; // +1 for the review/contact step

type Answers = Record<string, string>;

export function EnquiryForm() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isReviewStep = stepIndex === steps.length;
  const currentStep = isReviewStep ? null : steps[stepIndex];

  useEffect(() => {
    return () => {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        stepRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    },
    { dependencies: [stepIndex], scope: stepRef },
  );

  function setField(field: string, value: string) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, steps.length));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function selectCard(field: string, value: string) {
    setField(field, value);
    if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    advanceTimeout.current = setTimeout(goNext, 180);
  }

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
    <div>
      <p className="mb-6 text-xs font-medium tracking-wide text-muted-foreground">
        No obligation &middot; Reply {site.responseSla} &middot; Takes under 2 minutes
      </p>

      <div className="mb-8">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-300 ease-out"
            style={{ width: `${((stepIndex + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <p
          className="mt-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          aria-live="polite"
        >
          Step {stepIndex + 1} of {TOTAL_STEPS}
        </p>
      </div>

      <form onSubmit={isReviewStep ? onSubmit : (e) => e.preventDefault()}>
        <div ref={stepRef} className="min-h-[22rem]">
          {currentStep && currentStep.kind === "card" ? (
            <CardQuestion
              step={currentStep}
              value={answers[currentStep.field]}
              onSelect={(value) => selectCard(currentStep.field, value)}
            />
          ) : null}

          {currentStep && currentStep.kind === "text" ? (
            <TextQuestion
              step={currentStep}
              value={answers[currentStep.field] ?? ""}
              onChange={(value) => setField(currentStep.field, value)}
              onContinue={goNext}
            />
          ) : null}

          {isReviewStep ? <ReviewStep answers={answers} onFieldChange={setField} /> : null}
        </div>

        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          aria-hidden="true"
        />

        {error ? (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            className={cn("h-11 rounded-full px-4", stepIndex === 0 && "invisible")}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          {isReviewStep ? (
            <Button type="submit" disabled={submitting} className="h-11 rounded-full px-6">
              {submitting ? "Sending..." : "Submit enquiry"}
            </Button>
          ) : currentStep?.kind === "text" ? (
            <Button
              type="button"
              onClick={goNext}
              disabled={!answers[currentStep.field]?.trim()}
              className="h-11 rounded-full px-6"
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <span aria-hidden="true" />
          )}
        </div>
      </form>

      {isReviewStep ? (
        <p className="mt-4 text-sm text-muted-foreground">
          You can also reach us on{" "}
          <a
            className="font-medium text-foreground underline"
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}

function CardQuestion({
  step,
  value,
  onSelect,
}: {
  step: CardStep;
  value?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="font-display text-2xl leading-tight md:text-3xl">{step.question}</legend>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {step.options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-16 cursor-pointer items-center justify-center rounded-2xl border px-4 py-4 text-center text-sm font-medium transition-colors",
                checked
                  ? "border-gold bg-gold/10 text-foreground"
                  : "border-border bg-white hover:border-gold/50",
              )}
            >
              <input
                type="radio"
                name={step.field}
                value={option.value}
                checked={checked}
                onChange={() => onSelect(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function TextQuestion({
  step,
  value,
  onChange,
  onContinue,
}: {
  step: TextStep;
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <Label htmlFor={step.field} className="font-display text-2xl leading-tight md:text-3xl">
        {step.question}
      </Label>
      <Input
        id={step.field}
        name={step.field}
        value={value}
        placeholder={step.placeholder}
        autoFocus
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) {
            e.preventDefault();
            onContinue();
          }
        }}
        className="mt-6 h-14 rounded-xl text-lg"
      />
    </div>
  );
}

function ReviewStep({
  answers,
  onFieldChange,
}: {
  answers: Answers;
  onFieldChange: (field: string, value: string) => void;
}) {
  return (
    <div>
      <p className="eyebrow">Almost done</p>
      <h2 className="mt-2 font-display text-2xl leading-tight md:text-3xl">
        Review &amp; your details
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Check your answers below, change anything that isn&apos;t right, then add your contact details.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cardSteps.map((step) => (
          <div key={step.field} className="space-y-1.5">
            <Label htmlFor={step.field}>{step.question}</Label>
            <select
              id={step.field}
              name={step.field}
              required
              value={answers[step.field] ?? ""}
              onChange={(e) => onFieldChange(step.field, e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
            >
              <option value="" disabled>
                Select
              </option>
              {step.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        {textSteps.map((step) => (
          <div key={step.field} className="space-y-1.5">
            <Label htmlFor={step.field}>{step.question}</Label>
            <Input
              id={step.field}
              name={step.field}
              required
              value={answers[step.field] ?? ""}
              onChange={(e) => onFieldChange(step.field, e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Your name</Label>
          <Input id="fullName" name="fullName" required autoComplete="name" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">WhatsApp or phone number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+232..."
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="message">Anything else we should know? (optional)</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us briefly about your goals..."
            className="min-h-24 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
