"use client";
import { FileCheck, Siren, MapPin, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

export default function Stats() {
  const { t, language, isLoaded } = useLanguage();
  if (!isLoaded) return null;
  const isRTL = language === "ar";

  const items = [
    { icon: FileCheck, label: t.stats2.freeQuote },
    { icon: Siren, label: t.stats2.urgent },
    { icon: MapPin, label: t.stats2.coverage },
    { icon: ShieldCheck, label: t.stats2.clean },
  ];

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <Icon className="mx-auto mb-3 opacity-90" size={30} />
              <div className="font-semibold">{s.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}