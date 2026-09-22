# Global Gate Students Network — Site Refresh & Lead-CRM Automation Plan

**Branch:** `feature/crm-automation-and-site-refresh` (created off `main`; `main` is untouched)
**Status:** Section 7's open questions are answered (see below) — build has started. Sections
still marked "proposed" below (Sheets/Drive automation, admin dashboard, spam filter, emails) are
built in the phase order in the roadmap at the bottom.

---

## 0. How to read this document

You asked for a lot in one message, so I split it into seven parts:

1. Benchmark — website vs. your Google Form answers
2. UX / mobile / SEO audit
3. Photography strategy
4. Lead lifecycle & CRM design (the "make Sheets into a CRM" part)
5. Automation architecture (spam filter, emails, Drive folders)
6. Tech choices for the build
7. Open questions I need from you + a phased build roadmap

Each part ends with a **Decisions needed** box where relevant. Nothing gets built until you say go.

---

## 1. Benchmark: what the site already reflects from your form vs. gaps

Good news first: the site was clearly already built from a version of this questionnaire — most
of your answers are already live in `src/lib/site.ts` and rendered across the pages. Here's the
honest gap list.

| Topic | Your answer | Site today | Gap / action |
|---|---|---|---|
| Business name | Global Gate Students Network | ✅ Correct everywhere | — |
| Registration | Not yet registered | Not stated on site | Fine to leave unstated; do **not** imply registration in copy or schema until it's formal |
| Contact email | globalgatestudynetwork@gmail.com (note: form has two slightly different spellings across answers — `globalgatestudynetwork` vs `globalgatesstudynetwork`) | Site uses `globalgatestudynetwork@gmail.com` | **Confirm the exact spelling** — a typo'd mailbox silently loses leads |
| Phone / WhatsApp | +36 20 520 1974 | ✅ Correct | — |
| Address | Peter Karoly utca 1, Hungary | ✅ Present | Consider adding a district/postal code if you're comfortable publishing it — helps local SEO |
| Services (10 ticked) | Full list incl. Stipendium Hungaricum guidance, translation/attestation, visa/residence, accommodation, airport pickup, banking/registration, post-arrival mentoring | ✅ All 10 present in `services` array | — |
| Pricing | $200 application, $500 full guide (visa+arrival+accommodation) | ✅ Correct on Fees page | — |
| Refund policy | No refund on application fee; if visa is refused, 50% refund — **your wording here was ambiguous** ("the person being rejected visa is 10%") | Site says "a 50% refund may apply" and defers exact wording to Terms | **Needs your clarification** — see Decisions box below |
| Guarantee statement | You agreed the site must clearly say no admission/visa guarantee | FAQ says this clearly; Terms page currently hedges ("will follow Tommy's approved alternative to a flat statement") | Terms page is inconsistent with your own answer — tighten this before launch |
| Enquiry form fields | 13 fields, "I think all the ones I ticked must be [required]" | ✅ All 13 present and all required | Being redesigned into a mobile-first tap-card wizard that only collects 6 quick qualifying answers + contact details upfront, deferring DOB/GPA/gender/qualification to first contact — full spec in **Section 2b**. You also said "some applicants will struggle with Google Drive uploads, we need an email option too" — **no document upload exists on the site at all yet** (form is contact-info only, documents are requested manually later). Confirm this is intentional for now |
| Auto-reply to applicant | Yes, "thank you for showing interest... team will review... get back to you" | ❌ **Does not exist.** Current flow only writes a row to one Google Sheet — no email is sent to anyone, applicant or admin | This is the biggest functional gap — see Section 5 |
| Alert destination | "My email and a shared team inbox" | ❌ No email alert exists at all today | Same as above |
| Response SLA | Within 24 hours | ✅ Stated on Enquire and FAQ pages | — |
| Documents list | 12 items (passport, WAEC/NECO, transcripts, etc.) | ✅ Present on relevant pages | — |
| Document retention | "Until the applicant asks for deletion" | Not implemented anywhere (no documents are even collected yet) | Flagged in Section 5 — this retention policy is legally soft; recommend a defined max period |
| Testimonials | 4 named people, all Sierra Leonean/Ghanaian, based in USA/Dubai/Sierra Leone | ✅ All 4 present with quotes | Khadija Sankoh's photo is a **generic stock placeholder**, not her real photo — flagged in Section 3 |
| About page bio | Long paragraph you wrote | ✅ Present (condensed/edited version) | Fine as-is, optional: use more of your original wording verbatim if you prefer your voice over the edited version |
| Brand feel (3 words) | Professional, Trustworthy, Warm & friendly, Academic & serious, Bold & confident (you picked 5, form asked for ≤3) | Site reads as professional/warm/serious already | No action — just noting you over-selected on the form |
| Logo / colours | You have a logo, no set colours, "surprise me" | Site uses a burgundy/gold/blush palette not sourced from your logo file | **You should sanity-check** the burgundy/gold direction against your actual logo (Drive link you gave) before we lock it in for email templates too |
| Domain | Don't have one yet, form asked for 3 name options | Site metadata defaults to a placeholder `globalgatestudents.com` that nobody owns | **Blocking item** — SEO, email deliverability (SPF/DKIM), and the CRM's "reply-to" all need a real domain. See Decisions box |
| Legal/privacy name | Same as business name | Privacy/Terms pages use site name | — |
| Language | English only | ✅ | — |
| Hungarian universities placed into | You said you'd send a list | Not listed anywhere on site (Guide/Services pages don't name specific universities) | Send the list and I'll add a "Where our students go" section — this is good, concrete trust content |

