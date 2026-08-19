// app/api/media/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache 1h

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du0frvxjo';
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

// ⭐ Whitelist des folders autorisés
// ⚠️ ADAPTE ces chemins selon ce que tu vois dans Cloudinary
const ALLOWED_FOLDERS = new Set([
  'site-img',           // ← Si tes folders sont à la racine
  'catalogue',
  'services',
  'projects',
  // OU si tu as un folder parent "medelec" :
  // 'medelec/site-img',
  // 'medelec/catalogue',
  // 'medelec/services',
  // 'medelec/projects',
]);

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
  const folder = searchParams.get('folder');

  // ⭐ Validation du folder
  if (!folder || !ALLOWED_FOLDERS.has(folder)) {
    console.error('[media] Invalid folder:', folder);
    return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
  }

  try {
    // ⭐ Search par folder — marche en dynamic folder mode
    const expression = `folder:"${folder}" AND resource_type:image`;
    
    console.log('[media] Searching folder:', folder);

    const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${KEY}:${SECRET}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression,
        max_results: 100,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      console.error(`[media] Search failed: ${r.status}`, errText);
      return NextResponse.json({ images: {} });
    }

    const data = await r.json();
    
    // ⭐ Log pour debug
    console.log(`[media] Found ${data.resources?.length ?? 0} images in folder "${folder}"`);

    // ⭐ Map par filename (dynamic mode : public_id sans chemin)
    const images: Record<string, string> = {};
    for (const res of data.resources ?? []) {
      const name = res.filename || res.public_id;
      images[name] = res.secure_url;
    }

    return NextResponse.json({ images });
  } catch (err) {
    console.error('[media] Search error:', err);
    return NextResponse.json({ images: {} });
  }
}