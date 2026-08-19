"use client";
import type React from "react";
import { useState } from "react";
import { Clock, User, Phone, Calendar, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { toast } from "./Toaster";
import VoiceRecorder from "./VoiceRecorder";
import { bookingSchema } from "@/lib/validation";

export default function BookingSystem() {
  const { t, language, isLoaded } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "maintenance" as const,
    date: "",
    time: "",
    notes: "",
  });
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioName, setAudioName] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [sending, setSending] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isLoaded) return null;
  const isRTL = language === "ar";
  const lang = language as "fr" | "en" | "ar";

  const hasText = formData.notes.trim().length > 0;
  const hasAudio = audioBlob !== null;

  const errorMessages = {
    fr: {
      name: "Nom invalide (2-100 caractères)",
      email: "Email invalide",
      phone: "Téléphone invalide",
      notes: "Notes ou vocal requis",
      sending: "Envoi...",
      success: "Réservation envoyée !",
      error: "Erreur — réessayez.",
      rateLimit: "Trop de demandes. Réessayez dans 5 min.",
      voiceDisabled: "désactivé car vocal enregistré",
      clearText: "effacez le texte",
      voiceOptional: "Message vocal (optionnel)",
    },
    en: {
      name: "Invalid name (2-100 characters)",
      email: "Invalid email",
      phone: "Invalid phone",
      notes: "Notes or voice required",
      sending: "Sending...",
      success: "Booking sent!",
      error: "Error — try again.",
      rateLimit: "Too many requests. Try again in 5 min.",
      voiceDisabled: "disabled because voice recorded",
      clearText: "clear text",
      voiceOptional: "Voice message (optional)",
    },
    ar: {
      name: "اسم غير صالح (2-100 حرف)",
      email: "بريد إلكتروني غير صالح",
      phone: "هاتف غير صالح",
      notes: "الملاحظات أو الصوت مطلوب",
      sending: "جارٍ الإرسال...",
      success: "تم إرسال الحجز!",
      error: "خطأ — حاول مرة أخرى.",
      rateLimit: "طلبات كثيرة. حاول بعد 5 دقائق.",
      voiceDisabled: "معطل لأن الصوت مسجل",
      clearText: "امسح النص",
      voiceOptional: "رسالة صوتية (اختياري)",
    },
  };

  const t_err = errorMessages[lang];

  const services = [
    { id: "maintenance", label: t.booking.maintenance },
    { id: "installation", label: t.booking.installation },
    { id: "repair", label: t.booking.emergencyRepair },
    { id: "inspection", label: t.booking.inspection },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = (): boolean => {
    const dataToValidate = {
      ...formData,
      notes: hasAudio ? "" : formData.notes,
    };

    const validation = bookingSchema.safeParse(dataToValidate);
    
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      
      if (fieldErrors.name) newErrors.name = t_err.name;
      if (fieldErrors.email) newErrors.email = t_err.email;
      if (fieldErrors.phone) newErrors.phone = t_err.phone;
      if (fieldErrors.notes && !hasAudio) newErrors.notes = t_err.notes;
      
      setErrors(newErrors);
      return false;
    }

    if (!hasText && !hasAudio) {
      setErrors({ notes: t_err.notes });
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
      formDataToSend.append("service", formData.service);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("time", formData.time);
      formDataToSend.append("notes", formData.notes);

      if (audioBlob) {
        formDataToSend.append("audio", audioBlob, audioName);
        formDataToSend.append("audioDuration", String(audioDuration));
      }

      const res = await fetch("/api/booking", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        setFormData({ name: "", email: "", phone: "", service: "maintenance", date: "", time: "", notes: "" });
        setShowSchedule(false);
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
      console.error('[booking] Submit error:', err);
      toast(t_err.error, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="booking" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{t.booking.bookAppointment}</h2>
          <p className="text-xl text-foreground/70">{t.booking.description}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <User size={18} />
                  {t.booking.fullName}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.booking.yourName}
                  maxLength={100}
                  className={`w-full px-4 py-3 bg-background text-foreground border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.name ? "border-red-500" : "border-border"
                  }`}
                  required
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <Phone size={18} />
                  {t.booking.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+216 XX XXX XXX"
                  maxLength={20}
                  className={`w-full px-4 py-3 bg-background text-foreground border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.phone ? "border-red-500" : "border-border"
                  }`}
                  required
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-foreground">{t.booking.serviceType}</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <input
                type="checkbox"
                id="showSchedule"
                checked={showSchedule}
                onChange={(e) => setShowSchedule(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="showSchedule" className="flex-1 cursor-pointer font-medium text-foreground">
                {language === "fr" && "Je veux choisir une date et heure précises"}
                {language === "en" && "I want to pick a specific date and time"}
                {language === "ar" && "أريد اختيار تاريخ ووقت محددين"}
              </label>
            </div>

            {showSchedule && (
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
                    <Calendar size={18} />
                    {t.booking.preferredDate}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
                    <Clock size={18} />
                    {t.booking.preferredTime}
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Notes {hasAudio && <span className="text-xs text-foreground/60">({t_err.voiceDisabled})</span>}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder={lang === "fr" ? "Informations supplémentaires..." : lang === "en" ? "Additional information..." : "معلومات إضافية..."}
                rows={4}
                maxLength={2000}
                disabled={hasAudio}
                className={`w-full px-4 py-3 bg-background text-foreground border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                  errors.notes ? "border-red-500" : "border-border"
                } ${hasAudio ? "opacity-50 cursor-not-allowed" : ""}`}
                required={!hasAudio}
              />
              {errors.notes && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.notes}
                </p>
              )}
              <p className="text-xs text-foreground/60 mt-1">
                {formData.notes.length}/2000
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
                  if (b && errors.notes) {
                    setErrors({ ...errors, notes: "" });
                  }
                }}
                disabled={hasText}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? t_err.sending : t.booking.confirmBooking}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}