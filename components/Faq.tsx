"use client";
import { useLanguage } from "@/lib/i18n-context";
import { faq as faqItems } from "@/data/faq";

export default function Faq() {
  const { t, language, isLoaded } = useLanguage();
  if (!isLoaded) return null;
  const lang = language as "fr" | "en" | "ar";
  const isRTL = lang === "ar";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => {
      const faqText = t.faq[item.id as keyof typeof t.faq] as { q?: string; a?: string } | undefined;
      return {
        "@type": "Question",
        name: faqText?.q || "",
        acceptedAnswer: { "@type": "Answer", text: faqText?.a || "" },
      };
    }),
  };

  return (
    <section id="faq" className={`py-20 px-4 sm:px-6 lg:px-8 bg-background ${isRTL ? "rtl" : "ltr"}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.faq.title}</h2>
          <p className="text-xl text-foreground/70">{t.faq.subtitle}</p>
        </div>
        <div className="space-y-4">
          {faqItems.map((item, i) => {
            const faqText = t.faq[item.id as keyof typeof t.faq] as { q?: string; a?: string } | undefined;
            return (
              <details 
                key={item.id} 
                className="group bg-card border border-border rounded-xl overflow-hidden animate-fade-in-up" 
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 font-semibold hover:text-primary transition-colors list-none">
                  {faqText?.q || item.id}
                  <span className="text-primary text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-6 pb-6 text-foreground/70 leading-relaxed">
                  {faqText?.a || ""}
                </p>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}