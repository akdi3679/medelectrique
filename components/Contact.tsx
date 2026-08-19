"use client";
import type React from "react";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, AlertCircle } from "lucide-react";
import { coordonees } from "@/data/coordonees";
import { useLanguage } from "@/lib/i18n-context";
import { toast } from "./Toaster";
import VoiceRecorder from "./VoiceRecorder";
import { contactSchema } from "@/lib/validation";

export default function Contact() {
  const { t, language, isLoaded } = useLanguage();
  const [audioDuration, setAudioDuration] = useState(0);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    reason: "electrical" as const, 
    message: "" 
  });
  const [sending, setSending] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioName, setAudioName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isLoaded) return null;
  const isRTL = language === "ar";
  const lang = language as "fr" | "en" | "ar";

  const hasText = formData.message.trim().length > 0;
  const hasAudio = audioBlob !== null;

  const errorMessages = {
    fr: {
      name: "Nom invalide (2-100 caractères)",
      email: "Email invalide",
      phone: "Téléphone invalide",
      message: "Message ou vocal requis",
      required: "Ce champ est requis",
      sending: "Envoi...",
      success: "Message envoyé !",
      error: "Erreur — réessayez.",
      rateLimit: "Trop de messages. Réessayez dans 5 min.",
      voiceDisabled: "désactivé car vocal enregistré",
      clearText: "effacez le texte",
      voiceOptional: "Message vocal (optionnel)",
    },
    en: {
      name: "Invalid name (2-100 characters)",
      email: "Invalid email",
      phone: "Invalid phone",
      message: "Message or voice required",
      required: "This field is required",
      sending: "Sending...",
      success: "Message sent!",
      error: "Error — try again.",
      rateLimit: "Too many messages. Try again in 5 min.",
      voiceDisabled: "disabled because voice recorded",
      clearText: "clear text",
      voiceOptional: "Voice message (optional)",
    },
    ar: {
      name: "اسم غير صالح (2-100 حرف)",
      email: "بريد إلكتروني غير صالح",
      phone: "هاتف غير صالح",
      message: "الرسالة أو الصوت مطلوب",
      required: "هذا الحقل مطلوب",
      sending: "جارٍ الإرسال...",
      success: "تم الإرسال!",
      error: "خطأ — حاول مرة أخرى.",
      rateLimit: "رسائل كثيرة. حاول بعد 5 دقائق.",
      voiceDisabled: "معطل لأن الصوت مسجل",
      clearText: "امسح النص",
      voiceOptional: "رسالة صوتية (اختياري)",
    },
  };

  const t_err = errorMessages[lang];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = (): boolean => {
    // Si pas de texte ET pas d'audio, on ajoute un message vide pour que Zod valide
    const dataToValidate = {
      ...formData,
      message: hasAudio ? "" : formData.message,
    };

    const validation = contactSchema.safeParse(dataToValidate);
    
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      
      if (fieldErrors.name) newErrors.name = t_err.name;
      if (fieldErrors.email) newErrors.email = t_err.email;
      if (fieldErrors.phone) newErrors.phone = t_err.phone;
      if (fieldErrors.message && !hasAudio) newErrors.message = t_err.message;
      
      setErrors(newErrors);
      return false;
    }

    if (!hasText && !hasAudio) {
      setErrors({ message: t_err.message });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (sending) return;
    
    setSending(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("reason", formData.reason);
      formDataToSend.append("message", formData.message);

      if (audioBlob) {
        formDataToSend.append("audio", audioBlob, audioName);
        formDataToSend.append("audioDuration", String(audioDuration));
      }

      // ⭐ Appel à notre route API (pas au worker directement)
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        setFormData({ name: "", email: "", phone: "", reason: "electrical", message: "" });
        setAudioBlob(null);
        setAudioName("");
        setAudioDuration(0);
        setErrors({});
        toast(t_err.success);
      } else if (res.status === 429) {
        toast(t_err.rateLimit, "error");
      } else {
        toast(t_err.error, "error");
      }
    } catch (err) {
      console.error('[contact] Submit error:', err);
      toast(t_err.error, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Colonne gauche - Infos */}
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

          {/* Colonne droite - Formulaire */}
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
                <option value="electrical">{t.contact.reasons.electrical}</option>
                <option value="ac">{t.contact.reasons.ac}</option>
                <option value="repair">{t.contact.reasons.repair}</option>
                <option value="other">{t.contact.reasons.other}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                {t.contact.message} {hasAudio && <span className="text-xs text-foreground/60">({t_err.voiceDisabled})</span>}
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
                {t_err.voiceOptional}
                {hasText && <span className="text-xs text-foreground/60"> ({t_err.clearText})</span>}
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
              disabled={sending}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? t_err.sending : t.contact.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}