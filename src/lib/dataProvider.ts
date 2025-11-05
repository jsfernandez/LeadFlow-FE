/**
 * Data Provider Abstraction
 * 
 * Provides a unified interface for accessing data from either mock or real API.
 * Automatically switches based on NEXT_PUBLIC_API_MODE environment variable.
 * Ensures seamless transition between local development and production.
 */

import { mockProvider } from "./mockProvider";
import { realProvider } from "./realProvider";
import type { Offer, LeadOffer, Payout, User, LeadStatus } from "@/types";

/**
 * Data provider interface
 * Both mock and real providers must implement this interface
 */
export interface DataProvider {
  // Offer operations
  getOffers(): Promise<Offer[]>;
  getOfferById(id: string): Promise<Offer | null>;
  getOffersBySellerId(sellerId: string): Promise<Offer[]>;
  createOffer(data: Omit<Offer, "id" | "createdAt" | "updatedAt">): Promise<Offer>;
  updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null>;
  deleteOffer(id: string): Promise<boolean>;

  // Lead offer operations
  getLeadOffers(): Promise<LeadOffer[]>;
  getLeadOfferById(id: string): Promise<LeadOffer | null>;
  getLeadOffersByManagerId(managerId: string): Promise<LeadOffer[]>;
  getLeadOffersByOfferId(offerId: string): Promise<LeadOffer[]>;
  createLeadOffer(
    data: Omit<LeadOffer, "id" | "createdAt" | "status" | "assignedAt" | "qualifiedAt">
  ): Promise<LeadOffer>;
  updateLeadOfferStatus(
    id: string,
    status: LeadStatus,
    qualifiedAt?: Date
  ): Promise<LeadOffer | null>;

  // Payout operations
  getPayouts(): Promise<Payout[]>;
  getPayoutById(id: string): Promise<Payout | null>;
  getPayoutsByLeadOfferId(leadOfferId: string): Promise<Payout[]>;
  getPayoutsByManagerId(managerId: string): Promise<Payout[]>;
  updatePayoutStatus(id: string, status: "PENDING" | "PAID"): Promise<Payout | null>;

  // User operations
  getUserById(id: string): Promise<User | null>;
}

/**
 * Get the API mode from environment variable
 */
function getApiMode(): "mock" | "real" {
  const mode = process.env.NEXT_PUBLIC_API_MODE;
  return mode === "real" ? "real" : "mock";
}

/**
 * Get the appropriate data provider based on API mode
 */
function getDataProvider(): DataProvider {
  const mode = getApiMode();
  
  if (mode === "real") {
    console.log("[DataProvider] Using REAL API mode");
    return realProvider;
  }
  
  console.log("[DataProvider] Using MOCK mode");
  return mockProvider;
}

/**
 * Singleton data provider instance
 * Automatically switches between mock and real based on environment
 */
export const dataProvider = getDataProvider();

/**
 * Export for testing purposes - allows checking current mode
 */
export const getCurrentApiMode = getApiMode;
