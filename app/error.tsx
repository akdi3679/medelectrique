"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-destructive" size={32} />
        </div>
        <h1 className="text-2xl font-semibold mb-2">
          Une erreur est survenue · Something went wrong · حدث خطأ ما
        </h1>
        <p className="text-foreground/70 mb-8">
          Essayez de recharger la page. · Try reloading the page. · جرّب إعادة تحميل الصفحة.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold">
            Réessayer · Retry · إعادة المحاولة
          </button>
          <button onClick={() => (window.location.href = "/fr")} className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold">
            Accueil · Home · الرئيسية
          </button>
        </div>
      </div>
    </main>
  );
}