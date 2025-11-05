/**
 * User roles in the LeadFlow system
 */
export type UserRole = "SELLER" | "LEAD_MANAGER" | "ADMIN";

/**
 * Lead qualification status
 */
export type LeadStatus = "PENDING" | "WON" | "LOST";

/**
 * Offer status
 */
export type OfferStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Base user type
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

/**
 * Offer entity
 */
export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  status: OfferStatus;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Lead proposal
 */
export interface LeadOffer {
  id: string;
  offerId: string;
  leadManagerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: LeadStatus;
  assignedAt?: Date;
  qualifiedAt?: Date;
  createdAt: Date;
}

/**
 * Payout information
 */
export interface Payout {
  id: string;
  leadOfferId: string;
  amount: number;
  status: "PENDING" | "PAID";
  paidAt?: Date;
  createdAt: Date;
}
