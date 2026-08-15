"use client";
import type React from "react";
import { useState } from "react";
import { Clock, User, Phone, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useRateLimit } from "@/hooks/useRateLimit";
import { toast } from "./Toaster";

export default function BookingSystem() {
  const { t, language, isLoaded } = useLanguage();
  const { canSubmit, record, retryIn } = useRateLimit(3, 5 * 60 * 1000);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "maintenance",
    date: "",
    time: "",
  });
  const [sending, setSending] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  if (!isLoaded) return null;
  const isRTL = language === "ar";

  const services = [
    { id: "maintenance", label: t.booking.maintenance },
    { id: "installation", label: t.booking.installation },
    { id: "repair", label: t.booking.emergencyRepair },
    { id: "inspection", label: t.booking.inspection },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) {
      toast(`Trop de demandes. Réessayez dans ${retryIn}s.`, "error");
      return;
    }
    if (sending) return;
    setSending(true);

    const svc = services.find((s) => s.id === formData.service)?.label || formData.service;
    const scheduleText = showSchedule && formData.date
      ? `\n*Date:* ${formData.date} à ${formData.time}`
      : "\n*Disponibilité:* le plus tôt possible";

    const text = `🔔 *Réservation Med Elec*\n\n*Nom:* ${formData.name}\n*Tél:* ${formData.phone}\n*Service:* ${svc}${scheduleText}`;

    try {
      const res = await fetch("https://flat-mud-4ba6.kadiexperience3.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        record();
        setFormData({ name: "", email: "", phone: "", service: "maintenance", date: "", time: "" });
        setShowSchedule(false);
        toast(t.booking.successMessage);
      } else if (res.status === 429) {
        toast("Trop de demandes. Réessayez dans 5 min.", "error");
      } else {
        toast("Erreur — réessayez.", "error");
      }
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
                  className="w-full px-4 py-3 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
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
                  className="w-full px-4 py-3 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
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
                    <option key={svc.id} value={svc.id} className="text-foreground bg-background">
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

            <button
              type="submit"
              disabled={sending || retryIn > 0}
              className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Envoi..." : t.booking.confirmBooking}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}