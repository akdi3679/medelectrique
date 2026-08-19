// data/catalogue.ts
import { catalogueImages } from './media';

export type Lang = 'fr' | 'en' | 'ar';

export interface CatalogueItem {
  id: string;
  imagePublicId: string;
  title: Record<Lang, string>;
  desire: Record<Lang, string>;
}

export const catalogueStrings = {
  title: { fr: "Idées & Inspiration", en: "Ideas & Inspiration", ar: "أفكار وإلهام" },
  subtitle: {
    fr: "Ce que nous pouvons installer chez vous — choisissez, on s'occupe du reste.",
    en: "What we can install at your place — you pick, we handle the rest.",
    ar: "ما يمكننا تركيبه في منزلك — اختر ونحن نتكفل بالباقي.",
  },
  cta: { fr: "Je veux ça chez moi", en: "I want this at home", ar: "أريد هذا في منزلي" },
};

export const catalogue: CatalogueItem[] = [
  {
    id: 'decorative-lighting',
    imagePublicId: catalogueImages['decorative-lighting'],
    title: { fr: "Éclairage décoratif", en: "Decorative lighting", ar: "إضاءة ديكورية" },
    desire: { fr: "Des suspensions qui transforment vos soirées.", en: "Pendants that transform your evenings.", ar: "أضواء معلقة تحوّل سهراتك." },
  },
  {
    id: 'lamps-fixtures',
    imagePublicId: catalogueImages['lamps-fixtures'],
    title: { fr: "Luminaires & lampes", en: "Lamps & fixtures", ar: "ثريات ومصابيح" },
    desire: { fr: "Une lampe bien placée change toute une pièce.", en: "The right lamp changes the whole room.", ar: "مصباح في المكان الصحيح يغيّر الغرفة كلها." },
  },
  {
    id: 'led-strips',
    imagePublicId: catalogueImages['led-strips'],
    title: { fr: "LED & rubans LED", en: "LED & LED strips", ar: "إضاءة LED" },
    desire: { fr: "Moderne, économique, ambiance garantie.", en: "Modern, efficient, guaranteed mood.", ar: "عصري، موفّر، وأجواء مضمونة." },
  },
  {
    id: 'sockets-switches',
    imagePublicId: catalogueImages['sockets-switches'],
    title: { fr: "Prises & interrupteurs design", en: "Designer sockets & switches", ar: "مفاتيح ومقابس أنيقة" },
    desire: { fr: "Du beau matériel que vous voyez tous les jours.", en: "Beautiful hardware you see every day.", ar: "معدات جميلة تراها كل يوم." },
  },
  {
    id: 'living-room',
    imagePublicId: catalogueImages['living-room'],
    title: { fr: "Ambiance salon", en: "Living-room mood", ar: "أجواء الصالون" },
    desire: { fr: "Un salon éclairé comme dans les magazines.", en: "A living room lit like a magazine.", ar: "صالون مضاء كما في المجلات." },
  },
  {
    id: 'storefronts',
    imagePublicId: catalogueImages['storefronts'],
    title: { fr: "Vitrines & commerces", en: "Stores & storefronts", ar: "المحلات والواجهات" },
    desire: { fr: "Attirez les regards vers votre magasin.", en: "Make eyes turn to your store.", ar: "اجعل الأنظار تتجه إلى محلك." },
  },
];