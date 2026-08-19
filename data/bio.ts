// data/bio.ts
import { brandImages } from './media';

export type Lang = 'fr' | 'en' | 'ar';

export interface BioData {
  imagePublicId: string;
  imageAlt: Record<Lang, string>;
  subtitle: Record<Lang, string>;
  title: Record<Lang, string>;
  paragraphs: Record<Lang, string[]>;
}

export const bio: BioData = {
  imagePublicId: brandImages.bio.publicId,
  imageAlt: brandImages.bio.alt,
  subtitle: {
    fr: "À propos",
    en: "About",
    ar: "من نحن",
  },
  title: {
    fr: "Mohammed Kadi",
    en: "Mohammed Kadi",
    ar: "محمد القاضي",
  },
  paragraphs: {
    fr: [
      "Expert en électricité et climatisation basé à Tataouine.",
      "Plus de 10 ans d'expérience au service des particuliers et des professionnels.",
      "Devis gratuit, travail propre, et garantie sur toutes nos interventions.",
    ],
    en: [
      "Electrical and AC expert based in Tataouine.",
      "Over 10 years of experience serving homeowners and businesses.",
      "Free quotes, clean work, and warranty on all our services.",
    ],
    ar: [
      "خبير في الكهرباء والتكييف مقره تطاوين.",
      "أكثر من 10 سنوات من الخبرة في خدمة الأفراد والشركات.",
      "عروض أسعار مجانية، عمل نظيف، وضمان على جميع خدماتنا.",
    ],
  },
};