"use client";
import type React from "react";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { coordonees } from "@/data/coordonees";
import { useLanguage } from "@/lib/i18n-context";
import { useRateLimit } from "@/hooks/useRateLimit";
import { toast } from "./Toaster";
import VoiceRecorder from "./VoiceRecorder";

export default function Contact() {
  const { t, language, isLoaded } = useLanguage();
  const { canSubmit, record, retryIn } = useRateLimit(3, 5 * 60 * 1000);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", reason: "electrical", message: "" });
  const [sending, setSending] = useState(false);

  if (!isLoaded) return null;
  const isRTL = language === "ar";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) {
      toast(`Trop de messages. Réessayez dans ${retryIn}s.`, "error");
      return;
    }
    if (sending) return;
    setSending(true);

    const motif = t.contact.reasons[formData.reason as keyof typeof t.contact.reasons] || formData.reason;
    const text = `🔔 *Nouveau contact Med Elec*\n\n*Nom:* ${formData.name}\n*Tél:* ${formData.phone}\n*Email:* ${formData.email}\n*Motif:* ${motif}\n\n*Message:*\n${formData.message}`;

    try {
  // ✅ FormData au lieu de JSON
  const formDataToSend = new FormData();
  formDataToSend.append("text", text);
  if (audioBlob) formDataToSend.append("audio", audioBlob, audioName);

  const res = await fetch("https://flat-mud-4ba6.kadiexperience3.workers.dev", {
    method: "POST",
    body: formDataToSend,
    // Pas de Content-Type header : le navigateur le met automatiquement avec boundary
  });

  if (res.ok) {
    record();
    setFormData({ name: "", email: "", phone: "", reason: "electrical", message: "" });
    setAudioBlob(null);
    setAudioName("");
    toast(t.contact?.sentOk || "Message envoyé !");
  } else if (res.status === 429) {
    toast("Trop de messages. Réessayez dans 5 min.", "error");
  } else {
    toast("Erreur — réessayez.", "error");
  }
} finally {
  setSending(false);
}
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
                className="w-full px-4 py-3 bg-card text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">{t.contact.email}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.contact.yourEmail}
                className="w-full px-4 py-3 bg-card text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">{t.contact.phone}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+216 XX XXX XXX"
                className="w-full px-4 py-3 bg-card text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
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
              <label className="block text-sm font-semibold mb-2 text-foreground">{t.contact.message}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.contact.yourMessage}
                rows={4}
                className="w-full px-4 py-3 bg-card text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                required
              />
            </div>
            <div>
  <label className="block text-sm font-semibold mb-2 text-foreground">Message vocal (optionnel)</label>
  <VoiceRecorder onAudioReady={(b, n) => { setAudioBlob(b); setAudioName(n); }} />
</div>
            <button
              type="submit"
              disabled={sending || retryIn > 0}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Envoi..." : t.contact.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}