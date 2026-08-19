// lib/useFolderMedia.ts
"use client";
import { useEffect, useState } from 'react';

// ⭐ Cache global pour éviter les fetchs répétés
const cache = new Map<string, Record<string, string>>();

export function useFolderMedia(folder: string) {
  const [images, setImages] = useState<Record<string, string>>(cache.get(folder) ?? {});
  const [loading, setLoading] = useState(!cache.has(folder));

  useEffect(() => {
    if (cache.has(folder)) return;

    let cancelled = false;

    fetch(`/api/media?folder=${encodeURIComponent(folder)}`)
      .then((r) => (r.ok ? r.json() : { images: {} }))
      .then((d) => {
        if (cancelled) return;
        const imgs = d.images ?? {};
        cache.set(folder, imgs);
        setImages(imgs);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        cache.set(folder, {});
        setImages({});
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [folder]);

  return { images, loading };
}