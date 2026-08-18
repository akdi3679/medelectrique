// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://medelectrique.vercel.app';
  const now = new Date();
  const languages = ['fr', 'en', 'ar'];
  
  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Ajoute les 3 versions linguistiques
  const langEntries: MetadataRoute.Sitemap = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1,
    alternates: {
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
      },
    },
  }));

  // Sections importantes (ancres)
  const sections = [
    { anchor: '#services', priority: 0.9, changeFrequency: 'monthly' as const },
    { anchor: '#catalogue', priority: 0.8, changeFrequency: 'weekly' as const },
    { anchor: '#projects', priority: 0.8, changeFrequency: 'monthly' as const },
    { anchor: '#booking', priority: 0.9, changeFrequency: 'monthly' as const },
    { anchor: '#testimonials', priority: 0.7, changeFrequency: 'weekly' as const },
    { anchor: '#faq', priority: 0.7, changeFrequency: 'monthly' as const },
    { anchor: '#contact', priority: 0.9, changeFrequency: 'monthly' as const },
  ];

  const anchorEntries: MetadataRoute.Sitemap = languages.flatMap((lang) =>
    sections.map((s) => ({
      url: `${baseUrl}/${lang}${s.anchor}`,
      lastModified: now,
      changeFrequency: s.changeFrequency,
      priority: s.priority,
    }))
  );

  return [...baseEntries, ...langEntries, ...anchorEntries];
}