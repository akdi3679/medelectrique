// app/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Medelec Error]', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <AlertTriangle className="h-10 w-10 text-accent" />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          Une erreur est survenue
        </h1>
        <p className="mt-4 text-xl text-accent">oups, problème technique</p>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-foreground/70">
          Quelque chose s'est mal passé. Notre équipe a été notifiée.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mx-auto mt-6 max-w-md rounded-lg border border-border bg-card p-4 text-left">
            <summary className="cursor-pointer font-semibold text-foreground">
              Détails techniques
            </summary>
            <pre className="mt-3 overflow-x-auto text-xs text-foreground/70">
              {error.message}
              {'\n\n'}
              {error.digest && `Digest: ${error.digest}`}
            </pre>
          </details>
        )}
        
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-accent"
          >
            <RefreshCw size={18} />
            Réessayer
          </button>
          <a 
            href="/fr" 
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-8 py-3 font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            <Home size={18} />
            Accueil
          </a>
        </div>
      </div>
    </main>
  );
}