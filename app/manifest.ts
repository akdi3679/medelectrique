// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Med Elec — Électricien & Climatisation à Tataouine',
    short_name: 'Med Elec',
    description: 'Installation électrique, climatisation et réparation à Tataouine et toute la Tunisie. Devis gratuit, urgences 24/7.',
    start_url: '/fr',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    lang: 'fr',
    dir: 'auto',
    categories: ['business', 'utilities'],
  };
}