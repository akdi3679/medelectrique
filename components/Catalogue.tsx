// components/Catalogue.tsx
"use client";
import { useState, useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { categoryOrder, type CategoryId } from "@/data/catalogue";
import { coordonees } from "@/data/coordonees";
import { useMediaImages } from "@/lib/useMedia";
import Lightbox from "./Lightbox";

export default function Catalogue() {
  const { t, language, isLoaded } = useLanguage();
  const images = useMediaImages('catalogue');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!isLoaded) return null;
  const lang = language as "fr" | "en" | "ar";
  const isRTL = lang === "ar";

  // ⭐ Gardes de sécurité pour les textes
  const catalogueText = t?.catalogue ?? {};
  const categoriesText = (catalogueText.categories ?? {}) as Record<string, string>;
  const titleText = catalogueText.title ?? "";
  const subtitleText = catalogueText.subtitle ?? "";
  const ctaText = catalogueText.cta ?? "";
  const allLabel = categoriesText.all ?? "All";

  // ⭐ Grouper les images par catégorie
  const grouped = useMemo(() => {
    const groups: Record<string, { name: string; url: string }[]> = {};
    
    // ⭐ Garde : images doit être un objet
    if (!images || typeof images !== 'object') return groups;
    
    for (const [name, url] of Object.entries(images)) {
      if (!name || !url) continue;
      
      const lastDash = name.lastIndexOf('-');
      const category = lastDash > 0 ? name.slice(0, lastDash) : name;
      
      if (!groups[category]) groups[category] = [];
      groups[category].push({ name, url });
    }
    
    for (const cat of Object.keys(groups)) {
      groups[cat].sort((a, b) => {
        const numA = parseInt(a.name.split('-').pop() || '0', 10);
        const numB = parseInt(b.name.split('-').pop() || '0', 10);
        return numA - numB;
      });
    }
    
    return groups;
  }, [images]);

  // ⭐ Images à afficher
  const displayedImages = useMemo(() => {
    if (selectedCategory === 'all') {
      return categoryOrder.flatMap((cat) => grouped[cat] || []);
    }
    return grouped[selectedCategory] || [];
  }, [selectedCategory, grouped]);

  const totalCount = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <section id="catalogue" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{titleText}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{subtitleText}</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
              selectedCategory === 'all'
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card text-foreground/70 border border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {allLabel}
            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-primary-foreground/20' : 'bg-muted'}`}>
              {totalCount}
            </span>
          </button>

          {categoryOrder.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = (grouped[cat] || []).length;
            const catLabel = categoriesText[cat] || cat;
            
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-foreground/70 border border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {catLabel}
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-primary-foreground/20' : 'bg-muted'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grille */}
        {displayedImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedImages.map((img, i) => {
              const imgCategory = img.name.slice(0, img.name.lastIndexOf('-'));
              const imgCategoryLabel = categoriesText[imgCategory] || imgCategory;
              const wa = encodeURIComponent(`Bonjour Med Elec — ${ctaText} : ${imgCategoryLabel}`);
              
              return (
                <div
                  key={img.name}
                  className="group relative overflow-hidden rounded-xl aspect-[4/5] cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${(i % 8) * 60}ms` }}
                  onClick={() => setLightboxIndex(i)}
                >
                  <img
                    src={img.url}
                    alt={imgCategoryLabel}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <p className="text-sm font-semibold mb-2">{imgCategoryLabel}</p>
                    <a
                      href={`https://wa.me/${coordonees.whatsapp}?text=${wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-xs text-center"
                    >
                      {ctaText}
                    </a>
                  </div>

                  <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border">
            <ImageIcon className="mx-auto h-12 w-12 text-foreground/30 mb-4" />
            <p className="text-foreground/60 text-lg">
              {lang === "fr" ? "Aucune image dans cette catégorie pour le moment." : lang === "en" ? "No images in this category yet." : "لا توجد صور في هذه الفئة بعد."}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && displayedImages.length > 0 && (
        <Lightbox
          images={displayedImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}