/**
 * User roles in the LeadManager system
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
  language?: "en" | "es"; // User's preferred language
  reputation?: UserReputation; // User's reputation from ratings
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
  // Optional fields for extended offer details
  leadType?: string;
  leadQuantity?: number;
  clientType?: string;
  acceptanceCriteria?: string;
  offerDuration?: number; // in days
  allowConsultations?: boolean;
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

/**
 * Rating entity for mutual rating system
 */
export interface Rating {
  id: string;
  raterId: string; // User who gave the rating
  ratedUserId: string; // User who received the rating
  score: number; // 1-5 stars
  feedback?: string; // Optional feedback text
  context: "PROPOSAL_ACCEPTED" | "PROPOSAL_REJECTED" | "LEAD_MANAGER_RATED"; // Context of rating
  relatedOfferId?: string; // Related offer ID for context
  relatedProposalId?: string; // Related proposal ID for context
  createdAt: Date;
}

/**
 * User reputation aggregate
 */
export interface UserReputation {
  userId: string;
  averageRating: number; // Average of all ratings (1-5)
  totalRatings: number; // Number of ratings received
  lastUpdated: Date;
}
