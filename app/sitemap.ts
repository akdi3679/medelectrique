import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || "https://med-elec.vercel.app";
  return ["/fr", "/en", "/ar"].map((l) => ({ url: `${base}${l}`, lastModified: new Date() }));
}