// lib/brand-media.tsx
"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface BrandMedia {
  siteImg: Record<string, string>;
  catalogue: Record<string, string>;
  services: Record<string, string>;
  projects: Record<string, string>;
}

const empty: BrandMedia = { siteImg: {}, catalogue: {}, services: {}, projects: {} };

const Ctx = createContext<BrandMedia>(empty);
let cache: BrandMedia | null = null;

export function BrandMediaProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BrandMedia>(cache ?? empty);

  useEffect(() => {
    if (cache) return;
    
    fetch('/api/brand')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d === 'object') {
          // ⭐ Variable locale typée explicitement comme BrandMedia
          const newData: BrandMedia = { ...empty, ...d };
          cache = newData;
          setData(newData); // ✅ Maintenant TypeScript sait que c'est BrandMedia (pas null)
        }
      })
      .catch(() => {});
  }, []);

  return <Ctx.Provider value={data}>{children}</Ctx.Provider>;
}

export const useBrandMedia = () => useContext(Ctx);