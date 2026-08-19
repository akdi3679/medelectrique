// app/api/media/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache 1h

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du0frvxjo';
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

// ⭐⭐⭐ SINGLE SOURCE OF TRUTH (côté serveur uniquement)
// Le client envoie la clé, le serveur résout folder + filename
const MEDIA_MAP: Record<string, { folder: string; name?: string }> = {
  // ── Groupes : retournent toutes les images du folder ──
  site:      { folder: 'site-img' },
  catalogue: { folder: 'catalogue' },
  services:  { folder: 'services' },
  projects:  { folder: 'projects' },

  // ── Clés individuelles : retournent une image précise ──
  hero:    { folder: 'site-img', name: 'hero' },
  bio:     { folder: 'site-img', name: 'bio' },
};

// Rate limit
const rateLimitMap = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!KEY || !SECRET) {
    console.error('[media] Missing Cloudinary credentials');
    return NextResponse.json({ images: {} });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  // ⭐ Validation stricte : la clé DOIT exister dans la map serveur
  if (!key || !(key in MEDIA_MAP)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  const { folder, name } = MEDIA_MAP[key];

  try {
    // ⭐ Expression construite UNIQUEMENT avec des valeurs serveur
    // (jamais avec l'input utilisateur → zéro injection)
    let expression = `folder:"${folder}" AND resource_type:image`;
    if (name) {
      expression += ` AND filename:"${name}"`;
    }

    const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${KEY}:${SECRET}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression, max_results: 100 }),
      signal: AbortSignal.timeout(8000),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      console.error(`[media] Search failed: ${r.status}`, errText);
      return NextResponse.json({ images: {} });
    }

    const data = await r.json();

    const images: Record<string, string> = {};
    for (const res of data.resources ?? []) {
      const imageName = res.filename || res.public_id;
      images[imageName] = res.secure_url;
    }

    return NextResponse.json({ images });
  } catch (err) {
    console.error('[media] Search error:', err);
    return NextResponse.json({ images: {} });
  }
}