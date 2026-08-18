// app/global-error.tsx
'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Medelec Critical Error]', error);
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f8fafc', color: '#0f172a' }}>
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 16px' }}>
              Erreur critique
            </h1>
            <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '32px' }}>
              Med Elec rencontre un problème majeur. Veuillez réessayer.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '600',
                background: '#0f172a',
                color: '#f8fafc',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}