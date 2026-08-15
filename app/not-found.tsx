import Link from "next/link";
import { Zap } from "lucide-react";
import { coordonees } from "@/data/coordonees";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Zap className="text-primary" size={32} />
        </div>
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-semibold mb-2">
          Page introuvable · Page not found · الصفحة غير موجودة
        </h1>
        <p className="text-foreground/70 mb-8">
          Cette page n'existe pas ou a été déplacée. · This page doesn't exist or was moved. · هذه الصفحة غير موجودة أو تم نقلها.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/fr" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold">
            Accueil · Home · الرئيسية
          </Link>
          <a href={`https://wa.me/${coordonees.whatsapp}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold">
            WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}