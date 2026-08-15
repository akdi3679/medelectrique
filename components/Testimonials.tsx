"use client";
import { Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

const testimonials = [
  {
    name: "Ahmed Hassan", role: { fr: "Propriétaire d'entreprise", en: "Business Owner", ar: "صاحب عمل" },
    content: {
      fr: "Professionnel, fiable et incroyablement efficace. Notre installation électrique a été terminée avant le délai.",
      en: "Professional, reliable, and incredibly efficient. Our electrical system was completed ahead of schedule.",
      ar: "محترفون وموثوقون وفعالون بشكل لا يصدق. اكتمل نظامنا الكهربائي قبل الموعد.",
    },
  },
  {
    name: "Fatima Bouali", role: { fr: "Propriétaire de maison", en: "Homeowner", ar: "مالكة منزل" },
    content: {
      fr: "L'équipe de climatisation était compétente et courtoise. Installation propre et rapide, je recommande !",
      en: "The AC team was knowledgeable and courteous. Clean and fast installation, I recommend!",
      ar: "فريق التكييف كان متمكنًا ومهذبًا. تركيب نظيف وسريع، أنصح بهم!",
    },
  },
  {
    name: "Mohamed Saidi", role: { fr: "Gérant d'usine", en: "Factory Manager", ar: "مدير مصنع" },
    content: {
      fr: "Service exceptionnel et vraie expertise technique. La réparation d'urgence a sauvé notre production.",
      en: "Outstanding service and technical expertise. The emergency repair saved our production.",
      ar: "خدمة استثنائية وخبرة تقنية حقيقية. الإصلاح الطارئ أنقذ إنتاجنا.",
    },
  },
];

export default function Testimonials() {
  const { t, language, isLoaded } = useLanguage();
  if (!isLoaded) return null;
  const isRTL = language === "ar";
  const set = testimonials.concat(testimonials);

  return (
    <section id="testimonials" className={`py-20 bg-background overflow-hidden ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.testimonials.title}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{t.testimonials.subtitle}</p>
        </div>
      </div>

      <div className="marquee overflow-hidden">
        <div className="marquee-track flex gap-8 px-4 w-max animate-scroll-horizontal" style={{ animationDuration: "30s" }}>
          {set.map((tm, index) => (
            <div key={index} className="w-[340px] flex-shrink-0 p-8 bg-card border border-border rounded-xl hover:border-primary/50 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-primary text-primary" />)}
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed">"{tm.content[language as "fr" | "en" | "ar"]}"</p>
              <p className="font-semibold">{tm.name}</p>
              <p className="text-foreground/60 text-sm">{tm.role[language as "fr" | "en" | "ar"]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}