### Decisions needed — Section 1
1. **Confirm the exact enquiry-alert email address** (single vs. double "s" spelling above).
2. **Clarify the refund rule in plain terms** — as best I can reconstruct from your voice-to-text
   answer: *no refund on the $200 application fee; if a visa is refused after you did everything
   right on your end, you refund 50% of the $500 package; if the applicant is at fault for the
   refusal, no refund.* Confirm or correct this — it becomes binding text on the Fees and Terms
   pages, so it needs to be exactly right.
3. **Domain name** — do you want me to check availability on the three options you were going to
   send, or should I propose options now based on "Global Gate Students Network"? A real domain
   is required before we can wire up production email sending (see Section 5).
4. Send the **Hungarian university list** and the **logo Drive link review** (I'll pull it and
   compare against the current burgundy/gold direction).

---

## 2. UX, mobile, and SEO audit

### What's already solid (no action needed)
- Next.js 16 App Router, per-page `Metadata`, canonical URLs, Open Graph + Twitter cards, and
  three JSON-LD schemas (`EducationalOrganization`, `WebSite`, `FAQPage`, `Service`) — this is
  genuinely above-average technical SEO for a small business site already.
- `robots.ts` and `sitemap.ts` are dynamic and correctly exclude `/thank-you` and `/api/`.
- Mobile nav (`Header.tsx`) is a well-built full-screen overlay menu with scroll-lock, focus
  handling via `tabIndex`, and `aria-expanded`/`aria-hidden` — better accessibility hygiene than
  most sites this size.
- Honeypot field already exists on the enquiry form (`company` field, hidden, bot-only).

### UX findings
| Priority | Finding | Recommendation |
|---|---|---|
| High — **decided** | The enquiry form asks for 13 fields including DOB, GPA, gender, and full study-history details **before** a visitor has had any conversation with you — that's a lot of friction for a cold visitor deciding whether to trust an unregistered agency | Replaced with a step-by-step tap-card wizard, full spec in **Section 2b** below |
| High | No way to attach documents from the form, but your own answer says applicants struggle with Google Drive uploads | Add an explicit "or just WhatsApp us your documents" fallback directly on the Enquire page, not just implied |
| Medium | Fee page shows refund terms as a bulleted "summary" that explicitly says "final refund conditions appear in the Terms once legal wording is approved" — a visitor reading this today sees an unfinished business | Don't publish "coming soon" legal language live; either finalize the wording (see Section 1 decision #2) or don't show the refund section until it's final |
| Medium | Testimonials mix real named people with what looks like a stock photo (Khadija) | Fix per Section 3 — using a real name next to a stock photo is a credibility risk if ever spotted |
| Low | No visible trust signals for an unregistered business (e.g., years operating, number of students placed, WhatsApp response badge) | Once you send real numbers, a simple stats strip ("X students guided since 2024") builds trust fast for a new brand |

### Mobile responsiveness findings
| Priority | Finding | Recommendation |
|---|---|---|
| High — **decided** | `EnquiryForm.tsx` uses native `<select>` styled with Tailwind on a 2-column grid that collapses to 1 column on mobile — with 13 fields + message box, the form is very long before a mobile user reaches Submit | Replaced by the mobile-first wizard in Section 2b |
| Low | Date input (`type="date"`) renders native pickers that vary a lot in usability across Android/iOS/older browsers | DOB is being deferred out of the initial form anyway (Section 2b) — collected later by admin, so this mostly goes away |
| Low | Hero images use fixed `objectPosition` percentages per breakpoint set manually in `site.ts` (e.g. `"center 42%"`) | This is actually a good pattern already — just needs to be re-tuned once new photography (Section 3) is in, since crops are tied to the current images' subject placement |
| Medium | Audit so far checked **responsiveness** (does it adapt down from desktop) rather than **mobile-first** (was it designed from the smallest screen up). Given the audience is largely applying from African countries on a mix of device tiers, a good share are realistically on mid/low-tier Android phones with smaller screens and slower connections, not the newest iPhones on fast wifi | Section 2b's wizard is being built mobile-first as the reference implementation; once proven there, apply the same discipline (design at 375px width first, then widen) to any other new/rebuilt component, rather than continuing to adapt desktop-first layouts down |

### SEO / indexing findings
| Priority | Finding | Recommendation |
|---|---|---|
| **Blocking** | `siteUrl` defaults to `https://globalgatestudents.com`, a domain that (per your form) you don't own yet. Every canonical URL, OG image URL, JSON-LD `url`, and the sitemap are currently generating URLs for a domain that may not resolve | Cannot properly submit to Google Search Console or get real indexing until `NEXT_PUBLIC_SITE_URL` points at a live, owned domain |
| High | `verification.google` in `layout.tsx` is commented out — site has never been verified in Google Search Console | Add the verification token once the domain is live; this is a 5-minute step but it's the actual switch that turns on indexing monitoring |
| Medium | Default OG image (`defaultOgImage`) is the logo file, not a photo — logo-only social cards typically get lower click-through than a photo with a text overlay | Covered by prompt #17 in the photography brief (Section 3) — a proper OG backdrop image |
| Medium | No `alt` text audit done yet across all `<Image>` usages | Quick pass needed once real photography replaces the mismatched stock — alt text should describe the actual new image, not the current placeholder captions like "Happy graduates pointing at camera" |
| Low | No structured data for individual service offerings beyond the two pricing tiers in `serviceJsonLd()` — the 10 listed services aren't individually marked up | Optional enhancement, not urgent for a site this size |
| Low | No `hreflang` needed (English-only, confirmed by your form) | No action |

