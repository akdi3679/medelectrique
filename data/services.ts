// data/services.ts
export interface ServiceData {
  id: string;
  icon: 'zap' | 'airvent' | 'wrench';
  imagePublicId?: string;
}

export const services: ServiceData[] = [
  {
    id: 'electrical',
    icon: 'zap',
    // imagePublicId: 'medelec/services/electrical', // Optionnel
  },
  {
    id: 'ac',
    icon: 'airvent',
    // imagePublicId: 'medelec/services/ac',
  },
  {
    id: 'repair',
    icon: 'wrench',
    // imagePublicId: 'medelec/services/repair',
  },
];