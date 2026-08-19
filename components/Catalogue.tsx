"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n-context";
import { catalogue as catalogueItems, categoryOrder, type CategoryId } from "@/data/catalogue";
import { coordonees } from "@/data/coordonees";
import { useMediaImages } from "@/lib/useMedia";

export default function Catalogue() {
  const { t, language, isLoaded } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const images = useMediaImages('catalogue'); 
  if (!isLoaded) return null;
  const lang = language as "fr" | "en" | "ar";
  const isRTL = lang === "ar";

  // ⭐ Filtre par catégorie
  const filteredItems = selectedCategory === 'all'
    ? catalogueItems
    : catalogueItems.filter((item) => item.category === selectedCategory);

  return (
    <section id="catalogue" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.catalogue.title}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{t.catalogue.subtitle}</p>
        </div>

        {/* ⭐ Navigation par catégorie */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          {categoryOrder.map((cat) => {
            const isActive = selectedCategory === cat;
            const catLabel = t.catalogue.categories[cat as keyof typeof t.catalogue.categories] || cat;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-foreground/70 border border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {catLabel}
              </button>
            );
          })}
        </div>

        {/* Grille filtrée */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, i) => {
            const imgUrl = images[item.id];
            const itemText = t.catalogue.items[item.id as keyof typeof t.catalogue.items] as {
              title?: string;
              desire?: string;
            } | undefined;
            
            const wa = encodeURIComponent(
              `Bonjour Med Elec — ${t.catalogue.cta} : ${itemText?.title || item.id}`
            );
            
            return (
              <div 
                key={item.id} 
                className="group relative overflow-hidden rounded-xl aspect-[4/5] animate-fade-in-up" 
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={itemText?.title || item.id}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-2xl font-semibold mb-3">{itemText?.title || item.id}</h3>
                  <p className="text-sm mb-4 leading-relaxed">{itemText?.desire || ""}</p>
                  <a
                    href={`https://wa.me/${coordonees.whatsapp}?text=${wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-sm text-center"
                  >
                    {t.catalogue.cta}
                  </a>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-2xl font-semibold">{itemText?.title || item.id}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message si aucun résultat */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            <p className="text-lg">Aucune image dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}