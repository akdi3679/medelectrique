"use client";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./social-icons";
import { coordonees } from "@/data/coordonees";

export default function CallButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={`https://wa.me/${coordonees.whatsapp}`}
        target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
      <a
        href={`tel:${coordonees.phoneRaw}`} aria-label="Appeler"
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-glow"
      >
        <Phone size={24} />
      </a>
    </div>
  );
}