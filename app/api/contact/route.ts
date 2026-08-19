// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { contactSchema, audioSchema } from '@/lib/validation';

// ⭐ Worker URL côté serveur uniquement (jamais exposée au client)
const WORKER_URL = process.env.WORKER_URL;

// Rate limit
const rateLimitMap = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 5 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Try again in 5 minutes.' },
      { status: 429 }
    );
  }

  if (!WORKER_URL) {
    console.error('[contact] Missing WORKER_URL');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    
    // ⭐ Validation avec Zod
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      reason: formData.get('reason'),
      message: formData.get('message'),
    };

    const validation = contactSchema.safeParse(rawData);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, reason, message } = validation.data;

    // ⭐ Validation audio si présent
    const audioFile = formData.get('audio') as File | null;
    if (audioFile) {
      const audioValidation = audioSchema.safeParse({
        size: audioFile.size,
        type: audioFile.type,
      });

      if (!audioValidation.success) {
        return NextResponse.json(
          { error: 'Invalid audio file' },
          { status: 400 }
        );
      }
    }

    // ⭐ Construction du message pour WhatsApp/Telegram
    const text = `🔔 *Nouveau contact Med Elec*\n\n*Nom:* ${name}\n*Tél:* ${phone || 'Non fourni'}\n*Email:* ${email}\n*Motif:* ${reason}\n\n*Message:*\n${message || '(message vocal joint)'}`;

    // ⭐ Forward au worker Cloudflare
    const workerFormData = new FormData();
    workerFormData.append('text', text);
    
    if (audioFile) {
      const audioDuration = formData.get('audioDuration');
      workerFormData.append('audio', audioFile);
      if (audioDuration) {
        workerFormData.append('audioDuration', audioDuration as string);
      }
    }

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      body: workerFormData,
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.error('[contact] Worker error:', res.status);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}