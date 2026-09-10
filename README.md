# Global Gate Students Network — Website

Next.js + GSAP marketing site for Global Gate Students Network (Study in Hungary admissions consultancy).

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
- **GSAP** + `@gsap/react`
- **Google Sheets** for enquiry storage (Apps Script webhook)

## Develop

```bash
cd website
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connect Google Sheets (enquiries)

1. Create a Google Sheet
2. Open `scripts/google-sheets-enquiry.gs` and follow the comments inside
3. Deploy as a **Web app** (Anyone can access)
4. Put the Web App URL in `.env.local`:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

5. Restart the dev server and submit a test enquiry

Without the env var, the form still works and logs to the server console (local/dev only).

## WhatsApp

All WhatsApp buttons open a chat with a pre-filled message:

> Hi Global Gate, my name is _____ and I am interested in studying in Hungary...

Edit the default in `src/lib/site.ts` → `whatsappDefaultMessage`.

## Project map

- `src/lib/site.ts` — brand, nav, pricing, FAQs, WhatsApp helper
- `src/components/` — layout, heroes, form, logo
- `src/app/api/enquire/route.ts` — posts to Google Sheets webhook
- `scripts/google-sheets-enquiry.gs` — Apps Script to paste into Google

## Before production

1. Set `GOOGLE_SHEETS_WEBHOOK_URL`
2. Confirm email spelling / alert inbox
3. Approve legal wording (refunds / outcomes)
4. Add Tommy’s photo
5. Prefer higher-res photos (1920px+) for sharper heroes
6. Connect domain
