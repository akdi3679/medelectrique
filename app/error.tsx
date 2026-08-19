// app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // ⭐ Log ultra-détaillé pour trouver la cause
    console.error('═══════════════════════════════════════');
    console.error('🚨 ERROR BOUNDARY CAUGHT:');
    console.error('Message:', error?.message);
    console.error('Name:', error?.name);
    console.error('Digest:', error?.digest);
    console.error('Stack:', error?.stack);
    console.error('Full error:', error);
    console.error('═══════════════════════════════════════');
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="max-w-2xl w-full bg-red-50 border-2 border-red-500 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-red-700 mb-4">
          🚨 Erreur détectée
        </h1>
        
        <div className="bg-white rounded-lg p-4 mb-4 border border-red-200">
          <p className="text-sm text-gray-600 mb-2">Message :</p>
          <pre className="text-red-600 font-mono text-sm whitespace-pre-wrap break-words">
            {error?.message || 'Aucun message'}
          </pre>
        </div>

        {error?.digest && (
          <div className="bg-white rounded-lg p-4 mb-4 border border-red-200">
            <p className="text-sm text-gray-600 mb-2">Digest :</p>
            <code className="text-sm text-gray-800">{error.digest}</code>
          </div>
        )}

        <div className="bg-white rounded-lg p-4 mb-4 border border-red-200">
          <p className="text-sm text-gray-600 mb-2">Stack trace :</p>
          <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-words max-h-64 overflow-auto">
            {error?.stack || 'Aucun stack'}
          </pre>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800 font-semibold mb-2">
            📋 Action requise :
          </p>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Ouvre la <strong>Console</strong> (F12)</li>
            <li>Copie-colle le message <code>🚨 ERROR BOUNDARY CAUGHT</code></li>
            <li>Envoie-le moi pour le fix exact</li>
          </ol>
        </div>

        <button
          onClick={reset}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          🔄 Réessayer
        </button>
      </div>
    </div>
  );
}