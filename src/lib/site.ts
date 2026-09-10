export const site = {
  name: "Global Gate Students Network",
  shortName: "Global Gate",
  tagline: "Study in Hungary with guidance you can trust.",
  description:
    "Global Gate Students Network helps students choose Hungarian study pathways, prepare strong applications, and settle in Hungary — with hands-on support from a team based there.",
  founder: {
    name: "Tommy Kaiza Koker",
    role: "Co-Founder & Chief Executive Officer",
  },
  contact: {
    email: "globalgatestudynetwork@gmail.com",
    phone: "+36205201974",
    phoneDisplay: "+36 20 520 1974",
    /** digits only for wa.me */
    whatsappNumber: "36205201974",
    address: "Peter Karoly utca 1, Hungary",
    facebook: "https://www.facebook.com/share/1BwQsxsUJL/?mibextid=wwXIfr",
  },
  whatsappDefaultMessage:
    "Hi Global Gate, my name is _____ and I am interested in studying in Hungary. I would like guidance on applications and next steps.",
  pricing: {
    application: { label: "Application support", price: 200, currency: "USD" },
    fullGuide: {
      label: "Full guidance to visa & arrival",
      price: 500,
      currency: "USD",
      includes: "Visa process, arrival support, and accommodation research",
    },
  },
  responseSla: "within 24 hours",
  images: {
    hero: "/images/hero-graduate.jpg",
    groupCloseup: "/images/gallery/group-closeup.jpg",
    duoDiploma: "/images/gallery/duo-diploma.jpg",
    duoPoint: "/images/gallery/duo-point.jpg",
    portraitRed: "/images/gallery/portrait-red-stole.jpg",
    portraitPodium: "/images/gallery/portrait-podium.jpg",
    groupCampus: "/images/gallery/group-campus.jpg",
    groupDaffodil: "/images/gallery/group-daffodil.jpg",
    portraitLookback: "/images/gallery/portrait-lookback.jpg",
    seatedGraduates: "/images/gallery/seated-graduates.jpg",
    motherDaughter: "/images/gallery/mother-daughter.jpg",
    sectionGraduates: "/images/section-graduates.jpg",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/services", label: "Services" },
  { href: "/fees", label: "Fees" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Stories" },
  { href: "/faq", label: "FAQ" },
  { href: "/enquire", label: "Enquire" },
] as const;

export const footerExtraLinks = [
  { href: "/guide", label: "Study guide" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export const services = [
  {
    title: "University and program selection",
    body: "We match your grades, interests, and budget to suitable Hungarian programmes — then help you choose with confidence.",
  },
  {
    title: "Admission application support",
    body: "We guide you through completing and submitting university applications so nothing important is missed.",
  },
  {
    title: "Document review and correction",
    body: "Certificates, transcripts, CVs, and motivation letters are checked carefully before they go out.",
  },
  {
    title: "Stipendium Hungaricum guidance",
    body: "We explain timelines, documents, and preparation steps for scholarship pathways. Official applications remain free and are submitted through official channels.",
  },
  {
    title: "Translation and attestation support",
    body: "We help you organise translations and attestations universities and embassies typically expect.",
  },
  {
    title: "Student visa and residence permit support",
    body: "From appointment prep to checklist review, we walk you through the visa and residence process.",
  },
  {
    title: "Accommodation search",
    body: "We help you research housing options so you arrive with a clearer plan — not last-minute stress.",
  },
  {
    title: "Airport pickup and arrival support",
    body: "Landing in a new country is easier when someone is expecting you and ready to help you settle in.",
  },
  {
    title: "Bank account and registration help",
    body: "After arrival, we guide you through practical steps like banking and local registration.",
  },
  {
    title: "Post-arrival mentoring",
    body: "Support does not end at the airport. We stay available while you find your footing in Hungary.",
  },
] as const;

export const journeySteps = [
  {
    step: "01",
    title: "Tell us about yourself",
    body: "Share your background, study goals, and preferred level through the enquiry form. We reply within 24 hours.",
  },
  {
    step: "02",
    title: "Plan your pathway",
    body: "Together we shortlist programmes and map documents, timelines, and the support you need.",
  },
  {
    step: "03",
    title: "Strengthen your application",
    body: "We review materials, fix gaps, and support submission so your file is clear and complete.",
  },
  {
    step: "04",
    title: "Visa and travel prep",
    body: "When admission moves forward, we help you prepare for visa, travel, and arrival logistics.",
  },
  {
    step: "05",
    title: "Settle in Hungary",
    body: "From airport support to banking and early mentoring, we stay with you as you begin student life.",
  },
] as const;

export const documents = [
  "Passport biodata page",
  "Passport photograph",
  "Secondary school certificate (WAEC, NECO or equivalent)",
  "Secondary school transcript",
  "Bachelor degree certificate (where relevant)",
  "Bachelor transcript (where relevant)",
  "CV or resume",
  "Motivation letter",
  "Recommendation letters",
  "English proficiency certificate",
  "Birth certificate",
  "Medical certificate",
] as const;

/** objectPosition uses CSS values — prefer center / mid-face, not top of frame */
export const testimonials = [
  {
    name: "Khadija Sankoh",
    context: "Sierra Leonean · based in the USA",
    quote:
      "Having someone on the ground in Hungary made the process feel real — not like another online promise.",
    image: "/images/gallery/mother-daughter.jpg",
    objectPosition: "center 40%",
  },
  {
    name: "Daniel H.R. Wahif Massaquoi",
    context: "Sierra Leonean · based in Dubai",
    quote:
      "Clear guidance and steady communication. I always knew what to send next.",
    image: "/images/gallery/portrait-red-stole.jpg",
    objectPosition: "center 35%",
  },
  {
    name: "Lawrence Sedalia Amartey",
    context: "Ghanaian · based in Dubai",
    quote:
      "From application questions to arrival planning, the support felt practical and human.",
    image: "/images/gallery/portrait-lookback.jpg",
    objectPosition: "center 38%",
  },
  {
    name: "Sulaiman Sankoh",
    context: "Sierra Leonean · based in Sierra Leone",
    quote:
      "I trusted Global Gate because referrals from other students backed what they said.",
    image: "/images/gallery/duo-diploma.jpg",
    objectPosition: "center 42%",
  },
] as const;

export const pageHeroes = {
  howItWorks: {
    image: "/images/gallery/group-campus.jpg",
    objectPosition: "center 45%",
  },
  services: {
    image: "/images/gallery/duo-diploma.jpg",
    objectPosition: "center 40%",
  },
  fees: {
    image: "/images/gallery/group-daffodil.jpg",
    objectPosition: "center 48%",
  },
  guide: {
    image: "/images/gallery/group-closeup.jpg",
    objectPosition: "center 42%",
  },
  about: {
    image: "/images/gallery/mother-daughter.jpg",
    objectPosition: "center 38%",
  },
  testimonials: {
    image: "/images/gallery/duo-point.jpg",
    objectPosition: "center 45%",
  },
  enquire: {
    // Landscape-friendly photo; seated portrait was cropping heads in wide heroes
    image: "/images/gallery/mother-daughter.jpg",
    objectPosition: "center 32%",
  },
  privacy: {
    image: "/images/gallery/group-closeup.jpg",
    objectPosition: "center 42%",
  },
  terms: {
    image: "/images/gallery/group-campus.jpg",
    objectPosition: "center 45%",
  },
} as const;

/** WhatsApp deep link with a ready-to-send greeting */
export function whatsappUrl(message?: string) {
  const text = message?.trim() || site.whatsappDefaultMessage;
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const faqs = [
  {
    q: "Is Global Gate a real organisation based in Hungary?",
    a: "Yes. Global Gate Students Network is led by Tommy Kaiza Koker, based in Hungary. You can reach us by phone, WhatsApp, email, and our published address.",
  },
  {
    q: "Do you guarantee admission or a visa?",
    a: "We provide hands-on guidance and process support. Final admission, scholarship, and visa decisions are made by universities, scholarship bodies, and immigration authorities.",
  },
  {
    q: "How much do your services cost?",
    a: "Application support is USD 200. Full guidance through visa, arrival, and accommodation research is USD 500. Full details are on the Fees page.",
  },
  {
    q: "How fast do you reply?",
    a: "We typically reply within 24 hours after you submit the enquiry form.",
  },
  {
    q: "Can I send documents by email instead of Google Drive?",
    a: "Yes. After your enquiry, we will tell you exactly what to send and you can share documents by email or WhatsApp if Google uploads are difficult.",
  },
  {
    q: "Do you help with Stipendium Hungaricum?",
    a: "We offer guidance and preparation support. Official Stipendium Hungaricum applications are free and submitted through official channels — we do not sell or guarantee scholarship awards.",
  },
] as const;
