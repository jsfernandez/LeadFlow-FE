/**
 * Mock Data Provider
 * 
 * Simulates backend API with local data and artificial latency.
 * Maintains state across the application session using in-memory storage.
 * Designed to match the backend API contract for seamless transition.
 */

import type { Offer, LeadOffer, Payout, User, LeadStatus } from "@/types";

// Simulated API latency (in milliseconds)
const API_LATENCY = 300;

/**
 * Simulate network delay
 */
const delay = (ms: number = API_LATENCY) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * In-memory data store
 * In a real application, this would be replaced with API calls
 */
class MockDataStore {
  private offers: Map<string, Offer> = new Map();
  private leadOffers: Map<string, LeadOffer> = new Map();
  private payouts: Map<string, Payout> = new Map();
  private users: Map<string, User> = new Map();

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize with sample data for development
   */
  private initializeMockData() {
    // Sample users
    const seller1: User = {
      id: "seller-1",
      email: "seller@leadflow.com",
      name: "John Seller",
      role: "SELLER",
      createdAt: new Date("2024-01-01"),
    };

    const leadManager1: User = {
      id: "lead-manager-1",
      email: "manager@leadflow.com",
      name: "Jane Manager",
      role: "LEAD_MANAGER",
      createdAt: new Date("2024-01-01"),
    };
    
    const admin1: User = {
      id: "admin-1",
      email: "admin@leadflow.com",
      name: "Admin User",
      role: "ADMIN",
      createdAt: new Date("2024-01-01"),
    };

    this.users.set(seller1.id, seller1);
    this.users.set(leadManager1.id, leadManager1);
    this.users.set(admin1.id, admin1);

    // Sample offers with varied dates for trend visualization
    const offers: Offer[] = [
      {
        id: "offer-1",
        title: "Premium SaaS Leads",
        description: "High-quality leads for SaaS companies with $10M+ ARR",
        price: 500,
        status: "ACTIVE",
        sellerId: seller1.id,
        leadType: "B2B Enterprise",
        leadQuantity: 10,
        clientType: "SaaS Companies",
        acceptanceCriteria: "Must have minimum $10M ARR and be actively seeking solutions",
        offerDuration: 30,
        allowConsultations: true,
        createdAt: new Date("2024-10-15"),
        updatedAt: new Date("2024-10-15"),
      },
      {
        id: "offer-2",
        title: "E-commerce Store Leads",
        description: "Qualified leads for e-commerce platforms, validated contact info",
        price: 350,
        status: "ACTIVE",
        sellerId: seller1.id,
        leadType: "B2C Retail",
        leadQuantity: 20,
        clientType: "E-commerce Platforms",
        acceptanceCriteria: "Verified email and phone contact information",
        offerDuration: 45,
        allowConsultations: false,
        createdAt: new Date("2024-10-20"),
        updatedAt: new Date("2024-10-20"),
      },
      {
        id: "offer-3",
        title: "Enterprise B2B Leads",
        description: "Decision-maker contacts at Fortune 500 companies",
        price: 750,
        status: "ACTIVE",
        sellerId: seller1.id,
        leadType: "Enterprise",
        leadQuantity: 5,
        clientType: "Fortune 500",
        acceptanceCriteria: "C-level or VP-level decision makers only",
        offerDuration: 60,
        allowConsultations: true,
        createdAt: new Date("2024-11-01"),
        updatedAt: new Date("2024-11-01"),
      },
      {
        id: "offer-4",
        title: "Startup Leads Package",
        description: "Early-stage startups looking for services",
        price: 250,
        status: "ACTIVE",
        sellerId: seller1.id,
        leadType: "Startup",
        leadQuantity: 15,
        clientType: "Early-stage Startups",
        createdAt: new Date("2024-11-03"),
        updatedAt: new Date("2024-11-03"),
      },
    ];

    offers.forEach(offer => this.offers.set(offer.id, offer));

    // Sample lead offers with varied statuses for conversion metrics
    const leadOffers: LeadOffer[] = [
      {
        id: "lead-offer-1",
        offerId: "offer-1",
        leadManagerId: leadManager1.id,
        customerName: "Acme Corp",
        customerEmail: "contact@acme.com",
        customerPhone: "+1-555-0101",
        status: "WON",
        assignedAt: new Date("2024-10-16"),
        qualifiedAt: new Date("2024-10-18"),
        createdAt: new Date("2024-10-16"),
      },
      {
        id: "lead-offer-2",
        offerId: "offer-1",
        leadManagerId: leadManager1.id,
        customerName: "TechStart Inc",
        customerEmail: "hello@techstart.io",
        customerPhone: "+1-555-0102",
        status: "WON",
        assignedAt: new Date("2024-10-22"),
        qualifiedAt: new Date("2024-10-25"),
        createdAt: new Date("2024-10-22"),
      },
      {
        id: "lead-offer-3",
        offerId: "offer-2",
        leadManagerId: leadManager1.id,
        customerName: "ShopZone LLC",
        customerEmail: "info@shopzone.com",
        customerPhone: "+1-555-0103",
        status: "LOST",
        assignedAt: new Date("2024-10-21"),
        qualifiedAt: new Date("2024-10-23"),
        createdAt: new Date("2024-10-21"),
      },
      {
        id: "lead-offer-4",
        offerId: "offer-2",
        leadManagerId: leadManager1.id,
        customerName: "MegaStore Co",
        customerEmail: "sales@megastore.com",
        customerPhone: "+1-555-0104",
        status: "WON",
        assignedAt: new Date("2024-11-01"),
        qualifiedAt: new Date("2024-11-02"),
        createdAt: new Date("2024-11-01"),
      },
      {
        id: "lead-offer-5",
        offerId: "offer-3",
        leadManagerId: leadManager1.id,
        customerName: "Global Enterprises",
        customerEmail: "contact@globalent.com",
        customerPhone: "+1-555-0105",
        status: "PENDING",
        assignedAt: new Date("2024-11-02"),
        createdAt: new Date("2024-11-02"),
      },
      {
        id: "lead-offer-6",
        offerId: "offer-3",
        leadManagerId: leadManager1.id,
        customerName: "BigCorp Industries",
        customerEmail: "reach@bigcorp.com",
        customerPhone: "+1-555-0106",
        status: "PENDING",
        assignedAt: new Date("2024-11-04"),
        createdAt: new Date("2024-11-04"),
      },
      {
        id: "lead-offer-7",
        offerId: "offer-4",
        leadManagerId: leadManager1.id,
        customerName: "InnovateLab",
        customerEmail: "team@innovatelab.io",
        customerPhone: "+1-555-0107",
        status: "WON",
        assignedAt: new Date("2024-11-03"),
        qualifiedAt: new Date("2024-11-04"),
        createdAt: new Date("2024-11-03"),
      },
      {
        id: "lead-offer-8",
        offerId: "offer-1",
        leadManagerId: leadManager1.id,
        customerName: "CloudTech Solutions",
        customerEmail: "info@cloudtech.com",
        customerPhone: "+1-555-0108",
        status: "LOST",
        assignedAt: new Date("2024-10-28"),
        qualifiedAt: new Date("2024-10-30"),
        createdAt: new Date("2024-10-28"),
      },
    ];

    leadOffers.forEach(leadOffer => this.leadOffers.set(leadOffer.id, leadOffer));

    // Create payouts for WON leads
    const wonLeadOffers = leadOffers.filter(lo => lo.status === "WON");
    wonLeadOffers.forEach((leadOffer, index) => {
      const offer = this.offers.get(leadOffer.offerId);
      if (offer) {
        const payout: Payout = {
          id: `payout-${leadOffer.id}`,
          leadOfferId: leadOffer.id,
          amount: offer.price,
          status: index % 2 === 0 ? "PAID" : "PENDING",
          paidAt: index % 2 === 0 ? leadOffer.qualifiedAt : undefined,
          createdAt: leadOffer.qualifiedAt || leadOffer.createdAt,
        };
        this.payouts.set(payout.id, payout);
      }
    });
  }

