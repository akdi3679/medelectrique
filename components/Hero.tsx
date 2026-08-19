"use client";
import { ArrowRight, Phone, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useMediaImage } from "@/lib/useMedia";

export default function Hero() {
  const { t, language, isLoaded } = useLanguage();
  // ⭐ ⚠️ Adapte le nom du folder selon Cloudinary
  
  if (!isLoaded) return null;
  const isRTL = language === "ar";

const heroUrl = useMediaImage('hero'); 
  return (
    <section className={`pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance mb-6">{t.hero.title}</h1>
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">{t.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all hover:shadow-lg font-semibold flex items-center justify-center gap-2 group">
                <Calendar size={20} />
                {t.nav.booking}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#contact" className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold flex items-center justify-center gap-2">
                <Phone size={20} />
                {t.nav.contact}
              </a>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              {heroUrl ? (
    <img src={heroUrl} alt={t.hero.imageAlt} fetchPriority="high" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
  )}
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}