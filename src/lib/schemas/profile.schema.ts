/**
 * Zod schemas for profile validation
 * Ensures data integrity for user profile updates
 */

import { z } from "zod";

/**
 * Schema for updating user profile
 * Validates contact information and personal details
 */
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(50, "Phone number must be less than 50 characters").optional(),
  company: z.string().max(100, "Company name must be less than 100 characters").optional(),
  address: z.string().max(200, "Address must be less than 200 characters").optional(),
  city: z.string().max(100, "City must be less than 100 characters").optional(),
  country: z.string().max(100, "Country must be less than 100 characters").optional(),
});

/**
 * Type inferred from the update profile schema
 */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
