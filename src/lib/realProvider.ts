/**
 * Real Data Provider
 * 
 * Integrates with backend API via apiClient.
 * Implements the same interface as mockProvider for seamless switching.
 * Handles DTOs with proper date deserialization.
 */

import { apiClient } from "./apiClient";
import type { Offer, LeadOffer, Payout, User, LeadStatus } from "@/types";

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

interface LeadOfferDTO {
  id: string;
  offerId: string;
  leadManagerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
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
  createdAt: string;
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
    } catch {
      // Return null for 404 errors to match mock provider behavior
      return null;
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
    } catch {
      return null;
    }
  },

  async deleteOffer(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/offers/${id}`);
      return true;
    } catch {
      return false;
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
    } catch {
      return null;
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
    } catch {
      return null;
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
    } catch {
      return null;
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
    } catch {
      return null;
    }
  },

  // ===== User Operations =====

  async getUserById(id: string): Promise<User | null> {
    try {
      const data = await apiClient.get<UserDTO>(`/users/${id}`);
      return transformUser(data);
    } catch {
      return null;
    }
  },
};