## 2b. Enquiry form redesign — mobile-first, step-by-step wizard (confirmed)

**Where this came from:** you shared a reference video (an Instagram reel, @mattxwebb) of a
construction company's "get a fixed quote" form — one question per full screen, large tappable
icon cards instead of dropdowns/labels, a progress bar ("Step X of 5"), trust badges up top
("Fixed price guarantee · Takes under 2 minutes · No obligation"), and — the key idea — **contact
details are the last step, not the first**, with a recap of everything already picked shown above
the name/email/phone fields.

That's a genuinely better answer to the "13-field wall of inputs" problem than the plain two-step
form I originally proposed, so it replaces that idea rather than sitting alongside it. Below is
that pattern adapted to your actual data (Anvil's form is short because a quote only needs 5
facts; yours needs richer applicant data because you're doing visa/document work — so this isn't
a straight copy).

**One deliberate departure from the video:** the video's final screen shows the earlier answers as
static, read-only pill tags — fine for a quick glance, but if someone mis-tapped on step 2 their
only fix is restarting the whole wizard. Instead, step 7 renders every earlier answer as an
**actual, editable, pre-filled form field** — so the final screen is a real review-and-edit step,
not just a summary. Fix a wrong answer inline, no restart needed.

### Proposed 7-step wizard
| Step | Question | Input type | Source |
|---|---|---|---|
| 1 | Which country are you applying from? | Tap cards: Sierra Leone, Nigeria, Ghana, Liberia, Gambia, Kenya, Cameroon, Other African country, Outside Africa | Your form's applicant-country list |
| 2 | What stage are you at right now? | Tap cards: Finished secondary school, Finished a bachelor's, Applying for a PhD, Already in Europe / transferring | Your form's applicant-stage list |
| 3 | What level are you applying for? | Tap cards: Bachelor, Master, PhD, Other/transfer | Matches current `studyLevels` |
| 4 | What field do you want to study? | Short text input (too open-ended for cards) | Matches current `fieldOfStudy` |
| 5 | How soon are you hoping to start? | Tap cards: As soon as possible, Next intake, 6–12 months, Just exploring | New — closes a gap the current form doesn't ask at all, and it's useful CRM data (urgency) |
| 6 | How did you hear about us? | Tap cards: Referral from a student, Facebook, WhatsApp, Google search, Other | Matches current `heardAbout` |
| 7 | Review & your details | All six earlier answers rendered as **editable, pre-filled fields** (compact dropdown/segmented-control per step, not full card grids, to save space) so you can correct any of them inline, plus the new fields: Name, Email, WhatsApp/phone, optional short message | Matches current contact fields, plus editable steps 1–6 |

**Deferred out of the initial wizard, collected by the admin during/after first contact and
entered into the sheet or dashboard:** Date of birth, Gender, Nationality (distinct from country
of residence), Highest qualification completed, Grade/GPA. These don't tap-select well, and
forcing them into card format mid-wizard would break the momentum the whole pattern depends on —
they're also the fields you'd naturally ask about in a real conversation anyway, not on a cold
form. This directly updates the "New Lead" stage definition in Section 4.

Trust badges adapted from the video, shown above Step 1: **"No obligation · Reply within 24 hours
· Takes under 2 minutes."**

### Mobile-first build requirements (you asked me to weight this explicitly)
This is designed starting from the smallest realistic screen, not adapted down from desktop — a
meaningful share of your applicants are realistically on mid/low-tier Android phones on slower
connections, not the newest iPhones on wifi:
- Design and build at a 375×667 viewport first (iPhone SE-class, the realistic lower bound), then
  widen for larger screens — not the reverse.
- Each step fills the full viewport height (`100dvh`) on mobile so the entire screen is one
  question — no scrolling to find the next tap target.
- Minimum 44×44px tap targets with generous spacing between cards, to reduce mis-taps on smaller
  or lower-res Android screens.
- Progress bar pinned to the top and always visible — more important on mobile than desktop,
  since you can't glance at the whole form's length the way you can on a tall desktop scroll.
- Back control placed for thumb reach (bottom-left, matching the video), not just a small
  top-corner arrow.
- Auto-advance on tap for single-select cards — no separate "confirm/next" tap needed, roughly
  halves the number of taps versus tap-then-next.
- Icons as inline SVG (`lucide-react` is already a dependency) — no per-step raster images, to
  keep the payload light for slower mobile data.
