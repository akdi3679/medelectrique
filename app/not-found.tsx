// app/not-found.tsx
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
          <div className="text-center">
            <h1 className="text-[120px] font-bold leading-none text-primary md:text-[180px]">
              404
            </h1>
            <p className="mt-4 text-4xl font-semibold text-accent">page introuvable</p>
            <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-foreground/70">
              Cette route n'existe pas ou a été déplacée.
            </p>
            
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/fr"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-accent"
              >
                <Home size={18} />
                Retour à l'accueil
              </Link>
              <Link
                href="javascript:history.back()"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-8 py-3 font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                <ArrowLeft size={18} />
                Page précédente
              </Link>
            </div>

            {/* Liens vers les 3 langues */}
            <div className="mt-8 flex justify-center gap-4 text-sm">
              <Link href="/fr" className="text-foreground/60 hover:text-primary">Français</Link>
              <span className="text-foreground/30">•</span>
              <Link href="/en" className="text-foreground/60 hover:text-primary">English</Link>
              <span className="text-foreground/30">•</span>
              <Link href="/ar" className="text-foreground/60 hover:text-primary">العربية</Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}