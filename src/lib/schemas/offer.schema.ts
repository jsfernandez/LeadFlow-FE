/**
 * Zod schemas for offer validation
 * Ensures data integrity for offer creation and updates
 */

import { z } from "zod";

/**
 * Schema for creating a new offer
 * Validates all required and optional fields
 */
export const createOfferSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be less than 2000 characters"),
  price: z.number().positive("Price must be a positive number"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
  sellerId: z.string().min(1, "Seller ID is required"),
  // Optional fields
  leadType: z.string().max(100, "Lead type must be less than 100 characters").optional(),
  leadQuantity: z.number().int().positive("Lead quantity must be a positive integer").optional(),
  clientType: z.string().max(100, "Client type must be less than 100 characters").optional(),
  acceptanceCriteria: z.string().max(1000, "Acceptance criteria must be less than 1000 characters").optional(),
  offerDuration: z.number().int().positive("Offer duration must be a positive integer").optional(),
  allowConsultations: z.boolean().optional(),
  qualificationWindow: z.number().int().positive("Qualification window must be a positive integer (hours)").optional(),
});

/**
 * Type inferred from the create offer schema
 */
export type CreateOfferInput = z.infer<typeof createOfferSchema>;

/**
 * Schema for updating an offer
 * All fields are optional for partial updates
 */
export const updateOfferSchema = createOfferSchema.partial();

/**
 * Type inferred from the update offer schema
 */
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;