  // ===== Offer Operations =====

  async getOffers(): Promise<Offer[]> {
    await delay();
    return Array.from(this.offers.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getOfferById(id: string): Promise<Offer | null> {
    await delay();
    return this.offers.get(id) || null;
  }

  async getOffersBySellerId(sellerId: string): Promise<Offer[]> {
    await delay();
    return Array.from(this.offers.values())
      .filter((offer) => offer.sellerId === sellerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createOffer(data: Omit<Offer, "id" | "createdAt" | "updatedAt">): Promise<Offer> {
    await delay();
    const newOffer: Offer = {
      ...data,
      id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.offers.set(newOffer.id, newOffer);
    return newOffer;
  }

  async updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null> {
    await delay();
    const offer = this.offers.get(id);
    if (!offer) return null;

    const updatedOffer: Offer = {
      ...offer,
      ...data,
      updatedAt: new Date(),
    };
    this.offers.set(id, updatedOffer);
    return updatedOffer;
  }

  async deleteOffer(id: string): Promise<boolean> {
    await delay();
    return this.offers.delete(id);
  }

  // ===== Lead Offer (Proposal) Operations =====

  async getLeadOffers(): Promise<LeadOffer[]> {
    await delay();
    return Array.from(this.leadOffers.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getLeadOfferById(id: string): Promise<LeadOffer | null> {
    await delay();
    return this.leadOffers.get(id) || null;
  }

  async getLeadOffersByManagerId(managerId: string): Promise<LeadOffer[]> {
    await delay();
    return Array.from(this.leadOffers.values())
      .filter((leadOffer) => leadOffer.leadManagerId === managerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getLeadOffersByOfferId(offerId: string): Promise<LeadOffer[]> {
    await delay();
    return Array.from(this.leadOffers.values())
      .filter((leadOffer) => leadOffer.offerId === offerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createLeadOffer(
    data: Omit<LeadOffer, "id" | "createdAt" | "status" | "assignedAt" | "qualifiedAt">
  ): Promise<LeadOffer> {
    await delay();
    const newLeadOffer: LeadOffer = {
      ...data,
      id: `lead-offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "PENDING",
      createdAt: new Date(),
    };
    this.leadOffers.set(newLeadOffer.id, newLeadOffer);
    return newLeadOffer;
  }

  async updateLeadOfferStatus(
    id: string,
    status: LeadStatus,
    qualifiedAt?: Date
  ): Promise<LeadOffer | null> {
    await delay();
    const leadOffer = this.leadOffers.get(id);
    if (!leadOffer) return null;

    const updatedLeadOffer: LeadOffer = {
      ...leadOffer,
      status,
      qualifiedAt: qualifiedAt || (status !== "PENDING" ? new Date() : undefined),
    };

    this.leadOffers.set(id, updatedLeadOffer);

    // Create payout if status is WON
    if (status === "WON" && !leadOffer.qualifiedAt) {
      await this.createPayoutForLeadOffer(id);
    }

    return updatedLeadOffer;
  }

  // ===== Payout Operations =====

  async getPayouts(): Promise<Payout[]> {
    await delay();
    return Array.from(this.payouts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getPayoutById(id: string): Promise<Payout | null> {
    await delay();
    return this.payouts.get(id) || null;
  }

  async getPayoutsByLeadOfferId(leadOfferId: string): Promise<Payout[]> {
    await delay();
    return Array.from(this.payouts.values())
      .filter((payout) => payout.leadOfferId === leadOfferId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get payouts for a specific lead manager
   * Joins with lead offers to filter by manager
   */
  async getPayoutsByManagerId(managerId: string): Promise<Payout[]> {
    await delay();
    const managerLeadOffers = Array.from(this.leadOffers.values())
      .filter((lo) => lo.leadManagerId === managerId)
      .map((lo) => lo.id);

    return Array.from(this.payouts.values())
      .filter((payout) => managerLeadOffers.includes(payout.leadOfferId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Create a payout when a lead is marked as WON
   */
  private async createPayoutForLeadOffer(leadOfferId: string): Promise<Payout | null> {
    const leadOffer = this.leadOffers.get(leadOfferId);
    if (!leadOffer) return null;

    const offer = this.offers.get(leadOffer.offerId);
    if (!offer) return null;

    const newPayout: Payout = {
      id: `payout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      leadOfferId,
      amount: offer.price,
      status: "PENDING",
      createdAt: new Date(),
    };

    this.payouts.set(newPayout.id, newPayout);
    return newPayout;
  }

  async updatePayoutStatus(id: string, status: "PENDING" | "PAID"): Promise<Payout | null> {
    await delay();
    const payout = this.payouts.get(id);
    if (!payout) return null;

    const updatedPayout: Payout = {
      ...payout,
      status,
      paidAt: status === "PAID" ? new Date() : undefined,
    };

    this.payouts.set(id, updatedPayout);
    return updatedPayout;
  }

  // ===== User Operations =====

  async getUserById(id: string): Promise<User | null> {
    await delay();
    return this.users.get(id) || null;
  }
}

// Singleton instance
const mockDataStore = new MockDataStore();

/**
 * Mock Provider API
 * Exports functions that mimic backend API endpoints
 */
export const mockProvider = {
  // Offers
  getOffers: () => mockDataStore.getOffers(),
  getOfferById: (id: string) => mockDataStore.getOfferById(id),
  getOffersBySellerId: (sellerId: string) => mockDataStore.getOffersBySellerId(sellerId),
  createOffer: (data: Omit<Offer, "id" | "createdAt" | "updatedAt">) =>
    mockDataStore.createOffer(data),
  updateOffer: (id: string, data: Partial<Offer>) => mockDataStore.updateOffer(id, data),
  deleteOffer: (id: string) => mockDataStore.deleteOffer(id),

  // Lead Offers (Proposals)
  getLeadOffers: () => mockDataStore.getLeadOffers(),
  getLeadOfferById: (id: string) => mockDataStore.getLeadOfferById(id),
  getLeadOffersByManagerId: (managerId: string) =>
    mockDataStore.getLeadOffersByManagerId(managerId),
  getLeadOffersByOfferId: (offerId: string) => mockDataStore.getLeadOffersByOfferId(offerId),
  createLeadOffer: (
    data: Omit<LeadOffer, "id" | "createdAt" | "status" | "assignedAt" | "qualifiedAt">
  ) => mockDataStore.createLeadOffer(data),
  updateLeadOfferStatus: (id: string, status: LeadStatus, qualifiedAt?: Date) =>
    mockDataStore.updateLeadOfferStatus(id, status, qualifiedAt),

  // Payouts
  getPayouts: () => mockDataStore.getPayouts(),
  getPayoutById: (id: string) => mockDataStore.getPayoutById(id),
  getPayoutsByLeadOfferId: (leadOfferId: string) =>
    mockDataStore.getPayoutsByLeadOfferId(leadOfferId),
  getPayoutsByManagerId: (managerId: string) => mockDataStore.getPayoutsByManagerId(managerId),
  updatePayoutStatus: (id: string, status: "PENDING" | "PAID") =>
    mockDataStore.updatePayoutStatus(id, status),

  // Users
  getUserById: (id: string) => mockDataStore.getUserById(id),
};
