import { z } from 'zod';

/**
 * Validation Schema for creating and updating properties
 */
export const PropertyInputSchema = z.object({
  name: z.string().trim().min(1, 'Property name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  developer: z.string().trim().min(1, 'Developer name is required'),
  city: z.string().trim().min(1, 'City is required'),
  location: z.string().trim().min(1, 'Location is required'),
  listingCity: z.string().optional(),
  locality: z.string().optional(),
  listingFor: z.string().optional(),
  propertyCategory: z.string().optional(),
  propertyType: z.string().optional(),
  categoryFields: z.record(z.string(), z.any()).optional(),
  bedrooms: z.coerce.number().int().nonnegative().optional(),
  bathrooms: z.coerce.number().int().nonnegative().optional(),
  area: z.coerce.number().int().nonnegative().optional(),
  available: z.boolean().default(true),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  videos: z.array(z.string()).optional(),
  showInTopSelling: z.boolean().default(false),
  showInPremium: z.boolean().default(false),
  showInNewlyLaunched: z.boolean().default(false),
  // Highlights
  highlights: z.any().optional(),
  // Overview
  storeys: z.any().optional(),
  projectArea: z.any().optional(),
  possessionStatus: z.any().optional(),
  advertiserReraNumber: z.any().optional(),
  possessionDate: z.any().optional(),
  projectReraNumber: z.any().optional(),
  address: z.any().optional(),
  // Pricing
  pricing: z.any().optional(),
  // Amenities & Facilities
  amenities: z.any().optional(),
  facilities: z.any().optional(),
  // Specifications
  specifications: z.any().optional(),
  // Connectivity
  connectivity: z.any().optional(),
  reraQrCode: z.any().optional(),
});

export type PropertyInput = z.infer<typeof PropertyInputSchema>;

/**
 * Validation Schema for Enquiries & Site Visits
 */
export const EnquiryInputSchema = z.object({
  type: z.enum(['call_back', 'site_visit', 'presentation', 'contact', 'general']).or(z.string().min(1)),
  customer: z.object({
    name: z.string().trim().min(1, 'Customer name is required'),
    email: z.string().trim().email('A valid email address is required').optional().or(z.literal('')),
    phone: z.string().trim().min(5, 'A valid phone number is required'),
  }),
  propertyName: z.string().optional(),
  items: z.array(z.any()).optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type EnquiryInput = z.infer<typeof EnquiryInputSchema>;
