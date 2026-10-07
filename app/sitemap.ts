import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-07");
  return [
    { url: site.url, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/creditos`, lastModified, changeFrequency: "monthly", priority: 0.3 },
  ];
}
