// components/Catalogue.tsx
"use client";
import { useState, useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { categoryOrder, type CategoryId } from "@/data/catalogue";
import { coordonees } from "@/data/coordonees";
import { useMediaImages } from "@/lib/useMedia";
import Lightbox from "./Lightbox";

// ⭐ Objets vides STABLES (même référence à chaque render)
const EMPTY_OBJ = {};
const EMPTY_CATEGORIES: Record<string, string> = {};
const EMPTY_ARRAY: any[] = [];

export default function Catalogue() {
  const { t, language, isLoaded } = useLanguage();
  const images = useMediaImages('catalogue');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // ⭐ Memoize les textes pour éviter la boucle
  const catalogueText = useMemo(() => {
    return (t && t.catalogue && typeof t.catalogue === 'object') ? t.catalogue : EMPTY_OBJ;
  }, [t]);

  const categoriesText = useMemo(() => {
    const cats = (catalogueText as any).categories;
    return (cats && typeof cats === 'object') ? cats : EMPTY_CATEGORIES;
  }, [catalogueText]);

  const titleText = (catalogueText as any).title ?? "";
  const subtitleText = (catalogueText as any).subtitle ?? "";
  const ctaText = (catalogueText as any).cta ?? "";
  const allLabel = categoriesText.all ?? (language === "ar" ? "الكل" : language === "en" ? "All" : "Tous");

  if (!isLoaded) return null;
  const lang = language as "fr" | "en" | "ar";
  const isRTL = lang === "ar";

  // ⭐ Grouper par catégorie
  const grouped = useMemo(() => {
    const groups: Record<string, { name: string; url: string }[]> = {};
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

  const displayedImages = useMemo(() => {
    if (selectedCategory === 'all') {
      return categoryOrder.flatMap((cat) => grouped[cat] || EMPTY_ARRAY);
    }
    return grouped[selectedCategory] || EMPTY_ARRAY;
  }, [selectedCategory, grouped]);

  const totalCount = useMemo(() => {
    return Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
  }, [grouped]);

  return (
    <section id="catalogue" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{titleText}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{subtitleText}</p>
        </div>

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
            const count = (grouped[cat] || EMPTY_ARRAY).length;
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

        {displayedImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedImages.map((img, i) => {
              const imgCategory = img.name.lastIndexOf('-') > 0 
                ? img.name.slice(0, img.name.lastIndexOf('-')) 
                : img.name;
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