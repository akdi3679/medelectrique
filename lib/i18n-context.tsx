"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "fr" | "ar" | "en";
type Translations = { [key: string]: any };

type I18nContextType = { language: Language; t: Translations; isLoaded: boolean };
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Fallback minimal au cas où le JSON échoue complètement
const FALLBACK: Translations = {
  nav: { services: "Services", projects: "Projets", testimonials: "Témoignages", contact: "Contact", booking: "Réserver", quote: "Devis gratuit" },
  hero: { title: "Med Elec", subtitle: "Électricien & climatisation à Tataouine", cta: "Contact" },
  services: { title: "Services", subtitle: "", electrical: { title: "Électricité", desc: "" }, ac: { title: "Climatisation", desc: "" }, repair: { title: "Réparation", desc: "" } },
  process: { title: "Comment ça se passe", subtitle: "", s1t: "Appel", s1d: "", s2t: "Devis", s2d: "", s3t: "Travail", s3d: "", s4t: "Suivi", s4d: "" },
  projects: { title: "Projets", subtitle: "", viewMore: "Voir" },
  stats2: { freeQuote: "Devis gratuit", urgent: "24/7", coverage: "Tunisie", clean: "Travail propre" },
  quote: { title: "Devis", subtitle: "", selectService: "", choosePackage: "", addons: "", basePrice: "Base", total: "Total", request: "WhatsApp", warranty: "", maintenance: "", emergency: "", disclaimer: "", services: { electrical: "", ac: "", repair: "" }, options: { electrical: ["", "", ""], ac: ["", "", ""], repair: ["", "", ""] } },
  booking: { bookAppointment: "Réservation", description: "", fullName: "Nom", email: "Email", phone: "Tél", serviceType: "Service", preferredDate: "Date", preferredTime: "Heure", confirmBooking: "Confirmer", successMessage: "OK", maintenance: "", installation: "", emergencyRepair: "", inspection: "", yourName: "", yourEmail: "" },
  bio: { title: "Mohammed Kadi", subtitle: "", paragraph1: "", paragraph2: "", paragraph3: "" },
  testimonials: { title: "Témoignages", subtitle: "" },
  contact: { title: "Contact", subtitle: "", name: "Nom", email: "Email", phone: "Tél", message: "Message", send: "WhatsApp", yourName: "", yourEmail: "", yourMessage: "", address: "Adresse", reason: "Motif", reasons: { electrical: "", ac: "", repair: "", other: "" } },
  hours: { title: "Horaires", week: "Lun–Sam 8h–18h", sun: "Dim: fermé", emergency: "Urgences 24/7" },
  map: { title: "Zone", zone: "Toute la Tunisie" },
  footer: { rights: "©", tagline: "", company: "", about: "", certifications: "", follow: "", privacy: "", terms: "" },
};

export function LanguageProvider({ children, initialLanguage }: { children: ReactNode; initialLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage ?? "fr");
  const [t, setT] = useState<Translations>(FALLBACK);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => setLanguage(initialLanguage ?? "fr"), [initialLanguage]);

  useEffect(() => {
    if (!language) return;
    setIsLoaded(false);
    fetch(`/locales/${language}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!data || typeof data !== "object") throw new Error("invalid");
        setT(data);
        setIsLoaded(true);
      })
      .catch((e) => {
        console.warn(`i18n: locale "${language}" échouée (${e.message}), fallback utilisé`);
        setT(FALLBACK);
        setIsLoaded(true); // ← CLÉ : même en fallback, on affiche
      });
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return <I18nContext.Provider value={{ language, t, isLoaded }}>{children}</I18nContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}