// lib/useMedia.ts
"use client";
import { useEffect, useState } from 'react';

const cache = new Map<string, Record<string, string>>();

// ⭐ Hook pour un groupe (catalogue, site, etc.)
export function useMediaImages(key: string) {
  const [images, setImages] = useState<Record<string, string>>(cache.get(key) ?? {});

  useEffect(() => {
    if (cache.has(key)) return;
    let cancelled = false;

    fetch(`/api/media?key=${encodeURIComponent(key)}`)
      .then((r) => (r.ok ? r.json() : { images: {} }))
      .then((d) => {
        if (cancelled) return;
        const imgs = d.images ?? {};
        cache.set(key, imgs);
        setImages(imgs);
      })
      .catch(() => {
        if (!cancelled) cache.set(key, {});
      });

    return () => { cancelled = true; };
  }, [key]);

  return images;
}

// ⭐ Hook pour une image unique (hero, bio, favicon)
export function useMediaImage(key: string): string | null {
  const images = useMediaImages(key);
  return images[key] ?? null;
}