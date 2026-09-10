import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { site, whatsappUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-burgundy text-white">
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <BrandLogo size="footer" />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
            Opening doors. Expanding futures. Real guidance for African students and international
            applicants who want a clear path into Hungarian higher education.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">Explore</p>
          <ul className="mt-5 space-y-2.5 text-sm text-white/75">
            <li><Link href="/how-it-works" className="transition hover:text-white">How it works</Link></li>
            <li><Link href="/services" className="transition hover:text-white">Services</Link></li>
            <li><Link href="/fees" className="transition hover:text-white">Fees</Link></li>
            <li><Link href="/guide" className="transition hover:text-white">Study guide</Link></li>
            <li><Link href="/about" className="transition hover:text-white">About</Link></li>
            <li><Link href="/testimonials" className="transition hover:text-white">Testimonials</Link></li>
            <li><Link href="/faq" className="transition hover:text-white">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">Contact</p>
          <ul className="mt-5 space-y-2.5 text-sm text-white/75">
            <li>
              <a href={`mailto:${site.contact.email}`} className="transition hover:text-white">
                {site.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.contact.phone}`} className="transition hover:text-white">
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappUrl()} className="transition hover:text-white" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>{site.contact.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <a href={site.contact.facebook} target="_blank" rel="noreferrer" className="hover:text-white">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
