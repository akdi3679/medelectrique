import { useState, useCallback, useEffect } from "react";

export function useRateLimit(limit = 3, windowMs = 5 * 60 * 1000) {
  const [submissions, setSubmissions] = useState<number[]>([]);
  const [retryIn, setRetryIn] = useState(0);

  // Met à jour retryIn périodiquement
  useEffect(() => {
    if (submissions.length === 0) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const fresh = submissions.filter((t) => now - t < windowMs);
      
      if (fresh.length >= limit) {
        const oldest = fresh[0];
        const secondsLeft = Math.ceil(((oldest + windowMs) - now) / 1000);
        setRetryIn(Math.max(0, secondsLeft));
      } else {
        setRetryIn(0);
        setSubmissions(fresh);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [submissions, limit, windowMs]);

  const canSubmit = useCallback(() => {
    const now = Date.now();
    const fresh = submissions.filter((t) => now - t < windowMs);
    return fresh.length < limit;
  }, [submissions, limit, windowMs]);

  const record = useCallback(() => {
    setSubmissions((prev) => [...prev, Date.now()]);
  }, []);

  return { canSubmit, record, retryIn };
}