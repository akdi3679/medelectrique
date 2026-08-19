// data/faq.ts
// ⭐ Data pure : structure seulement, zéro texte traduit
export interface FaqItem {
  id: string;
  order: number;
}

export const faq: FaqItem[] = [
  { id: 'cost-ac', order: 1 },
  { id: 'free-quote', order: 2 },
  { id: 'coverage', order: 3 },
  { id: 'emergency', order: 4 },
  { id: 'client-material', order: 5 },
];