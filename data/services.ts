// data/services.ts
// ⭐ Data pure : structure seulement, zéro texte, zéro icône
// Les IDs servent de clé pour récupérer les traductions dans i18n

export type ServiceId = 'electrical' | 'ac' | 'repair';

export interface ServiceStructure {
  id: ServiceId;
  order: number; // Pour contrôler l'ordre d'affichage
}

export const services: ServiceStructure[] = [
  { id: 'electrical', order: 1 },
  { id: 'ac', order: 2 },
  { id: 'repair', order: 3 },
];

// ⭐ Ordre d'affichage (trié par order)
export const servicesOrdered = [...services].sort((a, b) => a.order - b.order);