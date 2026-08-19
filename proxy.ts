// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limit global
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = {
  windowMs: 60_000, // 1 minute
  maxRequests: 30, // 30 requêtes par minute par IP
};

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_LIMIT.windowMs });
    return false;
  }
  
  if (entry.count >= RATE_LIMIT.maxRequests) {
    return true;
  }
  
  entry.count++;
  return false;
}

// ⭐ Security headers pour toutes les réponses
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
  return response;
}

export function proxy(request: NextRequest) {
  const ip = getClientIp(request);
  
  // ⭐ Bloquer les IPs trop agressives
  if (isRateLimited(ip)) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation images)
     * - favicon.ico
     * - public files (.png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};