"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { t, language, isLoaded } = useLanguage();
const { siteImg } = useBrandMedia();

  useEffect(() => setIsMounted(true), []);
  if (!isMounted || !isLoaded) return null;

  const isRTL = language === "ar";

  return (
    <nav className={`fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo image */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
  src={siteImg.favicon || '/logo.png'}  // ← fallback sur /logo.png si pas encore uploadé
  alt="Med Elec"
  className="w-10 h-10 rounded-lg object-contain group-hover:scale-110 transition-transform"
/>
            <span className="font-semibold text-lg hidden sm:inline">Med Elec</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            <Link href="#services" className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium">{t.nav.services}</Link>
            <Link href="#projects" className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium">{t.nav.projects}</Link>
            <Link href="#testimonials" className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium">{t.nav.testimonials}</Link>
            <Link href="#contact" className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium">{t.nav.contact}</Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <LanguageSwitcher />
            <Link href="#booking" className="px-2 py-1.5 text-foreground/70 hover:text-foreground transition-colors font-medium border border-border rounded-lg hover:bg-muted text-xs whitespace-nowrap">
              {t.nav.booking}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in-up">
            <Link href="#services" className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors">{t.nav.services}</Link>
            <Link href="#projects" className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors">{t.nav.projects}</Link>
            <Link href="#testimonials" className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors">{t.nav.testimonials}</Link>
            <Link href="#contact" className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors">{t.nav.contact}</Link>
            <div className="px-4 py-2"><LanguageSwitcher /></div>
            <Link href="#booking" className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors font-medium">{t.nav.booking}</Link>
          </div>
        )}
      </div>
    </nav>
  );
}