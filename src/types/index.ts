/**
 * User roles in the LeadManager system
 */
export type UserRole = "SELLER" | "LEAD_MANAGER" | "ADMIN";

/**
 * Billing type for invoicing
 */
export type BillingType = "BOLETA" | "FACTURA" | "AMBOS";

/**
 * Lead qualification status
 */
export type LeadStatus = "PENDING" | "WON" | "LOST";

/**
 * Deal status for proposals after completion
 */
export type DealStatus = "ACTIVE" | "COMPLETED" | "RETRACTED";

/**
 * Ticket category for disputes
 */
export type TicketCategory = 
  | "PAYMENT_NON_COMPLIANCE" 
  | "DATA_MISUSE" 
  | "INAPPROPRIATE_CONDUCT" 
  | "OTHER";

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
  // Profile contact information
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  // Billing information
  billingType?: BillingType;
  // Additional information
  bio?: string; // User biography (max 500 chars)
  professionalDescription?: string; // Professional role description (max 500 chars)
  createdAt: Date;
}

/**
 * Offer entity
 */
export interface Offer {
  id: string;
  title: string;
  description: string;
  offerAttachmentUrl?: string;
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
 * Lead entity - represents a customer/prospect
 */
export interface Lead {
  id: string;
  fullName: string;
  leadId: string;
  email: string;
  phone: string;
  companyName: string;
  title: string;       // profesión o grado académico
  country: string;
  city: string;
  industry: string;
  profileUrl?: string; // página web o red social
  partialPreviewJson?: string;
  positionCode?: string; // cargo (CEO, Director, etc.)
  gender?: string;       // "UNSPECIFIED" si se omite
  minRevenue: number;    // precio mínimo (equivale a cobro mínimo)
  maxRevenue: number;    // precio máximo (cobro máximo)
  source?: string;       // fuente del lead
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Lead proposal
 * Note: customerName, customerEmail, customerPhone are deprecated
 * and should be retrieved from the associated Lead entity via leadId
 */
export interface LeadOffer {
  id: string;
  offerId: string;
  leadManagerId: string;
  leadId: string;
  description?: string;
  status: LeadStatus;
  assignedAt?: Date;
  qualifiedAt?: Date;
  createdAt: Date;
  // Deal completion tracking
  dealStatus?: DealStatus;
  completedAt?: Date;
  retractedAt?: Date;
  retractionReason?: string;
  evaluatedByManager?: boolean; // True if lead manager submitted evaluation
  evaluatedBySeller?: boolean; // True if seller submitted evaluation
}

/**
 * Payment status types for tracking obligations
 */
export type PaymentStatus = 
  | "PENDING" 
  | "IN_GRACE_PERIOD" 
  | "PAID" 
  | "REJECTED" 
  | "DISPUTED";

/**
 * Payment information - tracks payment obligations between sellers and lead managers
 * Note: This is for tracking only, not processing payments
 */
export interface Payment {
  id: string;
  offerId: string;
  proposalId: string; // leadOfferId
  leadManagerId: string;
  sellerId: string;
  leadId?: string; // Optional: specific lead that triggered this payment
  amountCLP: number;
  dueDate: Date;
  status: PaymentStatus;
  createdAt: Date;
  paidAt?: Date;
  notes?: string;
}

/**
 * Payout information (Legacy - kept for backwards compatibility)
 * @deprecated Use Payment type instead for new implementations
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

/**
 * Ticket/Dispute entity for reporting issues
 */
export interface Ticket {
  id: string;
  reporterId: string; // User who created the ticket
  reportedUserId?: string; // User being reported (if applicable)
  relatedProposalId?: string; // Related proposal ID
  relatedOfferId?: string; // Related offer ID
  category: TicketCategory;
  description: string;
  attachmentUrl?: string; // Optional file attachment
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  resolution?: string; // Admin resolution notes
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}
