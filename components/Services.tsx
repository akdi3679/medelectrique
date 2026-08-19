"use client";
import { Zap, AirVent, Wrench, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { serviceIds, type ServiceId } from "@/data/services";

// ⭐ Map des icônes — logique UI dans le composant, pas dans data
const serviceIcons: Record<ServiceId, LucideIcon> = {
  electrical: Zap,
  ac: AirVent,
  repair: Wrench,
};

export default function Services() {
  const { t, language, isLoaded } = useLanguage();
  if (!isLoaded) return null;
  const isRTL = language === "ar";

  return (
    <section id="services" className={`py-20 px-4 sm:px-6 lg:px-8 bg-background ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.services.title}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{t.services.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {serviceIds.map((serviceId, index) => {
            const Icon = serviceIcons[serviceId];
            const serviceText = t.services[serviceId as keyof typeof t.services];
            
            return (
              <div 
                key={serviceId} 
                className="group p-8 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {serviceText?.title || serviceId}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {serviceText?.desc || ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}