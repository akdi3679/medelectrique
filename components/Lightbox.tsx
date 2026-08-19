// components/Lightbox.tsx
"use client";
import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

interface LightboxImage {
  url: string;
  name: string;
}

interface Props {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNavigate }: Props) {
  const { language } = useLanguage();
  const lang = language as "fr" | "en" | "ar";
  const isRTL = lang === "ar";

  const current = images[currentIndex];

  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  // ⭐ Navigation clavier
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") (isRTL ? goNext : goPrev)();
      if (e.key === "ArrowRight") (isRTL ? goPrev : goNext)();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, goPrev, goNext, isRTL]);

  // ⭐ Bloque le scroll du body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Bouton fermer */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X size={24} />
      </button>

      {/* Compteur */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Bouton précédent */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Previous"
          className={`absolute top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors ${isRTL ? "right-4" : "left-4"}`}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Bouton suivant */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Next"
          className={`absolute top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors ${isRTL ? "left-4" : "right-4"}`}
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Image */}
      <img
        src={current.url}
        alt={current.name}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl animate-scale-in"
      />
    </div>
  );
}