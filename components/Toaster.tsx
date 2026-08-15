"use client";
import { useEffect, useState } from "react";

type Toast = { id: number; text: string; type: "success" | "error" };

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { text, type } = (e as CustomEvent).detail;
      const id = Date.now() + Math.random();
      setToasts((p) => [...p, { id, text, type }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
    };
    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast pointer-events-auto px-5 py-3 rounded-xl shadow-lg border backdrop-blur-md min-w-[260px] ${
            t.type === "success"
              ? "bg-primary text-primary-foreground border-primary/30"
              : "bg-destructive text-destructive-foreground border-destructive/30"
          }`}
        >
          <p className="text-sm font-medium">{t.text}</p>
        </div>
      ))}
    </div>
  );
}

export function toast(text: string, type: "success" | "error" = "success") {
  window.dispatchEvent(new CustomEvent("toast", { detail: { text, type } }));
}