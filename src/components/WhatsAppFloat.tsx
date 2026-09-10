"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <Link
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,211,102,0.45)] transition hover:scale-[1.03] hover:bg-[#1ebe57] md:right-6 md:bottom-6"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Chat with us</span>
    </Link>
  );
}
