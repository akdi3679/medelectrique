// app/api/brand/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache 1h

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du0frvxjo';
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

// ⭐ Whitelist des folders autorisés (sécurité)
const FOLDERS = {
  siteImg: 'medelec/site-img',
  catalogue: 'medelec/catalogue',
  services: 'medelec/services',
  projects: 'medelec/projects',
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
    console.error('[brand] Missing Cloudinary credentials');
    return NextResponse.json({ siteImg: {}, catalogue: {}, services: {}, projects: {} });
  }

  try {
    // ⭐ Search par folder — marche en dynamic folder mode
    const expression = `(folder:"${FOLDERS.siteImg}" OR folder:"${FOLDERS.catalogue}" OR folder:"${FOLDERS.services}" OR folder:"${FOLDERS.projects}") AND resource_type:image`;

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
      console.error(`[brand] Search failed: ${r.status}`, errText);
      return NextResponse.json({ siteImg: {}, catalogue: {}, services: {}, projects: {} });
    }

    const data = await r.json();

    // ⭐ Map par folder + filename (dynamic mode : public_id sans chemin)
    const result: Record<string, Record<string, string>> = {
      siteImg: {},
      catalogue: {},
      services: {},
      projects: {},
    };

    const folderKeyMap: Record<string, keyof typeof result> = {
      [FOLDERS.siteImg]: 'siteImg',
      [FOLDERS.catalogue]: 'catalogue',
      [FOLDERS.services]: 'services',
      [FOLDERS.projects]: 'projects',
    };

    for (const res of data.resources ?? []) {
      const group = folderKeyMap[res.folder];
      if (!group) continue;
      const name = res.filename || res.public_id; // ← filename = nom sans extension
      result[group][name] = res.secure_url;
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[brand] Search error:', err);
    return NextResponse.json({ siteImg: {}, catalogue: {}, services: {}, projects: {} });
  }
}