"use client";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage, Language } from "@/lib/i18n-context";

export default function LanguageSwitcher() {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const go = (code: Language) => {
    const rest = pathname.replace(/^\/(fr|ar|en)/, "");
    router.push(`/${code}${rest || ""}`);
  };

  const langs: { code: Language; label: string }[] = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "ar", label: "AR" },
  ];

  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => go(l.code)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            language === l.code ? "bg-primary text-primary-foreground" : "bg-background text-foreground/70 hover:text-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}