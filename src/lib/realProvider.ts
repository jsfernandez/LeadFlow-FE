/**
 * Real Data Provider
 * 
 * Integrates with backend API via apiClient.
 * Implements the same interface as mockProvider for seamless switching.
 * Handles DTOs with proper date deserialization.
 */

import { apiClient, ApiError } from "./apiClient";
import type { Offer, Lead, LeadOffer, Payout, User, LeadStatus, Rating, UserReputation } from "@/types";

/**
 * API response types (DTOs from backend)
 * These match the backend response structure with string dates
 */
interface OfferDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadDTO {
  id: string;
  fullName: string;
  leadId: string;
  email: string;
  phone: string;
  companyName: string;
  title: string;
  country: string;
  city: string;
  industry: string;
  profileUrl?: string;
  partialPreviewJson?: string;
  positionCode?: string;
  gender?: string;
  minRevenue: number;
  maxRevenue: number;
  source?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface LeadOfferDTO {
  id: string;
  offerId: string;
  leadManagerId: string;
  leadId: string;
  description?: string;
  status: "PENDING" | "WON" | "LOST";
  assignedAt?: string;
  qualifiedAt?: string;
  createdAt: string;
}

interface PayoutDTO {
  id: string;
  leadOfferId: string;
  amount: number;
  status: "PENDING" | "PAID";
  paidAt?: string;
  createdAt: string;
}

interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: "SELLER" | "LEAD_MANAGER" | "ADMIN";
  language?: "en" | "es";
  createdAt: string;
}

interface RatingDTO {
  id: string;
  raterId: string;
  ratedUserId: string;
  score: number;
  feedback?: string;
  context: "PROPOSAL_ACCEPTED" | "PROPOSAL_REJECTED" | "LEAD_MANAGER_RATED";
  relatedOfferId?: string;
  relatedProposalId?: string;
  createdAt: string;
}

interface UserReputationDTO {
  userId: string;
  averageRating: number;
  totalRatings: number;
  lastUpdated: string;
}

/**
 * Helper to convert API date strings to Date objects
 */
function parseDate(dateStr: string | Date | undefined): Date | undefined {
  if (!dateStr) return undefined;
  return dateStr instanceof Date ? dateStr : new Date(dateStr);
}

/**
 * Transform API offer response to typed Offer
 */
function transformOffer(data: OfferDTO): Offer {
  return {
    ...data,
    createdAt: parseDate(data.createdAt) || new Date(),
    updatedAt: parseDate(data.updatedAt) || new Date(),
  };
}

/**
 * Transform API lead response to typed Lead
 */
function transformLead(data: LeadDTO): Lead {
  return {
    ...data,
    createdAt: parseDate(data.createdAt) || new Date(),
    updatedAt: parseDate(data.updatedAt) || new Date(),
  };
}

/**
 * Transform API lead offer response to typed LeadOffer
 */
function transformLeadOffer(data: LeadOfferDTO): LeadOffer {
  return {
    ...data,
    createdAt: parseDate(data.createdAt) || new Date(),
    assignedAt: parseDate(data.assignedAt),
    qualifiedAt: parseDate(data.qualifiedAt),
  };
}

/**
 * Transform API payout response to typed Payout
 */
function transformPayout(data: PayoutDTO): Payout {
  return {
    ...data,
    createdAt: parseDate(data.createdAt) || new Date(),
    paidAt: parseDate(data.paidAt),
  };
}

/**
 * Transform API user response to typed User
 */
function transformUser(data: UserDTO): User {
  return {
    ...data,
    createdAt: parseDate(data.createdAt) || new Date(),
  };
}

/**
 * Transform API rating response to typed Rating
 */
function transformRating(data: RatingDTO): Rating {
  return {
    ...data,
    createdAt: parseDate(data.createdAt) || new Date(),
  };
}

/**
 * Transform API user reputation response to typed UserReputation
 */
function transformUserReputation(data: UserReputationDTO): UserReputation {
  return {
    ...data,
    lastUpdated: parseDate(data.lastUpdated) || new Date(),
  };
}

/**
 * Real Provider API
 * Exports functions that call backend API endpoints
 */
