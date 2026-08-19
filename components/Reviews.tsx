"use client";
import { useState } from "react";
import { Star, MapPin, TrendingUp, Clock, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { coordonees } from "@/data/coordonees";

const strings = {
  fr: {
    title: "Avis Google",
    subtitle: "Ce que nos clients disent de nous",
    comingSoon: "Bientôt disponible",
    comingSoonDesc: "Nous connectons nos avis Google Maps. Revenez bientôt pour lire les témoignages authentiques de nos clients.",
    averageRating: "Note moyenne",
    reviewsCount: "avis clients",
    responseTime: "Temps de réponse",
    viewOnGoogle: "Voir sur Google Maps",
    stars: "étoiles",
  },
  en: {
    title: "Google Reviews",
    subtitle: "What our clients say about us",
    comingSoon: "Coming soon",
    comingSoonDesc: "We're connecting our Google Maps reviews. Come back soon to read authentic testimonials from our clients.",
    averageRating: "Average rating",
    reviewsCount: "customer reviews",
    responseTime: "Response time",
    viewOnGoogle: "View on Google Maps",
    stars: "stars",
  },
  ar: {
    title: "تقييمات جوجل",
    subtitle: "ماذا يقول عملاؤنا عنا",
    comingSoon: "قريبًا",
    comingSoonDesc: "نقوم بربط تقييمات خرائط جوجل. عُد قريبًا لقراءة شهادات حقيقية من عملائنا.",
    averageRating: "التقييم المتوسط",
    reviewsCount: "تقييمات العملاء",
    responseTime: "وقت الاستجابة",
    viewOnGoogle: "عرض على خرائط جوجل",
    stars: "نجوم",
  },
};

export default function Reviews() {
  const { language, isLoaded } = useLanguage();
  const [showHint, setShowHint] = useState(false);
  
  if (!isLoaded) return null;
  const lang = language as "fr" | "en" | "ar";
  const isRTL = lang === "ar";
  const t = strings[lang];

  // Placeholder stats (à remplacer par vraies données quand l'API est connectée)
  const placeholderStats = {
    average: 4.8,
    count: 0,
    responseTime: "< 2h",
  };

  return (
    <section id="reviews" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <MapPin className="text-primary" size={16} />
            <span className="text-sm font-semibold text-primary">{t.comingSoon}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Stats cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="animate-fade-in-up rounded-2xl border border-border bg-card p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Star className="text-primary fill-primary" size={32} />
            </div>
            <p className="text-4xl font-bold text-foreground mb-2">
              {placeholderStats.average.toFixed(1)}
            </p>
            <p className="text-sm text-foreground/70">{t.averageRating}</p>
          </div>

          <div className="animate-fade-in-up rounded-2xl border border-border bg-card p-8 text-center" style={{ animationDelay: "100ms" }}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <TrendingUp className="text-accent" size={32} />
            </div>
            <p className="text-4xl font-bold text-foreground mb-2">
              {placeholderStats.count}
            </p>
            <p className="text-sm text-foreground/70">{t.reviewsCount}</p>
          </div>

          <div className="animate-fade-in-up rounded-2xl border border-border bg-card p-8 text-center" style={{ animationDelay: "200ms" }}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Clock className="text-primary" size={32} />
            </div>
            <p className="text-4xl font-bold text-foreground mb-2">
              {placeholderStats.responseTime}
            </p>
            <p className="text-sm text-foreground/70">{t.responseTime}</p>
          </div>
        </div>

        {/* Coming soon card */}
        <div 
          className="animate-fade-in-up rounded-2xl border-2 border-dashed border-primary/30 bg-card p-8 md:p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
          style={{ animationDelay: "300ms" }}
          onClick={() => setShowHint(!showHint)}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Star className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">{t.comingSoon}</h3>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 leading-relaxed">
            {t.comingSoonDesc}
          </p>
          
          {showHint && (
            <div className="mb-6 p-4 bg-muted rounded-lg text-sm text-foreground/80">
              💡 {lang === "fr" 
                ? "Pour activer cette section, ajoutez votre clé API Google Maps dans Vercel (GOOGLE_MAPS_API_KEY) et votre Place ID."
                : lang === "en"
                  ? "To enable this section, add your Google Maps API key to Vercel (GOOGLE_MAPS_API_KEY) and your Place ID."
                  : "لتفعيل هذا القسم، أضف مفتاح API لخرائط جوجل في Vercel (GOOGLE_MAPS_API_KEY) ومعرّف المكان الخاص بك."}
            </div>
          )}

          <a
            href={coordonees.googleBusiness || "https://www.google.com/maps"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-accent"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={18} />
            {t.viewOnGoogle}
          </a>
        </div>
      </div>
    </section>
  );
}