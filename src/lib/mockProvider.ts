/**
 * Mock Data Provider
 * 
 * Simulates backend API with local data and artificial latency.
 * Maintains state across the application session using in-memory storage.
 * Designed to match the backend API contract for seamless transition.
 */

import type { Offer, LeadOffer, Payout, User, Lead, LeadStatus, Rating, UserReputation, Ticket, DealStatus } from "@/types";

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
  private leads: Map<string, Lead> = new Map();
  private leadOffers: Map<string, LeadOffer> = new Map();
  private payouts: Map<string, Payout> = new Map();
  private users: Map<string, User> = new Map();
  private ratings: Map<string, Rating> = new Map();
  private reputations: Map<string, UserReputation> = new Map();
  private tickets: Map<string, Ticket> = new Map();

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
      email: "seller@leadmanager.com",
      name: "John Seller",
      role: "SELLER",
      bio: "Experienced B2B sales professional with a passion for connecting businesses with the right solutions.",
      professionalDescription: "As a Seller, I specialize in SaaS and enterprise solutions, bringing over 10 years of experience in lead generation and client acquisition.",
      createdAt: new Date("2024-01-01"),
    };

    const leadManager1: User = {
      id: "lead-manager-1",
      email: "manager@leadmanager.com",
      name: "Jane Manager",
      role: "LEAD_MANAGER",
      bio: "Lead generation specialist with extensive network in tech and e-commerce sectors.",
      professionalDescription: "As a Lead Manager, I focus on delivering high-quality, pre-qualified leads for B2B companies, leveraging my network built over 8 years in the industry.",
      createdAt: new Date("2024-01-01"),
    };
    
    const admin1: User = {
      id: "admin-1",
      email: "admin@leadmanager.com",
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

    // Sample leads (customers/prospects)
    const leads: Lead[] = [
      {
        id: "lead-1",
        fullName: "John Smith",
        leadId: "LEAD-001",
        email: "contact@acme.com",
        phone: "+1-555-0101",
        companyName: "Acme Corporation",
        title: "MBA",
        country: "USA",
        city: "New York",
        industry: "Technology",
        profileUrl: "https://linkedin.com/in/johnsmith",
        positionCode: "CEO",
        gender: "MALE",
        minRevenue: 1000,
        maxRevenue: 5000,
        source: "LinkedIn",
        tags: ["enterprise", "tech"],
        createdAt: new Date("2024-10-15"),
        updatedAt: new Date("2024-10-15"),
      },
      {
        id: "lead-2",
        fullName: "Jane Doe",
        leadId: "LEAD-002",
        email: "hello@techstart.io",
        phone: "+1-555-0102",
        companyName: "TechStart Innovations",
        title: "BSc Computer Science",
        country: "USA",
        city: "San Francisco",
        industry: "Software",
        profileUrl: "https://techstart.io",
        positionCode: "CTO",
        gender: "FEMALE",
        minRevenue: 800,
        maxRevenue: 3000,
        source: "Referral",
        tags: ["startup", "saas"],
        createdAt: new Date("2024-10-20"),
        updatedAt: new Date("2024-10-20"),
      },
      {
        id: "lead-3",
        fullName: "Robert Johnson",
        leadId: "LEAD-003",
        email: "info@shopzone.com",
        phone: "+1-555-0103",
        companyName: "ShopZone E-commerce",
        title: "BA Business Administration",
        country: "USA",
        city: "Chicago",
        industry: "E-commerce",
        positionCode: "Director",
        gender: "MALE",
        minRevenue: 500,
        maxRevenue: 2000,
        source: "Website",
        tags: ["retail", "online"],
        createdAt: new Date("2024-10-21"),
        updatedAt: new Date("2024-10-21"),
      },
      {
        id: "lead-4",
        fullName: "Maria Garcia",
        leadId: "LEAD-004",
        email: "sales@megastore.com",
        phone: "+1-555-0104",
        companyName: "MegaStore Company",
        title: "MSc Marketing",
        country: "USA",
        city: "Los Angeles",
        industry: "Retail",
        positionCode: "VP Sales",
        gender: "FEMALE",
        minRevenue: 1500,
        maxRevenue: 6000,
        source: "Trade Show",
        tags: ["retail", "b2c"],
        createdAt: new Date("2024-10-25"),
        updatedAt: new Date("2024-10-25"),
      },
      {
        id: "lead-5",
        fullName: "Michael Brown",
        leadId: "LEAD-005",
        email: "contact@globalent.com",
        phone: "+1-555-0105",
        companyName: "Global Enterprises Ltd",
        title: "PhD Economics",
        country: "UK",
        city: "London",
        industry: "Consulting",
        profileUrl: "https://globalent.com",
        positionCode: "CEO",
        gender: "MALE",
        minRevenue: 2000,
        maxRevenue: 10000,
        source: "Direct",
        tags: ["enterprise", "consulting"],
        createdAt: new Date("2024-11-01"),
        updatedAt: new Date("2024-11-01"),
      },
      {
        id: "lead-6",
        fullName: "Sarah Wilson",
        leadId: "LEAD-006",
        email: "reach@bigcorp.com",
        phone: "+1-555-0106",
        companyName: "BigCorp Industries Inc",
        title: "BA Engineering",
        country: "USA",
        city: "Boston",
        industry: "Manufacturing",
        positionCode: "COO",
        gender: "FEMALE",
        minRevenue: 1200,
        maxRevenue: 5000,
        source: "Partner",
        tags: ["manufacturing", "b2b"],
        createdAt: new Date("2024-11-02"),
        updatedAt: new Date("2024-11-02"),
      },
      {
        id: "lead-7",
        fullName: "David Lee",
        leadId: "LEAD-007",
        email: "team@innovatelab.io",
        phone: "+1-555-0107",
        companyName: "InnovateLab Research",
        title: "PhD Computer Science",
        country: "USA",
        city: "Seattle",
        industry: "Research",
        profileUrl: "https://innovatelab.io",
        positionCode: "Director",
        gender: "MALE",
        minRevenue: 600,
        maxRevenue: 2500,
        source: "Academic",
        tags: ["research", "innovation"],
        createdAt: new Date("2024-11-03"),
        updatedAt: new Date("2024-11-03"),
      },
      {
        id: "lead-8",
        fullName: "Emily Chen",
        leadId: "LEAD-008",
        email: "info@cloudtech.com",
        phone: "+1-555-0108",
        companyName: "CloudTech Solutions Group",
        title: "MSc Cloud Computing",
        country: "Canada",
        city: "Toronto",
        industry: "Cloud Services",
        profileUrl: "https://cloudtech.com",
        positionCode: "VP Technology",
        gender: "FEMALE",
        minRevenue: 1000,
        maxRevenue: 4000,
        source: "Conference",
        tags: ["cloud", "saas"],
        createdAt: new Date("2024-10-28"),
        updatedAt: new Date("2024-10-28"),
      },
    ];

    leads.forEach(lead => this.leads.set(lead.id, lead));

    // Sample lead offers with varied statuses for conversion metrics
    const leadOffers: LeadOffer[] = [
      {
        id: "lead-offer-1",
        offerId: "offer-1",
        leadManagerId: leadManager1.id,
        leadId: "lead-1",
        description: "High-value prospect interested in SaaS solutions",
        status: "WON",
        assignedAt: new Date("2024-10-16"),
        qualifiedAt: new Date("2024-10-18"),
        createdAt: new Date("2024-10-16"),
      },
      {
        id: "lead-offer-2",
        offerId: "offer-1",
        leadManagerId: leadManager1.id,
        leadId: "lead-2",
        description: "Startup looking for enterprise solutions",
        status: "WON",
        assignedAt: new Date("2024-10-22"),
        qualifiedAt: new Date("2024-10-25"),
        createdAt: new Date("2024-10-22"),
      },
      {
        id: "lead-offer-3",
        offerId: "offer-2",
        leadManagerId: leadManager1.id,
        leadId: "lead-3",
        description: "E-commerce platform seeking qualified leads",
        status: "LOST",
        assignedAt: new Date("2024-10-21"),
        qualifiedAt: new Date("2024-10-23"),
        createdAt: new Date("2024-10-21"),
      },
      {
        id: "lead-offer-4",
        offerId: "offer-2",
        leadManagerId: leadManager1.id,
        leadId: "lead-4",
        description: "Large retail chain interested in e-commerce leads",
        status: "WON",
        assignedAt: new Date("2024-11-01"),
        qualifiedAt: new Date("2024-11-02"),
        createdAt: new Date("2024-11-01"),
      },
      {
        id: "lead-offer-5",
        offerId: "offer-3",
        leadManagerId: leadManager1.id,
        leadId: "lead-5",
        description: "Enterprise client seeking B2B leads",
        status: "PENDING",
        assignedAt: new Date("2024-11-02"),
        createdAt: new Date("2024-11-02"),
      },
      {
        id: "lead-offer-6",
        offerId: "offer-3",
        leadManagerId: leadManager1.id,
        leadId: "lead-6",
        description: "Fortune 500 company interested in decision-maker contacts",
        status: "PENDING",
        assignedAt: new Date("2024-11-04"),
        createdAt: new Date("2024-11-04"),
      },
      {
        id: "lead-offer-7",
        offerId: "offer-4",
        leadManagerId: leadManager1.id,
        leadId: "lead-7",
        description: "Research lab looking for startup leads",
        status: "WON",
        assignedAt: new Date("2024-11-03"),
        qualifiedAt: new Date("2024-11-04"),
        createdAt: new Date("2024-11-03"),
      },
      {
        id: "lead-offer-8",
        offerId: "offer-1",
        leadManagerId: leadManager1.id,
        leadId: "lead-8",
        description: "Cloud solutions provider interested in SaaS leads",
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

    // Sample ratings
    const ratings: Rating[] = [
      {
        id: "rating-1",
        raterId: seller1.id,
        ratedUserId: leadManager1.id,
        score: 5,
        feedback: "Excellent quality leads! Very professional and responsive.",
        context: "PROPOSAL_ACCEPTED",
        relatedOfferId: "offer-1",
        relatedProposalId: "lead-offer-1",
        createdAt: new Date("2024-10-18"),
      },
      {
        id: "rating-2",
        raterId: leadManager1.id,
        ratedUserId: seller1.id,
        score: 4,
        feedback: "Great offer, clear requirements. Communication could be faster.",
        context: "LEAD_MANAGER_RATED",
        relatedOfferId: "offer-1",
        relatedProposalId: "lead-offer-2",
        createdAt: new Date("2024-10-25"),
      },
      {
        id: "rating-3",
        raterId: seller1.id,
        ratedUserId: leadManager1.id,
        score: 4,
        feedback: "Good work, leads were qualified but needed some follow-up.",
        context: "PROPOSAL_ACCEPTED",
        relatedOfferId: "offer-2",
        relatedProposalId: "lead-offer-4",
        createdAt: new Date("2024-11-02"),
      },
    ];

    ratings.forEach(rating => this.ratings.set(rating.id, rating));

    // Calculate and store reputations
    this.calculateReputation(seller1.id);
    this.calculateReputation(leadManager1.id);
  }

  /**
   * Calculate and update user reputation based on all received ratings
   */
  private calculateReputation(userId: string): void {
    const userRatings = Array.from(this.ratings.values()).filter(
      rating => rating.ratedUserId === userId
    );

    if (userRatings.length > 0) {
      const totalScore = userRatings.reduce((sum, rating) => sum + rating.score, 0);
      const averageRating = totalScore / userRatings.length;

      const reputation: UserReputation = {
        userId,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalRatings: userRatings.length,
        lastUpdated: new Date(),
      };

      this.reputations.set(userId, reputation);

      // Update user with reputation
      const user = this.users.get(userId);
      if (user) {
        user.reputation = reputation;
      }
    }
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

  // ===== Lead Operations =====

  async getLeads(): Promise<Lead[]> {
    await delay();
    return Array.from(this.leads.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getLeadById(id: string): Promise<Lead | null> {
    await delay();
    return this.leads.get(id) || null;
  }

  async createLead(
    data: Omit<Lead, "id" | "createdAt" | "updatedAt">
  ): Promise<Lead> {
    await delay();
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.set(newLead.id, newLead);
    return newLead;
  }

  async updateLead(id: string, data: Partial<Lead>): Promise<Lead | null> {
    await delay();
    const lead = this.leads.get(id);
    if (!lead) return null;

    const updatedLead: Lead = {
      ...lead,
      ...data,
      updatedAt: new Date(),
    };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  async deleteLead(id: string): Promise<boolean> {
    await delay();
    return this.leads.delete(id);
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

  async getLeadOffersBySellerId(sellerId: string): Promise<LeadOffer[]> {
    await delay();
    // Get all offers for this seller
    const sellerOfferIds = Array.from(this.offers.values())
      .filter((offer) => offer.sellerId === sellerId)
      .map((offer) => offer.id);

    // Get all lead offers for these offers
    return Array.from(this.leadOffers.values())
      .filter((leadOffer) => sellerOfferIds.includes(leadOffer.offerId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createLeadOffer(
    data: Omit<LeadOffer, "id" | "createdAt" | "status" | "assignedAt" | "qualifiedAt">
  ): Promise<LeadOffer> {
    await delay();
    
    // Verify lead exists
    const lead = this.leads.get(data.leadId);
    if (!lead) {
      throw new Error(`Lead with id ${data.leadId} not found`);
    }
    
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

  async updateUserLanguage(userId: string, language: "en" | "es"): Promise<User | null> {
    await delay();
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser: User = {
      ...user,
      language,
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUser(userId: string, data: Partial<Omit<User, "id" | "role" | "createdAt">>): Promise<User | null> {
    await delay();
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser: User = {
      ...user,
      ...data,
      id: user.id, // Ensure id is not overwritten
      role: user.role, // Ensure role is not overwritten
      createdAt: user.createdAt, // Ensure createdAt is not overwritten
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    await delay();
    const user = this.users.get(userId);
    if (!user) return false;

    // In mock mode, we don't actually store passwords, so we just return success
    // In a real implementation, this would verify the current password and update to the new one
    return true;
  }

  // ===== Rating Operations =====

  async createRating(
    data: Omit<Rating, "id" | "createdAt">
  ): Promise<Rating> {
    await delay();
    const newRating: Rating = {
      ...data,
      id: `rating-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    this.ratings.set(newRating.id, newRating);
    
    // Recalculate reputation for the rated user
    this.calculateReputation(data.ratedUserId);

    return newRating;
  }

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    await delay();
    return Array.from(this.ratings.values())
      .filter((rating) => rating.ratedUserId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRatingsByRater(raterId: string): Promise<Rating[]> {
    await delay();
    return Array.from(this.ratings.values())
      .filter((rating) => rating.raterId === raterId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUserReputation(userId: string): Promise<UserReputation | null> {
    await delay();
    return this.reputations.get(userId) || null;
  }

  // ===== Ticket Operations =====

  async createTicket(
    data: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status" | "resolvedAt">
  ): Promise<Ticket> {
    await delay();
    const newTicket: Ticket = {
      ...data,
      id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "OPEN",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tickets.set(newTicket.id, newTicket);
    return newTicket;
  }

  async getTicketById(id: string): Promise<Ticket | null> {
    await delay();
    return this.tickets.get(id) || null;
  }

  async getTicketsByReporter(reporterId: string): Promise<Ticket[]> {
    await delay();
    return Array.from(this.tickets.values())
      .filter((ticket) => ticket.reporterId === reporterId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTicketsByProposal(proposalId: string): Promise<Ticket[]> {
    await delay();
    return Array.from(this.tickets.values())
      .filter((ticket) => ticket.relatedProposalId === proposalId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ===== Deal Completion Operations =====

  async markDealCompleted(proposalId: string): Promise<LeadOffer | null> {
    await delay();
    const proposal = this.leadOffers.get(proposalId);
    if (!proposal) return null;

    const updatedProposal: LeadOffer = {
      ...proposal,
      dealStatus: "COMPLETED",
      completedAt: new Date(),
    };

    this.leadOffers.set(proposalId, updatedProposal);
    return updatedProposal;
  }

  async retractDeal(
    proposalId: string,
    reason: string,
    userId: string
  ): Promise<LeadOffer | null> {
    await delay();
    const proposal = this.leadOffers.get(proposalId);
    if (!proposal) return null;

    const updatedProposal: LeadOffer = {
      ...proposal,
      dealStatus: "RETRACTED",
      retractedAt: new Date(),
      retractionReason: reason,
    };

    this.leadOffers.set(proposalId, updatedProposal);
    return updatedProposal;
  }

  async recordEvaluation(
    proposalId: string,
    userId: string,
    userRole: "SELLER" | "LEAD_MANAGER"
  ): Promise<LeadOffer | null> {
    await delay();
    const proposal = this.leadOffers.get(proposalId);
    if (!proposal) return null;

    const updatedProposal: LeadOffer = {
      ...proposal,
      evaluatedByManager:
        userRole === "LEAD_MANAGER" ? true : proposal.evaluatedByManager,
      evaluatedBySeller:
        userRole === "SELLER" ? true : proposal.evaluatedBySeller,
    };

    this.leadOffers.set(proposalId, updatedProposal);
    return updatedProposal;
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

  // Leads
  getLeads: () => mockDataStore.getLeads(),
  getLeadById: (id: string) => mockDataStore.getLeadById(id),
  createLead: (data: Omit<Lead, "id" | "createdAt" | "updatedAt">) =>
    mockDataStore.createLead(data),
  updateLead: (id: string, data: Partial<Lead>) => mockDataStore.updateLead(id, data),
  deleteLead: (id: string) => mockDataStore.deleteLead(id),

  // Lead Offers (Proposals)
  getLeadOffers: () => mockDataStore.getLeadOffers(),
  getLeadOfferById: (id: string) => mockDataStore.getLeadOfferById(id),
  getLeadOffersByManagerId: (managerId: string) =>
    mockDataStore.getLeadOffersByManagerId(managerId),
  getLeadOffersByOfferId: (offerId: string) => mockDataStore.getLeadOffersByOfferId(offerId),
  getLeadOffersBySellerId: (sellerId: string) => mockDataStore.getLeadOffersBySellerId(sellerId),
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
  updateUserLanguage: (userId: string, language: "en" | "es") =>
    mockDataStore.updateUserLanguage(userId, language),
  updateUser: (userId: string, data: Partial<Omit<User, "id" | "role" | "createdAt">>) =>
    mockDataStore.updateUser(userId, data),
  changePassword: (userId: string, currentPassword: string, newPassword: string) =>
    mockDataStore.changePassword(userId, currentPassword, newPassword),

  // Ratings
  createRating: (data: Omit<Rating, "id" | "createdAt">) =>
    mockDataStore.createRating(data),
  getRatingsByUser: (userId: string) => mockDataStore.getRatingsByUser(userId),
  getRatingsByRater: (raterId: string) => mockDataStore.getRatingsByRater(raterId),
  getUserReputation: (userId: string) => mockDataStore.getUserReputation(userId),

  // Tickets
  createTicket: (data: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status" | "resolvedAt">) =>
    mockDataStore.createTicket(data),
  getTicketById: (id: string) => mockDataStore.getTicketById(id),
  getTicketsByReporter: (reporterId: string) => mockDataStore.getTicketsByReporter(reporterId),
  getTicketsByProposal: (proposalId: string) => mockDataStore.getTicketsByProposal(proposalId),

  // Deal Completion
  markDealCompleted: (proposalId: string) => mockDataStore.markDealCompleted(proposalId),
  retractDeal: (proposalId: string, reason: string, userId: string) =>
    mockDataStore.retractDeal(proposalId, reason, userId),
  recordEvaluation: (proposalId: string, userId: string, userRole: "SELLER" | "LEAD_MANAGER") =>
    mockDataStore.recordEvaluation(proposalId, userId, userRole),
};