export const realProvider = {
  // ===== Offer Operations =====

  async getOffers(): Promise<Offer[]> {
    const data = await apiClient.get<OfferDTO[]>("/offers");
    return data.map(transformOffer);
  },

  async getOfferById(id: string): Promise<Offer | null> {
    try {
      const data = await apiClient.get<OfferDTO>(`/offers/${id}`);
      return transformOffer(data);
    } catch (error) {
      // Return null for 404 errors to match mock provider behavior
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      // Log other errors for debugging
      console.error("[RealProvider] Error fetching offer:", error);
      throw error;
    }
  },

  async getOffersBySellerId(sellerId: string): Promise<Offer[]> {
    const data = await apiClient.get<OfferDTO[]>("/offers", {
      params: { sellerId },
    });
    return data.map(transformOffer);
  },

  async createOffer(
    data: Omit<Offer, "id" | "createdAt" | "updatedAt">
  ): Promise<Offer> {
    const response = await apiClient.post<OfferDTO>("/offers", data);
    return transformOffer(response);
  },

  async updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null> {
    try {
      const response = await apiClient.patch<OfferDTO>(`/offers/${id}`, data);
      return transformOffer(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error("[RealProvider] Error updating offer:", error);
      throw error;
    }
  },

  async deleteOffer(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/offers/${id}`);
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      console.error("[RealProvider] Error deleting offer:", error);
      throw error;
    }
  },

  // ===== Lead Operations =====

  async getLeads(): Promise<Lead[]> {
    const data = await apiClient.get<LeadDTO[]>("/leads");
    return data.map(transformLead);
  },

  async getLeadById(id: string): Promise<Lead | null> {
    try {
      const data = await apiClient.get<LeadDTO>(`/leads/${id}`);
      return transformLead(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error("[RealProvider] Error fetching lead:", error);
      throw error;
    }
  },

  async createLead(
    data: Omit<Lead, "id" | "createdAt" | "updatedAt">
  ): Promise<Lead> {
    const response = await apiClient.post<LeadDTO>("/leads", data);
    return transformLead(response);
  },

  async updateLead(id: string, data: Partial<Lead>): Promise<Lead | null> {
    try {
      const response = await apiClient.patch<LeadDTO>(`/leads/${id}`, data);
      return transformLead(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error("[RealProvider] Error updating lead:", error);
      throw error;
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/leads/${id}`);
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      console.error("[RealProvider] Error deleting lead:", error);
      throw error;
    }
  },

  // ===== Lead Offer (Proposal) Operations =====

  async getLeadOffers(): Promise<LeadOffer[]> {
    const data = await apiClient.get<LeadOfferDTO[]>("/lead-offers");
    return data.map(transformLeadOffer);
  },

  async getLeadOfferById(id: string): Promise<LeadOffer | null> {
    try {
      const data = await apiClient.get<LeadOfferDTO>(`/lead-offers/${id}`);
      return transformLeadOffer(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error("[RealProvider] Error fetching lead offer:", error);
      throw error;
    }
  },

  async getLeadOffersByManagerId(managerId: string): Promise<LeadOffer[]> {
    const data = await apiClient.get<LeadOfferDTO[]>("/lead-offers", {
      params: { managerId },
    });
    return data.map(transformLeadOffer);
  },

  async getLeadOffersByOfferId(offerId: string): Promise<LeadOffer[]> {
    const data = await apiClient.get<LeadOfferDTO[]>("/lead-offers", {
      params: { offerId },
    });
    return data.map(transformLeadOffer);
  },

  async createLeadOffer(
    data: Omit<LeadOffer, "id" | "createdAt" | "status" | "assignedAt" | "qualifiedAt">
  ): Promise<LeadOffer> {
    const response = await apiClient.post<LeadOfferDTO>("/lead-offers", data);
    return transformLeadOffer(response);
  },

  async updateLeadOfferStatus(
    id: string,
    status: LeadStatus,
    qualifiedAt?: Date
  ): Promise<LeadOffer | null> {
    try {
      const response = await apiClient.patch<LeadOfferDTO>(`/lead-offers/${id}/status`, {
        status,
        qualifiedAt,
      });
      return transformLeadOffer(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error("[RealProvider] Error updating lead offer status:", error);
      throw error;
    }
  },

  // ===== Payout Operations =====

  async getPayouts(): Promise<Payout[]> {
    const data = await apiClient.get<PayoutDTO[]>("/payouts");
    return data.map(transformPayout);
  },

  async getPayoutById(id: string): Promise<Payout | null> {
    try {
      const data = await apiClient.get<PayoutDTO>(`/payouts/${id}`);
      return transformPayout(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error("[RealProvider] Error fetching payout:", error);
      throw error;
    }
  },

  async getPayoutsByLeadOfferId(leadOfferId: string): Promise<Payout[]> {
    const data = await apiClient.get<PayoutDTO[]>("/payouts", {
      params: { leadOfferId },
    });
    return data.map(transformPayout);
  },

  async getPayoutsByManagerId(managerId: string): Promise<Payout[]> {
    const data = await apiClient.get<PayoutDTO[]>("/payouts", {
      params: { managerId },
    });
    return data.map(transformPayout);
  },

  async updatePayoutStatus(
    id: string,
    status: "PENDING" | "PAID"
  ): Promise<Payout | null> {
    try {
      const response = await apiClient.patch<PayoutDTO>(`/payouts/${id}/status`, {
        status,
      });
      return transformPayout(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error("[RealProvider] Error updating payout status:", error);
      throw error;
    }
  },

  // ===== User Operations =====

  async getUserById(id: string): Promise<User | null> {
    try {
      const data = await apiClient.get<UserDTO>(`/users/${id}`);
      return transformUser(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error("[RealProvider] Error fetching user:", error);
      throw error;
    }
  },

  async updateUserLanguage(userId: string, language: "en" | "es"): Promise<User | null> {
    try {
      const response = await apiClient.patch<UserDTO>(`/users/${userId}/language`, {
        language,
      });
      return transformUser(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error("[RealProvider] Error updating user language:", error);
      throw error;
    }
  },

  // ===== Rating Operations =====

  async createRating(data: Omit<Rating, "id" | "createdAt">): Promise<Rating> {
    const response = await apiClient.post<RatingDTO>("/ratings", data);
    return transformRating(response);
  },

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    const data = await apiClient.get<RatingDTO[]>("/ratings", {
      params: { ratedUserId: userId },
    });
    return data.map(transformRating);
  },

  async getRatingsByRater(raterId: string): Promise<Rating[]> {
    const data = await apiClient.get<RatingDTO[]>("/ratings", {
      params: { raterId },
    });
    return data.map(transformRating);
  },

  async getUserReputation(userId: string): Promise<UserReputation | null> {
    try {
      const data = await apiClient.get<UserReputationDTO>(`/users/${userId}/reputation`);
      return transformUserReputation(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error("[RealProvider] Error fetching user reputation:", error);
      throw error;
    }
  },
};
