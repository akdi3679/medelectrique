// app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema, audioSchema } from '@/lib/validation';

const WORKER_URL = process.env.WORKER_URL;
const WORKER_SECRET = process.env.WORKER_SECRET;

export async function POST(req: NextRequest) {
  // ⭐ Vérification des credentials serveur
  if (!WORKER_URL || !WORKER_SECRET) {
    console.error('[booking] Missing WORKER_URL or WORKER_SECRET');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();

    // ⭐ Extraction des données
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      date: formData.get('date'),
      time: formData.get('time'),
      notes: formData.get('notes'),
    };

    // ⭐ Validation Zod
    const validation = bookingSchema.safeParse(rawData);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, service, date, time, notes } = validation.data;

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

    // ⭐ Labels des services (FR — langue principale Medelec)
    const serviceLabels: Record<string, string> = {
      maintenance: '🔧 Maintenance',
      installation: '⚡ Installation',
      repair: '🛠️ Réparation urgente',
      inspection: '🔍 Inspection',
    };

    // ⭐ Formatage date/heure
    const scheduleText =
      date && time
        ? `\n*📅 Date:* ${date} à ${time}`
        : '\n*📅 Disponibilité:* le plus tôt possible';

    // ⭐ Construction du message Matrix
    const text = `🔔 *Réservation Med Elec*\n\n*Nom:* ${name}\n*Tél:* ${phone}\n*Email:* ${email}\n*Service:* ${serviceLabels[service] || service}${scheduleText}\n\n*Notes:*\n${notes || '(message vocal joint)'}`;

    // ⭐ Construction du FormData pour le worker
    const workerFormData = new FormData();
    workerFormData.append('text', text);

    if (audioFile) {
      workerFormData.append('audio', audioFile);
      const audioDuration = formData.get('audioDuration');
      if (audioDuration) {
        workerFormData.append('audioDuration', audioDuration as string);
      }
    }

    // ⭐ Appel au worker avec secret header
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'X-Worker-Secret': WORKER_SECRET,
      },
      body: workerFormData,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('[booking] Worker error:', res.status, errData);

      if (res.status === 429) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }
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