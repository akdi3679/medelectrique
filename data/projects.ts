// data/projects.ts
export type Lang = 'fr' | 'en' | 'ar';

export interface Project {
  id: string;
  title: Record<Lang, string>;
  category: 'Residential' | 'Commercial' | 'Industrial';
  description: Record<Lang, string>;
  imagePublicId: string;
  beforeImagePublicId?: string;
  afterImagePublicId?: string;
}

export const projectsStrings = {
  title: { fr: "Nos Réalisations", en: "Our Projects", ar: "مشاريعنا" },
  subtitle: {
    fr: "Chaque installation raconte une histoire.",
    en: "Every installation tells a story.",
    ar: "كل تركيب يروي قصة.",
  },
  emptyTitle: {
    fr: "Nos projets arrivent bientôt",
    en: "Our projects are coming soon",
    ar: "مشاريعنا قريبًا",
  },
  emptySubtitle: {
    fr: "Nous documentons nos plus belles réalisations. Revenez bientôt pour voir notre travail en images.",
    en: "We're documenting our best work. Come back soon to see our projects in pictures.",
    ar: "نوثّق أفضل أعمالنا. عُد قريبًا لرؤية مشاريعنا بالصور.",
  },
  contactForProjects: {
    fr: "Vous avez un projet ? Parlons-en.",
    en: "Have a project? Let's talk.",
    ar: "لديك مشروع؟ لنتحدث.",
  },
  contactCta: {
    fr: "Nous contacter",
    en: "Contact us",
    ar: "اتصل بنا",
  },
};

// ⭐ Empty : pas de projets bidon
export const projects: Project[] = [];