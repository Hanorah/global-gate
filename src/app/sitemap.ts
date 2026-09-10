import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const routes = [
  "/",
  "/how-it-works",
  "/services",
  "/fees",
  "/guide",
  "/about",
  "/testimonials",
  "/faq",
  "/enquire",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((path) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path === "/" || path === "/enquire" ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : path === "/enquire" || path === "/services" || path === "/fees"
          ? 0.9
          : path === "/privacy" || path === "/terms"
            ? 0.3
            : 0.7,
  }));
}
