// app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// ⭐ URL de base du site (à changer quand le domaine sera connecté)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://medelectrique.vercel.app";
const SITE_NAME = "Med Elec";
const SITE_TAGLINE = "Électricien & climatisation à Tataouine";

// ⭐ Metadata SEO complète
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Installation électrique, climatisation et réparation dans toute la Tunisie. Devis gratuit, urgences 24/7.",
  keywords: [
    "électricien",
    "tataouine",
    "tunisie",
    "climatisation",
    "installation électrique",
    "réparation",
    "devis gratuit",
    "urgence 24/7",
    "électricité",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // ⭐ Icons (tous dans public/)
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
  
  // ⭐ Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "Installation électrique, climatisation et réparation dans toute la Tunisie. Devis gratuit, urgences 24/7.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
        type: "image/jpeg",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "Installation électrique, climatisation et réparation. Devis gratuit, urgences 24/7.",
    images: ["/og-image.jpg"],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  alternates: {
    canonical: SITE_URL,
    languages: {
      fr: `${SITE_URL}/fr`,
      en: `${SITE_URL}/en`,
      ar: `${SITE_URL}/ar`,
    },
  },
  
  // ⭐ À décommenter quand tu auras les codes de vérification
  // verification: {
  //   google: "google-site-verification-code",
  // },
};

// ⭐ JSON-LD Schema.org pour LocalBusiness
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  image: `${SITE_URL}/og-image.jpg`,
  logo: `${SITE_URL}/logo.png`,
  description: "Installation électrique, climatisation et réparation à Tataouine et toute la Tunisie.",
  slogan: SITE_TAGLINE,
  
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tataouine",
    addressCountry: "TN",
  },
  
  geo: {
    "@type": "GeoCoordinates",
    latitude: 32.9299,
    longitude: 10.4500,
  },
  
  url: SITE_URL,
  telephone: "+216XXXXXXXX",  // ← À remplacer par le vrai numéro
  priceRange: "$$",
  
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  
  sameAs: [
    "https://facebook.com/medelec",
    "https://linkedin.com/company/medelec",
  ],
  
  areaServed: {
    "@type": "Country",
    name: "Tunisie",
  },
  
  serviceType: [
    "Installation électrique",
    "Climatisation",
    "Réparation électrique",
    "Dépannage urgence",
    "Éclairage LED",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${arabic.variable} ${jetbrains.variable} font-sans antialiased`}>
        {/* ⭐ JSON-LD pour le SEO structuré */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {children}
        
        {/* ⭐ Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}