- Step 7 is the longest screen now that it holds 6 editable review fields plus 4 new contact
  fields, so on mobile it's allowed to scroll (unlike steps 1–6) — everything stacks in one
  column (the current form's `md:grid-cols-2` already collapses correctly — keep that pattern),
  with the editable review fields visually grouped and separated from the new contact fields so
  the screen doesn't read as "one big undifferentiated form" again. Test with a real on-screen
  keyboard open, not just Chrome DevTools' mobile emulation, to confirm the keyboard never covers
  the submit button.
- Respect `prefers-reduced-motion` for step transitions — the codebase already guards animations
  this way globally in `globals.css`; extend the same guard to the wizard's transitions.
- Real-device check before calling this done: an actual low/mid-tier Android phone on a throttled
  connection, not only emulation.
- Accessibility: each step is a real fieldset/radiogroup (not `div onClick` soup), keyboard
  navigable, with an ARIA live region announcing "Step X of 7" changes for screen readers.

### Tech note
No new dependency needed — a step-index state machine in React plus GSAP for the transitions
(`@gsap/react` is already installed and already used for the `Reveal.tsx` pattern elsewhere on the
site), so this stays consistent with how the rest of the site animates instead of introducing a
second animation library.

### Decisions needed — Section 2b
- Confirm the 7-step order and which fields are deferred vs. asked upfront — this is my
  judgment call based on what taps well as a card vs. what genuinely needs a conversation; adjust
  freely.
- Confirm the "How soon are you hoping to start?" step — it's new (not on your original form) but
  I think it's useful qualifying data. Drop it if you'd rather not ask.

---

## 3. Photography strategy

**Where I looked:** I searched free stock libraries (Unsplash, Pexels, Pixabay, Freepik) for both
"African student" imagery and "Budapest / Hungary university" imagery. Both exist in large
quantities *separately*. The specific combination you actually need — a Sierra Leonean or West
African student genuinely pictured in a Hungarian/European campus setting — does not exist as
free stock. I confirmed this rather than guessing.

**What's live on the site right now is worse than "generic" — it's actively mismatched:**
- `hero-graduate.jpg` — a graduation photo with visible Arabic text and Gulf-style graduation
  regalia (looks Saudi/Gulf, not Sub-Saharan African or Hungarian).
- `group-campus.jpg` — used on the About and How-It-Works hero — is a Southeast Asian palace/temple
  building with an East Asian graduating class, not Hungary.
- `mother-daughter.jpg` — genuinely warm and well-shot, reads as Nigerian aso-ebi styling
  specifically, which is a fine "West African warmth" signal but isn't Sierra Leonean-neutral and
  isn't reused correctly (it's currently doubling as "Khadija's testimonial photo" for a real
  named person, which it isn't).

**Recommendation — two tracks, not one:**
1. **Real photos where the subject is a real named person** (Tommy, Daniel, Laurence, Sulaiman,
   Khadija — your founder and testimonial-givers). These must never be AI-generated or stock —
   ask each of them for one good-quality photo (you already have Tommy's). This is the cheapest
   and most authentic fix, and it directly resolves the Khadija placeholder gap from Section 1/2.
2. **AI-generated photography for everything else** (hero banners, page backdrops, generic "a
   student" imagery) — I've written a full prompt library for this at
   [`docs/photography/ai-image-prompts.txt`](./photography/ai-image-prompts.txt): 17 prompts
   covering every image slot currently in `site.ts`, tuned to your brand palette (burgundy/gold),
   the "students in Hungary" setting (Budapest architecture, Danube, autumn light), and West
   African/Sierra Leonean representation — with guidance on tools, aspect ratios, and a negative
   prompt to avoid the generic-AI or stereotyped look.

### Decisions needed — Section 3
- Can you get real photos from Daniel, Laurence, Sulaiman, and especially Khadija (whose photo is
  currently wrong)? If not, I'll note explicitly on which testimonials we're using a placeholder
  and why, rather than silently faking it.
- Once you're ready, I can run the prompt library through the AI image tools available in this
  environment (Adobe Firefly is already connected here) and drop finished images straight into
  `public/images/` — say the word and I'll generate a first batch for your review.

---

## 4. Lead lifecycle & CRM design

Your instinct (three-stage pipeline) is right. Here's how I'd formalize the *stages* based on your
form answers and the services you actually offer — this is the part that was vague in your
message and needs the most structure:

### Proposed stages
1. **New Lead** — wizard submitted (country, stage, study level, field, timeline, heard-about,
   name/email/phone per Section 2b). Not yet reviewed, and **qualification data incomplete**
   (DOB/gender/nationality/qualification/GPA not yet collected) until admin fills it in after
   first contact. Sits here until the sanity/spam check clears it.
2. **Flagged for Review** — failed one or more spam/quality checks; needs a human decision before
   it's treated as real (Section 5).
3. **Contacted** — admin has reached out, meeting not yet held.
4. **Meeting Held — Pending Decision** — the meeting from your original message happened, admin
   hasn't approved/rejected yet.
5. **Verified Customer** *(moves to Sheet 2)* — approved after the meeting, has paid or committed
   to a package.
6. **Documents In Progress** — collecting/reviewing the 12-item document checklist.
7. **Application Submitted** — university/Stipendium Hungaricum application submitted.
8. **Visa Stage** — visa/residence permit process underway.
9. **Arrival & Settling In** — airport pickup, banking, registration, post-arrival mentoring.
10. **Completed / Alumni** — fully settled; a future testimonial candidate.
11. **Not Proceeding** — rejected at review, or dropped out — kept for records, not deleted, with a
    reason field (your own retention answer said "until they ask for deletion" — see the
    compliance note below).

### Sheet 1 — "Leads" (every form submission lands here first)
Columns collected **at submission** (from the Section 2b wizard): Timestamp, Full name, Email,
Phone/WhatsApp, Country of residence, Study stage, Study level, Field of study, Start timeline,
Heard about, Message, Spam score, Spam reason, Status (New / Flagged / Contacted / Meeting Held).

Columns filled in **later by the admin** during/after first contact: Nationality, DOB, Gender,
Highest qualification completed, GPA, plus **Qualification data complete** (Y/N — so the pipeline
view can show at a glance who still needs a follow-up before they can move to Verified), Admin
notes, Approved by, Approved at.

### Sheet 2 — "Verified Customers" (a row is *moved* here, not copied, on approval)
All Leads columns **plus**: Package purchased ($200 / $500), Payment status, Current stage
(dropdown matching stages 6–10 above), Document checklist (per-item Y/N or a link to their Drive
folder — see Section 5), Assigned Hungarian university (once known), Next action, Next action due
date, Last contact date.

### Sheet 3 — "Admin Dashboard": **my recommendation is to build this as a protected web page,
not a third spreadsheet.**

You asked directly for my opinion here, so — clearly: **build it as a protected route on the
website**, for these reasons:
- A raw third sheet becomes a manually-maintained summary that drifts out of sync with Sheets 1–2
  the moment someone edits a row directly instead of through a process.
- A protected dashboard can *read and write* Sheets 1 and 2 live via the Google Sheets API, so
  there's only ever one source of truth (the two real sheets), and the dashboard is just a nicer,
  safer window into them — pipeline view (kanban-style by stage), one-click "approve this lead"
  (which does the sheet-move + Drive-folder-creation + emails automatically instead of by hand),
  search, and a simple activity log.
- It's meaningfully more secure than a shared Google Sheet: you control exactly who gets in
  (single admin login, not a shared Google account link that can be forwarded), and applicants'
  personal data (DOB, passport-adjacent details, documents) sits behind real authentication
  instead of "anyone with the link."
- It's the only option that supports the spam-approval-by-email flow you asked for in Section 5
  cleanly (secure one-click approve/reject links that land on a protected page, not a public form).

The trade-off: it's more work to build than "just add a third sheet," and it's the one piece of
this whole request that's genuinely a small web app, not a script. I think it's worth it given you
used the words "production grade" and "solid" — but say so if you'd rather start with the simple
third-sheet version now and upgrade to a dashboard later; both are compatible with everything else
in this plan.

### Decisions needed — Section 4
- **Confirm the admin-dashboard-instead-of-third-sheet direction** (recommended), or tell me to
  build the simple third-sheet version first. — *Resolved: dashboard confirmed, Section 7.*
- Confirm the stage list above matches how you actually think about a case — add/remove/rename
  anything that doesn't match reality.

## 4.5. Hungarian universities — "Where our students go"

You asked me to list the most relevant ones rather than tracking down your original list. I
checked what I could verify rather than guessing: Stipendium Hungaricum's own materials confirm
30+ partner universities offering 800+ full-degree, English-taught programmes, and name **ELTE
(Eötvös Loránd University), BME (Budapest University of Technology and Economics), Corvinus
University of Budapest, University of Debrecen, University of Szeged,** and **University of
Pécs** as the most prominent. I'm adding **Semmelweis University** (Budapest's dedicated medical
university, very commonly chosen by international students) to the shortlist since it's
well-known and credible, but I have not independently verified it against Stipendium Hungaricum's
current partner list the way I did the other six.

**Important — this is a general "most prominent SH-partner universities" list, not a claim about
which ones you've personally placed students into.** Publishing it as "where our students go"
without your confirmation would overstate your track record. Treat this as a starting shortlist:
confirm which of these (plus any others) you've actually placed applicants into before it goes on
the site, and I'll adjust the section to reflect your real history rather than the generic list.

Proposed shortlist (pending your confirmation):
1. Eötvös Loránd University (ELTE) — Budapest
2. Budapest University of Technology and Economics (BME)
3. Corvinus University of Budapest
4. University of Debrecen
5. University of Szeged
6. University of Pécs
7. Semmelweis University — Budapest (unverified against your actual placements, flagged above)

---

## 5. Automation architecture

### 5a. Spam / low-quality filtering (sits in front of everything else)
Layered, cheapest-checks-first so we don't waste API calls on obvious bots:
1. **Honeypot** — already exists (`company` field), keep it.
2. **Rate limiting** — cap submissions per IP/time window (e.g. 5/hour) at the API route.
3. **Format validation** — real email regex, phone/WhatsApp format check (already loosely typed
   but not validated), reject obviously fake values ("test", "asdf", repeated characters).
4. **Disposable-email detection** — reject known throwaway email domains.
5. **Free-text quality check** — the `message` field run through a lightweight check (either a
   simple keyword/pattern heuristic, or a cheap LLM call) for spam/nonsense/promotional content
   vs. a genuine study-abroad enquiry. This is the "comprehensive sanity check" you asked for —
   it's the one layer that catches things regex can't (e.g. a coherent-looking but obviously
   copy-pasted crypto/SEO-spam message).
6. Anything that fails 1–2 → **silently dropped** (bots don't get a response, per current honeypot
   behavior). Anything that fails 3–5 on a borderline score → **Flagged for Review**, triggers the
   admin-approval email flow below instead of the normal lead flow.

### 5b. Flagged-lead flow (your "comprehensive sanity check... send an email to the admin for approval")
- Admin receives an email: lead's details + *why* it was flagged (spam score/reason) + two
  secure, single-use action links: **Approve** and **Reject**.
- Clicking Approve moves the row from Flagged → New Lead (rejoins the normal flow, including the
  applicant's welcome email — since it was probably just a false positive like an unusual name or
  phone format, not a "sorry, ignore this" moment for a real applicant).
- Clicking Reject marks it Not Proceeding, no applicant-facing email is sent.
- These links must be **signed, single-use, expiring tokens** (not a raw database ID in the URL) —
  this is a real security requirement, not a nice-to-have, since it's an unauthenticated action
  reachable from an email inbox.

### 5c. Normal lead flow (the two-email flow you described)
Once a submission clears the sanity check:
1. **Admin notification email** — new lead's full details, formatted as a clean summary, with a
   direct link into the (future) admin dashboard or straight to the Sheet row.
2. **Applicant confirmation email** — warm, professional, on-brand. Content skeleton (matches what
   you described plus a proper greeting/next-steps structure):
   - Warm personal greeting using their first name
   - Thank you for reaching out to Global Gate Students Network
   - Plain-language recap of what happens next (review → contact within 24 hours → next steps)
   - A WhatsApp fallback link (matches your existing `whatsappUrl()` pattern) for anyone who'd
     rather talk than wait
   - Signed off from the team, Hungary-based, with your logo/colors
3. **Visual design** — HTML email template in the site's actual palette (burgundy `#1f1210`, gold
   `#c9a24a`/`#e4c57a`, blush `#f3e4e2`, warm background `#fbfaf8`, Playfair Display-style serif
   for headings mirroring the site's `font-display`) so it reads as unmistakably "from Global
   Gate," not a generic transactional email. Built once as a reusable template, not per-email.

### 5d. Google Sheets CRM automation
- On every clean submission: append to **Leads** sheet (Sheet 1).
- On admin approval (via dashboard or a sheet-side status change, depending on Section 4
  decision): **move** (not copy) the row into **Verified Customers** (Sheet 2), stamped with
  approver + timestamp.
- Status/stage changes in Sheet 2 (or the dashboard) are the single source of truth for "where is
  this customer in the journey" — this answers your "analyze the form responses and website data
  to figure out the stages" ask; the 11-stage list in Section 4 is that analysis.

### 5e. Google Drive folder automation
- On approval (New Lead → Verified Customer), automatically create a Drive folder named with a
  clear, collision-proof convention, e.g.:
  `2026-09-22_Koker-Amina_GGSN-00042` (date + surname-firstname + a short sequential lead ID —
  the ID prevents two "John Smith"s from colliding).
- All lead folders live under one fixed **parent folder** ("Global Gate — Client Files") in the
  admin's Drive, created once and referenced by ID in `.env` — never searched for by name, to
  avoid accidentally creating duplicate parents.
- Folder is auto-shared with the admin's account (and, later, with the applicant's email if you
  want them to upload documents directly into their own folder — this would also solve the "some
  applicants struggle with Google account uploads" problem you flagged, by giving them one
  specific pre-made folder link instead of asking them to use Drive generally).
- The folder's link gets written back into the Verified Customers sheet row, so the dashboard/sheet
  always has a one-click path to that customer's documents.

### 5f. Environment & secrets (this branch only, per your instruction)
All of the following go into `.env.local` (git-ignored already) and, for deployment, into Vercel's
environment variables — never committed:
- `ADMIN_EMAIL` — where admin notifications and approval links go
- `NEXT_PUBLIC_SITE_URL` — real domain (blocks Section 2's SEO fixes until set)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` — for Sheets + Drive API
  access (replacing the current Apps Script webhook with direct, auditable API calls — see
  Section 6)
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_DRIVE_PARENT_FOLDER_ID`
- `EMAIL_PROVIDER_API_KEY` (see Section 6 for which provider)
- `APPROVAL_LINK_SECRET` — signing key for the single-use approve/reject tokens

### 5g. Data retention / compliance note
Your form answer for document retention was "until the applicant asks for deletion" — that's
applicant-driven, which is legally weaker than a defined policy (most privacy regimes expect *you*
to define and state a retention period, not wait to be asked). Recommend stating something like
"documents are retained for 24 months after a case closes, or until deletion is requested,
whichever is sooner" on the Privacy page. Your call, but I'd rather flag it now than bake in
loose language.

### Decisions needed — Section 5
- Confirm the flagged-lead review flow (silent drop vs. borderline flag-for-review) matches what
  you want — some businesses prefer *everything* gets a human glance; that's a valid choice, just
  slower for you.
- Confirm the folder-naming convention, or give me your preferred format.
- Pick a retention period for the compliance note above.

---

## 6. Tech choices for the build (informational — not asking you to decide software you don't need to)

- **Google Sheets + Drive access** — ✅ built AND live. `src/lib/google-sheets.ts` replaces the
  Apps Script webhook (`scripts/google-sheets-enquiry.gs`, now legacy) with direct **Google Sheets
  API v4 + Drive API v3** calls, authenticated with a dedicated Google **service account**
  (least-privilege: access only to the one spreadsheet and one Drive parent folder). Real
  credentials are wired up in `.env.local` and tested end-to-end: lead append, flag scoring,
  approve/reject with idempotency, and Drive folder creation with admin sharing all verified
  against the real Sheet and Drive folder. One bug found and fixed during testing: the single-use
  check on approve/reject links was keying off the `Status` text, but approving sets `Status` back
  to `"New"` — indistinguishable from a fresh lead's initial status, so the same link could be
  clicked repeatedly. Fixed to key off `Approved by` instead, which is only ever written once.
- **Transactional email** — ✅ built (`src/lib/email.ts`), provisioned as **Resend** through the
  Vercel marketplace (terms accepted). Provisioning itself is blocked on owning a domain — Resend
  requires domain ownership before it issues an API key. Code degrades gracefully (console-logs
  what it would have sent) until `RESEND_API_KEY` exists — see the setup checklist below.
- **Spam approval flow** — ✅ built. `src/lib/approval-token.ts` (signed, expiring, single-use-
  enforced HMAC tokens) + `src/app/api/enquire/approve/route.ts` (the landing page the email
  links open). Tested end-to-end in dev with a hand-signed token.
- **Admin dashboard** — ✅ built AND live, tested end-to-end with real Google sign-in. Auth via
  **Clerk** (native Vercel Marketplace integration — chosen over hand-rolling OAuth after checking
  Vercel's current auth guidance) provisioned with real dev keys, protecting `/admin` via
  `src/proxy.ts` (Next.js 16 renamed Middleware to Proxy — confirmed against the installed docs
  before assuming, since this repo's AGENTS.md warns training data may be stale here). Clerk only
  confirms "signed in" — the actual access gate is `src/app/admin/layout.tsx` comparing the signed-
  in email to `ADMIN_EMAIL`, re-checked independently in every Server Action
  (`src/app/admin/actions.ts`) since actions can be invoked directly, bypassing the layout render.
  Dashboard shows the Leads pipeline (status dropdown, notes, spam flags) and Verified Customers
  (stage tracking, Drive folder link) with a one-click "Promote to customer" that creates the Drive
  folder and moves the row atomically. `/admin` and `/sign-in` excluded from `robots.txt`.
  One deliberate deviation from the Clerk skill's default guidance: skipped the `@clerk/ui` shadcn
  theme package because it transitively pulled in an unrelated, unused Solana wallet-adapter
  dependency chain with real (if inapplicable) moderate CVEs — used Clerk's built-in `appearance`
  variables API instead, which needs no extra package and achieves the same brand-matched look.
  Restructured (2026-09-22) into a sidebar layout: `/admin` (Leads) and `/admin/verified` as
  separate routes under a shared `AdminSidebar` nav with live counts, collapsing to a hamburger-
  triggered slide-in drawer below the `md` breakpoint (mirrors the public site's `Header.tsx`
  mobile-drawer pattern). `src/app/admin/data.ts` wraps the Sheets reads in React's per-request
  `cache()` so the layout (sidebar counts) and each page (table data) don't double the API calls.
  Confirmed working on both desktop and mobile by the user directly. One lint bug fixed during this
  pass: the drawer's "close on route change" logic originally used `setState` inside a plain
  `useEffect` (flagged by `react-hooks/set-state-in-effect`) — rewritten using React's documented
  "adjust state during render" pattern instead.
- **Spam-check free-text layer** — the rules-based version (`scoreSpam` in
  `src/app/api/enquire/route.ts`) is built and live. An LLM-based upgrade is optional/deferred,
  not needed at current volume.

### External setup checklist — what still needs your action

Nothing below blocks continued development; it blocks these specific pieces from doing anything
*live*. Each is independent — do them whenever convenient.

**1. Resend (email sending)** — blocked on a domain:
- Once you have a domain, run: `vercel integration add resend/resend-email -m domain=yourdomain.com -m region=eu-west-1`
  (`eu-west-1` since Hungary/EU is your primary audience)
- Follow the DNS verification records it gives you (add them at your domain registrar)
- Run `vercel env pull` to pull `RESEND_API_KEY` into `.env.local` automatically
- Set `EMAIL_FROM` to an address on that domain, e.g. `Global Gate Students Network <hello@yourdomain.com>`

**2. Google Cloud service account (Sheets + Drive automation)**:
1. Go to [console.cloud.google.com](https://console.cloud.google.com), create a project (e.g.
   "Global Gate CRM")
2. Enable the **Google Sheets API** and **Google Drive API** for that project (APIs & Services →
   Library)
3. IAM & Admin → Service Accounts → Create Service Account (e.g. `global-gate-sheets-bot`)
4. Open the new service account → Keys → Add Key → JSON, and download it
5. From that JSON file: `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `private_key` →
   `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (paste exactly as-is, including the `\n` sequences — the
   code unescapes them automatically)
6. Create the actual Google Sheet (name it anything; the code creates the "Leads" and "Verified
   Customers" tabs automatically on first use) and **share it with the service account's
   `client_email` as Editor**
7. Copy the sheet's ID from its URL (the long string between `/d/` and `/edit`) →
   `GOOGLE_SHEETS_SPREADSHEET_ID`
8. Create a Drive folder (e.g. "Global Gate — Client Files"), **share it with the same service
   account email as Editor**, copy its folder ID from the URL → `GOOGLE_DRIVE_PARENT_FOLDER_ID`
9. Add all four values to `.env.local` (dev) and Vercel's project environment variables
   (production)

**3. Admin dashboard login — ✅ done, nothing left to do here.** Built with Clerk (Vercel
Marketplace) instead of a hand-rolled Google OAuth client — Clerk provides its own Google sign-in
out of the box, so no separate Google Cloud OAuth setup was needed. Currently running on Clerk's
free **development** keys (`pk_test_`/`sk_test_` in `.env.local`) — fine for now, but swap to
**production** keys (via the Clerk dashboard, once claimed) before this goes live publicly,
alongside the other production swaps in the deferred checklist above.

---

## 7. Decisions — resolved

1. **Enquiry-alert email (dev)** — using `rumeighoraye@gmail.com` for now, stored in `.env.local`
   as `ADMIN_EMAIL`. Swap to the real Global Gate inbox before production deploy — tracked in the
   deferred checklist below so it isn't forgotten.
2. **Refund rule** — confirmed as written: no refund on the $200 application fee; 50% refund on
   the $500 package if a visa is refused after the applicant did everything right on their end; no
   refund if the applicant is at fault for the refusal.
3. **Domain name** — leaving unset for now (deferred, see checklist below). `NEXT_PUBLIC_SITE_URL`
   stays unset in dev; the SEO fixes that depend on a real domain (Section 2, "Blocking" row) stay
   blocked until it's chosen.
4. **Wizard step order** — confirmed as specified in Section 2b, including the "how soon are you
   hoping to start?" step.
5. **Admin dashboard** — confirmed: protected route, not a third Google Sheet (Section 4).
6. **Testimonial photos** — real photos are obtainable; AI generation holds off for Daniel,
   Laurence, Sulaiman, and Khadija until those arrive. AI prompt library remains fine to use for
   all non-named imagery (hero, gallery, page backdrops) per Section 3.
7. **Spam filter philosophy** — confirmed: silent-drop for obvious bots (honeypot/rate-limit
   failures), flag borderline cases for human review per Section 5a/5b.
8. **Document retention** — 12 months after case closes, for now. **Flagged below** — this is a
   placeholder pending Tommy's actual sign-off, not a final legal position.
9. **Folder naming convention** — confirmed as proposed in Section 5e.
10. **Hungarian universities** — see the new list in Section 4.5 below, drawn from Stipendium
    Hungaricum's own published partner institutions rather than guessed, framed for Tommy to
    confirm against his actual placements. **Logo reviewed** — see the flag below.

### Deferred — confirm with Tommy before production launch
These are placeholder decisions made to keep the build moving; none of them block development,
but all of them need a real answer before this goes live:
- [ ] **Domain name** — not chosen yet. Blocks: production SEO/indexing, `NEXT_PUBLIC_SITE_URL`,
  production email sending domain (SPF/DKIM).
- [ ] **Admin email** — currently `rumeighoraye@gmail.com` for dev only. Must become the real
  Global Gate inbox in production `.env`/Vercel config.
- [ ] **Document retention period** — currently stated as 12 months as a working placeholder.
  Confirm this is the real policy Tommy wants published on the Privacy page.
- [ ] **Logo/brand color mismatch** — the logo file you shared (navy/royal blue globe, gold
  graduation cap and ring, black background) does not match the site's current burgundy/blush
  editorial palette. The **gold matches** (`#c9a24a`/`#e4c57a` is a close fit to the logo's gold),
  but the dominant color doesn't (navy blue vs. burgundy). Not changing this without direction —
  it's a real scope decision, not a bug: keep the current warm burgundy editorial direction
  (differentiates from the generic "blue education site" look), or shift the site's primary color
  toward the logo's blue for tighter brand consistency. Flagging now since email templates
  (Section 5c) are about to be built in the current palette — cheaper to decide before those exist
  than to redo them after.
- [ ] **Resend domain** — real email sending is code-complete but not live. See the "External
  setup checklist" in Section 6. (Google Sheets/Drive automation and the admin dashboard ARE live —
  only email sending is still blocked.)
- [ ] **Clerk production keys** — the admin dashboard currently runs on Clerk's free development
  keys (fine for now, has usage limits). Swap to production keys before public launch.
- [ ] **Downloaded service account JSON key** — `~/Downloads/global-gate-crm-*.json` can fully
  impersonate the Sheets/Drive service account. Move it somewhere secure or delete it now that its
  values are safely in `.env.local`.

## Build roadmap (once you say go — can run all phases or pick a subset)

1. ✅ **Content & compliance fixes** — refund/guarantee wording, retention policy, comprehensive
   Privacy/Terms rewrite. Domain wiring itself remains deferred (blocks SEO indexing).
2. ✅ **UX/SEO pass** — Section 2b mobile-first wizard form built and tested end-to-end.
   Alt text/GSC verification/OG image swap still pending (tied to Section 3 photography + domain).
3. ⬜ **Photography** — prompt library written (`docs/photography/ai-image-prompts.txt`); actual
   image generation/collection not started.
4. ✅ **Spam filter + notification emails** — Section 5a–5c built and tested: rules-based spam
   scoring, admin notification, applicant confirmation, flagged-lead approval email all live
   (degrading gracefully without `RESEND_API_KEY`).
5. ✅ **Sheets CRM restructure + Drive automation** — Section 5d–5e built
   (`src/lib/google-sheets.ts`): service account integration, Leads/Verified Customers sheet
   design, Drive folder creation. Code-complete, not yet live (needs the Google Cloud setup
   checklist in Section 6).
6. ✅ **Admin dashboard** — built and tested end-to-end with real Google sign-in (via Clerk) and
   real Sheets data. Pipeline view, notes, status changes, and the "Promote to customer" action
   (Drive folder creation + sheet move) all confirmed working live.
7. ✅ **QA pass** — wizard form, spam/approval flow, Sheets/Drive automation, and the admin
   dashboard have all been tested live against real infrastructure (not just code review). The one
   piece still untested for real is actual email delivery — blocked on the Resend domain
   requirement, same as noted throughout.

All work stays on `feature/crm-automation-and-site-refresh` until you review and approve a merge.
`main` is not touched at any point in this plan.
