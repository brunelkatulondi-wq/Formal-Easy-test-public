import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(6).max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const dossierCreateSchema = z.object({
  companyName: z.string().min(2),
  legalForm: z.string().min(2),
  activityDescription: z.string().min(5).optional(),
  socialObject: z.string().min(5).optional(),
  capital: z.coerce.number().int().min(0).optional(),
  diaspora: z.boolean().optional(),
  pack: z.enum(['ESSENTIEL', 'CONFORT', 'PREMIUM']),
  city: z.string().optional(),
});

export const dossierSignSchema = z.object({
  signature: z.string().min(2),
});

export const paymentCreateSchema = z.object({
  dossierId: z.string().uuid(),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['PAY_PENDING', 'GUCE_DEPOSIT', 'DONE', 'SIGNED_BY_CLIENT', 'READY_FOR_SIGNATURE', 'DRAFT']),
});

export const addDocumentSchema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
});

export const chatSendSchema = z.object({
  dossierId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

export const aiGenerateSchema = z.object({
  activityDescription: z.string().min(10),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const dossierIdParamSchema = z.object({
  dossierId: z.string().uuid(),
});
