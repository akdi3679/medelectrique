// lib/validation.ts
import { z } from 'zod';

// ⭐ Schémas de validation
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

// ⭐⭐⭐ CORRIGÉ : accepte les paramètres de codec
export const audioSchema = z.object({
  size: z.number()
    .min(1, 'Audio file is empty')
    .max(10 * 1024 * 1024, 'Audio file too large (max 10MB)'),
  
  // ⭐ Accepte "audio/webm" ET "audio/webm;codecs=opus"
  type: z.string()
    .regex(/^audio\/(webm|ogg|mp4|mpeg|wav|x-m4a|aac)(;.*)?$/, 'Invalid audio format')
    .or(z.literal('')), // ⭐ Accepte vide (certains navigateurs ne donnent pas le type)
});

export type ContactData = z.infer<typeof contactSchema>;
export type BookingData = z.infer<typeof bookingSchema>;