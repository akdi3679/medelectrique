// data/catalogue.ts
// ⭐ Data pure : structure + IDs de catégories
export type CategoryId = 'all' | 'lighting' | 'lamps' | 'led' | 'sockets' | 'ambiance' | 'commercial';

export interface CatalogueItem {
  id: string;
  category: CategoryId;
  order: number;
}

export const catalogue: CatalogueItem[] = [
  { id: 'decorative-lighting', category: 'lighting', order: 1 },
  { id: 'lamps-fixtures', category: 'lamps', order: 2 },
  { id: 'led-strips', category: 'led', order: 3 },
  { id: 'sockets-switches', category: 'sockets', order: 4 },
  { id: 'living-room', category: 'ambiance', order: 5 },
  { id: 'storefronts', category: 'commercial', order: 6 },
];

// ⭐ Ordre des catégories dans la navigation
export const categoryOrder: CategoryId[] = [
  'all',
  'lighting',
  'lamps',
  'led',
  'sockets',
  'ambiance',
  'commercial',
];