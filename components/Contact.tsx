"use client";
import type React from "react";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, AlertCircle } from "lucide-react";
import { coordonees } from "@/data/coordonees";
import { useLanguage } from "@/lib/i18n-context";
import { useRateLimit } from "@/hooks/useRateLimit";
import { toast } from "./Toaster";
import VoiceRecorder from "./VoiceRecorder";

// ⭐ Validation enterprise-grade
const VALIDATORS = {
  name: (v: string) => v.trim().length >= 2 && v.trim().length <= 100,
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: (v: string) => v === "" || /^[\d\s+()-]{8,20}$/.test(v),
  message: (v: string) => v.trim().length <= 2000,
};

// ⭐ Sanitize pour éviter les injections
function sanitize(str: string): string {
  return str
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .trim()
    .slice(0, 2000);
}

export default function Contact() {
  const { t, language, isLoaded } = useLanguage();
  const { canSubmit, record, retryIn } = useRateLimit(3, 5 * 60 * 1000);
  const [audioDuration, setAudioDuration] = useState(0);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    reason: "electrical", 
    message: "" 
  });
  const [sending, setSending] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioName, setAudioName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isLoaded) return null;
  const isRTL = language === "ar";
  const lang = language as "fr" | "en" | "ar";

  // ⭐ Exclusivité : si texte tapé → bloque vocal
  const hasText = formData.message.trim().length > 0;
  // ⭐ Exclusivité : si vocal enregistré → bloque texte
  const hasAudio = audioBlob !== null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!VALIDATORS.name(formData.name)) {
      newErrors.name = lang === "fr" ? "Nom invalide" : lang === "ar" ? "اسم غير صالح" : "Invalid name";
    }
    if (!VALIDATORS.email(formData.email)) {
      newErrors.email = lang === "fr" ? "Email invalide" : lang === "ar" ? "بريد غير صالح" : "Invalid email";
    }
    if (!VALIDATORS.phone(formData.phone)) {
      newErrors.phone = lang === "fr" ? "Téléphone invalide" : lang === "ar" ? "هاتف غير صالح" : "Invalid phone";
    }
    if (!VALIDATORS.message(formData.message) && !hasAudio) {
      newErrors.message = lang === "fr" 
        ? "Message ou vocal requis" 
        : lang === "ar" 
          ? "الرسالة أو الصوت مطلوب" 
          : "Message or voice required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (!canSubmit()) {
      toast(
        lang === "fr" 
          ? `Trop de messages. Réessayez dans ${retryIn}s.` 
          : lang === "ar" 
            ? `عدد كبير من الرسائل. حاول مرة أخرى خلال ${retryIn} ثانية.` 
            : `Too many messages. Try again in ${retryIn}s.`, 
        "error"
      );
      return;
    }
    
    if (sending) return;
    setSending(true);

    const motif = t.contact.reasons[formData.reason as keyof typeof t.contact.reasons] || formData.reason;
    const text = `🔔 *Nouveau contact Med Elec*\n\n*Nom:* ${sanitize(formData.name)}\n*Tél:* ${sanitize(formData.phone)}\n*Email:* ${sanitize(formData.email)}\n*Motif:* ${motif}\n\n*Message:*\n${sanitize(formData.message) || "(message vocal joint)"}`;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("text", text);
