import Home from "@/components/Home";
import type { Language } from "@/lib/i18n-context";

export function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }, { lang: "ar" }];
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const titles: Record<string, string> = {
    fr: "Med Elec — Électricien à Tataouine | Installation, Climatisation, Réparation",
    en: "Med Elec — Electrician in Tataouine | Installation, AC, Repair",
    ar: "Med Elec — كهربائي في تطاوين | تركيب كهربائي، تكييف، إصلاح",
  };
  return { title: titles[lang] ?? titles.fr };
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const valid: Language = (["fr", "en", "ar"] as Language[]).includes(lang as Language) ? (lang as Language) : "fr";
  return <Home lang={valid} />;
}