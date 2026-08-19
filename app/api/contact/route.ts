// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { contactSchema, audioSchema } from '@/lib/validation';

const WORKER_URL = process.env.WORKER_URL;
const WORKER_SECRET = process.env.WORKER_SECRET; // ⭐ Ajout

export async function POST(req: NextRequest) {
  if (!WORKER_URL || !WORKER_SECRET) {
    console.error('[contact] Missing WORKER_URL or WORKER_SECRET');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    
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

    const audioFile = formData.get('audio') as File | null;
    if (audioFile) {
      const audioValidation = audioSchema.safeParse({ size: audioFile.size, type: audioFile.type });
      if (!audioValidation.success) {
        return NextResponse.json({ error: 'Invalid audio file' }, { status: 400 });
      }
    }

    const motifLabels: Record<string, string> = {
      electrical: '⚡ Électricité',
      ac: '❄️ Climatisation',
      repair: '🔧 Réparation',
      other: '📋 Autre',
    };

    const text = `🔔 *Nouveau contact Med Elec*\n\n*Nom:* ${name}\n*Tél:* ${phone || 'Non fourni'}\n*Email:* ${email}\n*Motif:* ${motifLabels[reason] || reason}\n\n*Message:*\n${message || '(message vocal joint)'}`;

    const workerFormData = new FormData();
    workerFormData.append('text', text);
    if (audioFile) {
      workerFormData.append('audio', audioFile);
      const audioDuration = formData.get('audioDuration');
      if (audioDuration) workerFormData.append('audioDuration', audioDuration as string);
    }

    // ⭐ Appel au worker AVEC le secret
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'X-Worker-Secret': WORKER_SECRET, // ⭐ Secret header
      },
      body: workerFormData,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('[contact] Worker error:', res.status, errData);
      if (res.status === 429) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}