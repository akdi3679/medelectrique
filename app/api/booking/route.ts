// app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema, audioSchema } from '@/lib/validation';

const WORKER_URL = process.env.WORKER_URL;
const WORKER_SECRET = process.env.WORKER_SECRET; // ⭐ Ajout

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
    console.error('[booking] Missing WORKER_URL');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      date: formData.get('date'),
      time: formData.get('time'),
      notes: formData.get('notes'),
    };

    const validation = bookingSchema.safeParse(rawData);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, service, date, time, notes } = validation.data;

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

    const scheduleText = date && time
      ? `\n*Date:* ${date} à ${time}`
      : '\n*Disponibilité:* le plus tôt possible';

    const text = `🔔 *Réservation Med Elec*\n\n*Nom:* ${name}\n*Tél:* ${phone}\n*Email:* ${email}\n*Service:* ${service}${scheduleText}\n\n*Notes:*\n${notes || '(message vocal joint)'}`;

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
      headers: {
        'X-Worker-Secret': WORKER_SECRET, // ⭐ Secret header
      },
      body: workerFormData,
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.error('[booking] Worker error:', res.status);
      return NextResponse.json(
        { error: 'Failed to send booking' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[booking] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}