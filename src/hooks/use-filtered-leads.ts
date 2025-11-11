import { useMemo } from "react";
import type { Lead } from "@/types";

/**
 * Filter configuration for leads
 */
export interface LeadFilters {
  search: string;
  industry: string;
  country: string;
  city: string;
  gender: string;
  minRevenue?: number;
  maxRevenue?: number;
}

/**
 * Sort configuration for leads
 */
export interface LeadSort {
  field: "companyName" | "fullName" | "industry" | "country" | "createdAt" | "minRevenue" | "maxRevenue";
  direction: "asc" | "desc";
}

/**
 * Hook for filtering and sorting leads in client-side
 * Implements efficient memoization to avoid unnecessary recomputations
 * 
 * @param leads - Array of leads to filter and sort
 * @param filters - Filter criteria
 * @param sort - Sort configuration (defaults to createdAt DESC)
 * @returns Filtered and sorted array of leads
 */
export function useFilteredLeads(
  leads: Lead[] | undefined,
  filters: LeadFilters,
  sort: LeadSort = { field: "createdAt", direction: "desc" }
): Lead[] {
  return useMemo(() => {
    if (!leads) return [];

    // Step 1: Apply filters
    const filtered = leads.filter((lead) => {
      // Search filter (fullName, companyName, email, city, country)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          lead.fullName.toLowerCase().includes(searchLower) ||
          lead.companyName.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.city.toLowerCase().includes(searchLower) ||
          lead.country.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Industry filter
      if (filters.industry && filters.industry !== "all") {
        if (lead.industry !== filters.industry) return false;
      }

      // Country filter
      if (filters.country && filters.country !== "all") {
        if (lead.country !== filters.country) return false;
      }

      // City filter
      if (filters.city && filters.city !== "all") {
        if (lead.city !== filters.city) return false;
      }

      // Gender filter
      if (filters.gender && filters.gender !== "all") {
        if (lead.gender !== filters.gender) return false;
      }

      // Revenue range filter
      if (filters.minRevenue !== undefined && filters.minRevenue > 0) {
        if (lead.minRevenue < filters.minRevenue) return false;
      }

      if (filters.maxRevenue !== undefined && filters.maxRevenue > 0) {
        if (lead.maxRevenue > filters.maxRevenue) return false;
      }

      return true;
    });

    // Step 2: Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (sort.field) {
        case "companyName":
          compareValue = a.companyName.localeCompare(b.companyName);
          break;
        case "fullName":
          compareValue = a.fullName.localeCompare(b.fullName);
          break;
        case "industry":
          compareValue = a.industry.localeCompare(b.industry);
          break;
        case "country":
          compareValue = a.country.localeCompare(b.country);
          break;
        case "createdAt":
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "minRevenue":
          compareValue = a.minRevenue - b.minRevenue;
          break;
        case "maxRevenue":
          compareValue = a.maxRevenue - b.maxRevenue;
          break;
      }

      return sort.direction === "asc" ? compareValue : -compareValue;
    });

    return filtered;
  }, [leads, filters, sort]);
}

/**
 * Extract unique values from leads for filter dropdowns
 */
export function useLeadFilterOptions(leads: Lead[] | undefined) {
  return useMemo(() => {
    if (!leads || leads.length === 0) {
      return {
        industries: [],
        countries: [],
        cities: [],
        genders: [],
      };
    }

    const industries = Array.from(new Set(leads.map((l) => l.industry).filter(Boolean))) as string[];
    industries.sort();
    
    const countries = Array.from(new Set(leads.map((l) => l.country).filter(Boolean))) as string[];
    countries.sort();
    
    const cities = Array.from(new Set(leads.map((l) => l.city).filter(Boolean))) as string[];
    cities.sort();
    
    const genders = Array.from(new Set(leads.map((l) => l.gender).filter(Boolean))) as string[];
    genders.sort();

    return {
      industries,
      countries,
      cities,
      genders,
    };
  }, [leads]);
}
