"use client";
import { useLanguage } from "@/lib/i18n-context";
import { faq, faqStrings } from "@/data/faq";

export default function Faq() {
  const { language, isLoaded } = useLanguage();
  if (!isLoaded) return null;
  const lang = language as "fr" | "en" | "ar";
  const isRTL = lang === "ar";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q[lang],
      acceptedAnswer: { "@type": "Answer", text: f.a[lang] },
    })),
  };

  return (
    <section id="faq" className={`py-20 px-4 sm:px-6 lg:px-8 bg-background ${isRTL ? "rtl" : "ltr"}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{faqStrings.title[lang]}</h2>
          <p className="text-xl text-foreground/70">{faqStrings.subtitle[lang]}</p>
        </div>
        <div className="space-y-4">
          {faq.map((f, i) => (
            <details key={i} className="group bg-card border border-border rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 font-semibold hover:text-primary transition-colors list-none">
                {f.q[lang]}
                <span className="text-primary text-xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-6 pb-6 text-foreground/70 leading-relaxed">{f.a[lang]}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}