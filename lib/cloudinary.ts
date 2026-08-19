// lib/cloudinary.ts
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du0frvxjo';

interface Opts {
  w?: number;
  h?: number;
  ar?: string;
  crop?: 'fill' | 'limit' | 'thumb' | 'scale';
}

export function cdn(publicId: string, opts: Opts = {}): string {
  const { w = 1200, h, ar, crop = 'fill' } = opts;
  const transforms = [
    'f_auto',
    'q_auto',
    `c_${crop}`,
    `w_${w}`,
    h ? `h_${h}` : '',
    ar ? `ar_${ar}` : '',
  ].filter(Boolean).join(',');
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms}/${publicId}`;
}