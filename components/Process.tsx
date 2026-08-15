"use client";
import { PhoneCall, ClipboardCheck, Wrench, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

export default function Process() {
  const { t, language, isLoaded } = useLanguage();
  if (!isLoaded) return null;
  
  const isRTL = language === "ar";
  
  const steps = [
    { icon: PhoneCall, title: t.process.s1t, desc: t.process.s1d },
    { icon: ClipboardCheck, title: t.process.s2t, desc: t.process.s2d },
    { icon: Wrench, title: t.process.s3t, desc: t.process.s3d },
    { icon: ShieldCheck, title: t.process.s4t, desc: t.process.s4d },
  ];

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.process.title}</h2>
          <p className="text-xl text-foreground/70">{t.process.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="relative p-8 bg-card border border-border rounded-xl text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="absolute top-4 left-4 text-5xl font-bold text-primary/10">{i + 1}</span>
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-primary" size={26} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}