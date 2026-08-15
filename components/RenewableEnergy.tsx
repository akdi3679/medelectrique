"use client";
import { Sun, Leaf, TrendingDown, Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

export default function RenewableEnergy() {
  const { t, language, isLoaded } = useLanguage();
  if (!isLoaded) return null;
  const isRTL = language === "ar";

  const benefits = [
    { icon: Sun, title: t.renewable.solar.title, description: t.renewable.solar.desc },
    { icon: Leaf, title: t.renewable.eco.title, description: t.renewable.eco.desc },
    { icon: TrendingDown, title: t.renewable.costs.title, description: t.renewable.costs.desc },
    { icon: Zap, title: t.renewable.independence.title, description: t.renewable.independence.desc },
  ];

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.renewable.title}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{t.renewable.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="p-8 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-primary text-primary-foreground rounded-2xl p-12 text-center animate-fade-in-up">
          <h3 className="text-3xl font-bold mb-4">{t.renewable.ctaTitle}</h3>
          <p className="text-lg mb-8 opacity-90">{t.renewable.ctaDesc}</p>
          <a href="#contact" className="inline-block px-8 py-3 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-colors font-semibold">
            {t.renewable.ctaButton}
          </a>
        </div>
      </div>
    </section>
  );
}