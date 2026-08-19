"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, Language } from "@/lib/i18n-context";

const LANGS: { code: Language; label: string; short: string }[] = [
  { code: "fr", label: "Français", short: "FR" },
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "العربية", short: "ع" },
];

export default function LanguageSwitcher() {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGS.find((l) => l.code === language) || LANGS[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const go = (code: Language) => {
    const rest = pathname.replace(/^\/(fr|ar|en)/, "");
    router.push(`/${code}${rest || ""}`);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Change language"
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
      >
        <Globe size={16} className="text-foreground/70" />
        <span className={`text-sm font-medium ${current.code === "ar" ? "font-arabic" : ""}`}>
          {current.short}
        </span>
        <ChevronDown
          size={14}
          className={`text-foreground/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-border bg-card shadow-lg overflow-hidden z-50 animate-fade-in"
        >
          {LANGS.map((l) => {
            const isActive = l.code === language;
            return (
              <button
                key={l.code}
                role="option"
                aria-selected={isActive}
                onClick={() => go(l.code)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                } ${l.code === "ar" ? "font-arabic" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex w-7 h-7 items-center justify-center rounded-md text-xs font-bold ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-foreground/70"
                    }`}
                  >
                    {l.short}
                  </span>
                  <span className="font-medium">{l.label}</span>
                </div>
                {isActive && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}