// lib/validation.ts
import { z } from 'zod';

// ⭐ Schémas Zod partagés entre client et serveur
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name too short')
    .max(100, 'Name too long')
    .regex(/^[^<>]*$/, 'Invalid characters'),
  
  email: z.string()
    .email('Invalid email')
    .max(254, 'Email too long'),
  
  phone: z.string()
    .regex(/^[\d\s+()-]{8,20}$/, 'Invalid phone')
    .optional()
    .or(z.literal('')),
  
  reason: z.enum(['electrical', 'ac', 'repair', 'other']),
  
  message: z.string()
    .max(2000, 'Message too long')
    .optional()
    .or(z.literal('')),
});

export const bookingSchema = z.object({
  name: z.string()
    .min(2, 'Name too short')
    .max(100, 'Name too long')
    .regex(/^[^<>]*$/, 'Invalid characters'),
  
  email: z.string()
    .email('Invalid email')
    .max(254, 'Email too long'),
  
  phone: z.string()
    .regex(/^[\d\s+()-]{8,20}$/, 'Invalid phone'),
  
  service: z.enum(['maintenance', 'installation', 'repair', 'inspection']),
  
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')
    .optional()
    .or(z.literal('')),
  
  time: z.string()
    .regex(/^\d{2}:\d{2}$/, 'Invalid time')
    .optional()
    .or(z.literal('')),
  
  notes: z.string()
    .max(2000, 'Notes too long')
    .optional()
    .or(z.literal('')),
});

// ⭐ Validation audio (server-side)
export const audioSchema = z.object({
  size: z.number().max(10 * 1024 * 1024, 'Audio file too large (max 10MB)'),
  type: z.string().regex(/^audio\/(webm|ogg|mp4|mpeg|wav)$/, 'Invalid audio format'),
});

export type ContactData = z.infer<typeof contactSchema>;
export type BookingData = z.infer<typeof bookingSchema>;