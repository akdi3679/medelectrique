"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { coordonees } from "@/data/coordonees";
import { FacebookIcon, LinkedinIcon, WhatsAppIcon } from "./social-icons";
import ElectricLine from "./ElectricLine";
import SparkBolt from "./SparkBolt";

type Spark = { id: number; x: number; y: number; angle: number; length: number };

export default function Footer() {
  const { t, language, isLoaded } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);
  if (!isLoaded) return null;
  const isRTL = language === "ar";

  const socials = [
    { icon: FacebookIcon, href: coordonees.reseaux.facebook },
    { icon: LinkedinIcon, href: coordonees.reseaux.linkedin },
    { icon: WhatsAppIcon, href: coordonees.reseaux.whatsapp },
  ];

  // Clic n'importe où (hors liens) → plusieurs petites étincelles aléatoires
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button, input, textarea, select")) return;
    const rect = footerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
// TOUJOURS 2 ou 3, jamais plus
const count = Math.random() < 0.5 ? 2 : 3;

// longueurs un peu plus grandes pour bien traverser le champ de turbulence
const batch: Spark[] = Array.from({ length: count }, (_, i) => ({
  id: Date.now() + Math.random() + i,
  x,
  y,
  angle: Math.random() * 360,          // direction aléatoire garantie
  length: 45 + Math.random() * 45,
}));
    setSparks((prev) => [...prev, ...batch]);
    const ids = batch.map((b) => b.id);
setTimeout(() => setSparks((prev) => prev.filter((s) => !ids.includes(s.id))), 950);
  };

  return (
    <footer
      ref={footerRef}
      onClick={handleClick}
      className={`relative overflow-hidden bg-foreground text-background pt-16 pb-10 px-4 sm:px-6 lg:px-8 ${isRTL ? "rtl" : "ltr"}`}
    >
      {/* Ligne électrique = bordure haute (technique originale) */}
      <ElectricLine />

      {/* Étincelles au clic */}
      {sparks.map((s) => (
<SparkBolt key={s.id} id={s.id} x={s.x} y={s.y} angle={s.angle} length={s.length} />
      ))}

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
           <img
  src="/logo.png"
  alt="Med Elec"
  className="w-10 h-10 rounded-lg object-contain"
/>
            <span className="font-semibold text-lg">{coordonees.nom}</span>
          </div>
          <p className="text-background/70">{t.footer.tagline}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t.nav.services}</h4>
          <ul className="space-y-2 text-background/70">
            <li><Link href="#services" className="hover:text-background transition-colors">{t.services.electrical.title}</Link></li>
            <li><Link href="#services" className="hover:text-background transition-colors">{t.services.ac.title}</Link></li>
            <li><Link href="#services" className="hover:text-background transition-colors">{t.services.repair.title}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t.footer.company}</h4>
          <ul className="space-y-2 text-background/70">
            <li><Link href="#bio" className="hover:text-background transition-colors">{t.footer.about}</Link></li>
            <li><Link href="#projects" className="hover:text-background transition-colors">{t.nav.projects}</Link></li>
            <li><Link href="#testimonials" className="hover:text-background transition-colors">{t.nav.testimonials}</Link></li>
            <li><Link href="#contact" className="hover:text-background transition-colors">{t.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t.footer.follow}</h4>
          <div className="flex gap-4">
            {socials.map((s, i) => {
              const Icon = s.icon;
              return (
                <Link key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background/20 rounded-lg flex items-center justify-center hover:bg-background/30 transition-colors">
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center text-background/70 text-sm">
        <p>&copy; {new Date().getFullYear()} {coordonees.nom}. {t.footer.rights}</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-background transition-colors">{t.footer.privacy}</Link>
          <Link href="#" className="hover:text-background transition-colors">{t.footer.terms}</Link>
        </div>
      </div>
    </footer>
  );
}