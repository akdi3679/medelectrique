// data/media.ts
export const cloudinaryConfig = {
  cloudName: 'du0frvxjo',
  folders: {
    siteImg: 'medelec/site-img',
    catalogue: 'medelec/catalogue',
    projects: 'medelec/projects',
    services: 'medelec/services',
  },
};

// ⭐ Images fixes (public IDs Cloudinary)
export const brandImages = {
  hero: {
    publicId: 'medelec/site-img/hero',
    alt: {
      fr: 'Installation électrique professionnelle à Tataouine',
      en: 'Professional electrical installation in Tataouine',
      ar: 'تركيب كهربائي احترافي في تطاوين',
    },
  },
  bio: {
    publicId: 'medelec/site-img/bio',
    alt: { fr: 'Mohammed Kadi', en: 'Mohammed Kadi', ar: 'محمد القاضي' },
  },
  favicon: { publicId: 'medelec/site-img/favicon' },
};

// ⭐ Images catalogue
export const catalogueImages = {
  'decorative-lighting': 'medelec/catalogue/decorative-lighting',
  'lamps-fixtures': 'medelec/catalogue/lamps-fixtures',
  'led-strips': 'medelec/catalogue/led-strips',
  'sockets-switches': 'medelec/catalogue/sockets-switches',
  'living-room': 'medelec/catalogue/living-room',
  'storefronts': 'medelec/catalogue/storefronts',
};