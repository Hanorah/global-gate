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
