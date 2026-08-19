"use client";
import { useLanguage } from "@/lib/i18n-context";
import { catalogue as catalogueItems, catalogueStrings } from "@/data/catalogue";
import { coordonees } from "@/data/coordonees";
import { useBrandMedia } from "@/lib/brand-media";

export default function Catalogue() {
  const { language, isLoaded } = useLanguage();
  const { catalogue: mediaCatalogue } = useBrandMedia();
  
  if (!isLoaded) return null;
  const lang = language as "fr" | "en" | "ar";
  const isRTL = lang === "ar";

  return (
    <section id="catalogue" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{catalogueStrings.title[lang]}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{catalogueStrings.subtitle[lang]}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogueItems.map((item, i) => {
            // ⭐ URL réelle depuis Cloudinary (par filename)
            const imgUrl = mediaCatalogue[item.id];
            const wa = encodeURIComponent(`Bonjour Med Elec — ${catalogueStrings.cta[lang]} : ${item.title[lang]}`);
            
            return (
              <div 
                key={item.id} 
                className="group relative overflow-hidden rounded-xl aspect-[4/5] animate-fade-in-up" 
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* ⭐ Image réelle ou placeholder */}
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={item.title[lang]}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                )}
                
                {/* Overlay sombre permanent en bas */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Contenu texte (caché par défaut, visible au hover) */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-2xl font-semibold mb-3">{item.title[lang]}</h3>
                  <p className="text-sm mb-4 leading-relaxed">{item.desire[lang]}</p>
                  <a
                    href={`https://wa.me/${coordonees.whatsapp}?text=${wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-sm text-center"
                  >
                    {catalogueStrings.cta[lang]}
                  </a>
                </div>

                {/* Titre visible sans hover (en bas) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-2xl font-semibold">{item.title[lang]}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}