if (audioBlob) {
  formDataToSend.append("audio", audioBlob, audioName);
  formDataToSend.append("audioDuration", String(audioDuration));
}
      const res = await fetch(process.env.NEXT_PUBLIC_WORKER_URL || "https://flat-mud-4ba6.kadiexperience3.workers.dev", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        record();
        setFormData({ name: "", email: "", phone: "", reason: "electrical", message: "" });
        setAudioBlob(null);
        setAudioName("");
        setErrors({});
        toast(t.contact?.sentOk || (lang === "fr" ? "Message envoyé !" : lang === "ar" ? "تم الإرسال!" : "Sent!"));
      } else if (res.status === 429) {
        toast(
          lang === "fr" ? "Trop de messages. Réessayez dans 5 min." : lang === "ar" ? "رسائل كثيرة. حاول بعد 5 دقائق." : "Too many messages. Try in 5 min.", 
          "error"
        );
      } else {
        toast(
          lang === "fr" ? "Erreur — réessayez." : lang === "ar" ? "خطأ — حاول مرة أخرى." : "Error — try again.", 
          "error"
        );
      }
    } finally {
      setSending(false);
    }
  };

  const errorStrings = {
    fr: { name: "Nom", email: "Email", phone: "Téléphone", message: "Message" },
    en: { name: "Name", email: "Email", phone: "Phone", message: "Message" },
    ar: { name: "الاسم", email: "البريد", phone: "الهاتف", message: "الرسالة" },
  };

  return (
    <section id="contact" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">{t.contact.title}</h2>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">{t.contact.subtitle}</p>

            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <p className="font-semibold mb-1 text-foreground">{t.contact.phone}</p>
                  <a href={`tel:${coordonees.phoneRaw}`} className="text-foreground/70 hover:text-primary transition-colors">
                    {coordonees.phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <p className="font-semibold mb-1 text-foreground">{t.contact.email}</p>
                  <a href={`mailto:${coordonees.email}`} className="text-foreground/70 hover:text-primary transition-colors">
                    {coordonees.email}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <p className="font-semibold mb-1 text-foreground">{t.contact.address}</p>
                  <p className="text-foreground/70">{coordonees.adresse}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-primary" size={24} />
                </div>
                <div>
                  <p className="font-semibold mb-1 text-foreground">{t.hours.title}</p>
                  <p className="text-foreground/70">{t.hours.week}</p>
                  <p className="text-foreground/70">{t.hours.sun}</p>
                  <p className="text-primary font-medium">{t.hours.emergency}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={coordonees.googleMapsEmbed}
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Med Elec — Tataouine"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">{t.contact.name}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.contact.yourName}
                maxLength={100}
                className={`w-full px-4 py-3 bg-card text-foreground border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.name ? "border-red-500" : "border-border"
                }`}
                required
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">{t.contact.email}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.contact.yourEmail}
                maxLength={254}
                className={`w-full px-4 py-3 bg-card text-foreground border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.email ? "border-red-500" : "border-border"
                }`}
                required
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">{t.contact.phone}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+216 XX XXX XXX"
                maxLength={20}
                className={`w-full px-4 py-3 bg-card text-foreground border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.phone ? "border-red-500" : "border-border"
                }`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">{t.contact.reason}</label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-card text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="electrical" className="text-foreground bg-card">{t.contact.reasons.electrical}</option>
                <option value="ac" className="text-foreground bg-card">{t.contact.reasons.ac}</option>
                <option value="repair" className="text-foreground bg-card">{t.contact.reasons.repair}</option>
                <option value="other" className="text-foreground bg-card">{t.contact.reasons.other}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                {t.contact.message} {hasAudio && <span className="text-xs text-foreground/60">({lang === "fr" ? "désactivé car vocal enregistré" : lang === "ar" ? "معطل لأن الصوت مسجل" : "disabled because voice recorded"})</span>}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.contact.yourMessage}
                rows={4}
                maxLength={2000}
                disabled={hasAudio}
                className={`w-full px-4 py-3 bg-card text-foreground border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                  errors.message ? "border-red-500" : "border-border"
                } ${hasAudio ? "opacity-50 cursor-not-allowed" : ""}`}
                required={!hasAudio}
              />
              {errors.message && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.message}
                </p>
              )}
              <p className="text-xs text-foreground/60 mt-1">
                {formData.message.length}/2000
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                {lang === "fr" ? "Message vocal (optionnel)" : lang === "en" ? "Voice message (optional)" : "رسالة صوتية (اختياري)"}
                {hasText && <span className="text-xs text-foreground/60"> ({lang === "fr" ? "effacez le texte" : lang === "ar" ? "امسح النص" : "clear text"})</span>}
              </label>
              <VoiceRecorder 
  onAudioReady={(b, n, d) => { 
    setAudioBlob(b); 
    setAudioName(n);
    setAudioDuration(d || 0);

    if (b && errors.message) {
      setErrors({ ...errors, message: "" });
    }
  }} 
  disabled={hasText}
/>
            </div>
            
            <button
              type="submit"
              disabled={sending || retryIn > 0}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending 
                ? (lang === "fr" ? "Envoi..." : lang === "ar" ? "جارٍ الإرسال..." : "Sending...") 
                : retryIn > 0
                  ? `${lang === "fr" ? "Réessayez dans" : lang === "ar" ? "حاول بعد" : "Retry in"} ${retryIn}s`
                  : t.contact.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}