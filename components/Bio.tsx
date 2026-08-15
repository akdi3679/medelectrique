"use client";
import { useLanguage } from "@/lib/i18n-context";

export default function Bio() {
  const { t, language, isLoaded } = useLanguage();
  if (!isLoaded) return null;
  const isRTL = language === "ar";

  // Debug : si les paragraphes sont vides, affiche un message
  const p1 = t.bio?.paragraph1 || "paragraphe 1 manquant";
  const p2 = t.bio?.paragraph2 || "paragraphe 2 manquant";
  const p3 = t.bio?.paragraph3 || "paragraphe 3 manquant";

  return (
    <section id="bio" className={`py-20 px-4 sm:px-6 lg:px-8 bg-background ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden">
            <img src="/images/mohammed-kadi.jpg" alt="Mohammed Kadi" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <p className="text-primary font-semibold mb-2 tracking-wide uppercase text-sm">{t.bio?.subtitle || "Subtitle"}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">{t.bio?.title || "Title"}</h2>
          <p className="text-lg text-foreground/70 leading-relaxed mb-4">{p1}</p>
          <p className="text-lg text-foreground/70 leading-relaxed mb-4">{p2}</p>
          <p className="text-lg text-foreground/70 leading-relaxed">{p3}</p>
        </div>
      </div>
    </section>
  );
}