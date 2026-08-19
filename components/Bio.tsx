"use client";
import { useLanguage } from "@/lib/i18n-context";
import { cdn } from "@/lib/cloudinary";
import { brandImages } from "@/data/media";

export default function Bio() {
  const { t, language, isLoaded } = useLanguage();
  if (!isLoaded) return null;
  const isRTL = language === "ar";

  return (
    <section id="bio" className={`py-20 px-4 sm:px-6 lg:px-8 bg-background ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden">
            <img
              src={cdn(brandImages.bio.publicId, { w: 900, ar: '4:5' })}
              alt={t.bio?.imageAlt || "Mohammed Kadi"}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <p className="text-primary font-semibold mb-2 tracking-wide uppercase text-sm">{t.bio?.subtitle || ""}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">{t.bio?.title || ""}</h2>
          <p className="text-lg text-foreground/70 leading-relaxed mb-4">{t.bio?.paragraph1 || ""}</p>
          <p className="text-lg text-foreground/70 leading-relaxed mb-4">{t.bio?.paragraph2 || ""}</p>
          <p className="text-lg text-foreground/70 leading-relaxed">{t.bio?.paragraph3 || ""}</p>
        </div>
      </div>
    </section>
  );
}