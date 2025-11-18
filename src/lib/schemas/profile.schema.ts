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
  billingType: z.enum(["BOLETA", "FACTURA", "AMBOS"]).optional(),
});

/**
 * Type inferred from the update profile schema
 */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Schema for changing password
 * Validates password requirements
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters"),
  confirmNewPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

/**
 * Type inferred from the change password schema
 */
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
