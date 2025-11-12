import { useMemo } from "react";
import type { Offer, OfferStatus } from "@/types";

/**
 * Filter configuration for offers
 */
export interface OfferFilters {
  search: string;
  status: OfferStatus | "all";
}

/**
 * Sort configuration for offers
 */
export interface OfferSort {
  field: "createdAt" | "price" | "title";
  direction: "asc" | "desc";
}

/**
 * Hook for filtering and sorting offers in client-side
 * Implements efficient memoization to avoid unnecessary recomputations
 * 
 * @param offers - Array of offers to filter and sort
 * @param filters - Filter criteria
 * @param sort - Sort configuration (defaults to createdAt DESC)
 * @returns Filtered and sorted array of offers
 */
export function useFilteredOffers(
  offers: Offer[] | undefined,
  filters: OfferFilters,
  sort: OfferSort = { field: "createdAt", direction: "desc" }
): Offer[] {
  return useMemo(() => {
    if (!offers) return [];

    // Step 1: Apply filters
    const filtered = offers.filter((offer) => {
      // Search filter (title, description)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          offer.title.toLowerCase().includes(searchLower) ||
          offer.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status !== "all") {
        if (offer.status !== filters.status) return false;
      }

      return true;
    });

    // Step 2: Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (sort.field) {
        case "title":
          compareValue = a.title.localeCompare(b.title);
          break;
        case "price":
          compareValue = a.price - b.price;
          break;
        case "createdAt":
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sort.direction === "asc" ? compareValue : -compareValue;
    });

    return filtered;
  }, [offers, filters, sort]);
}

/**
 * Extract unique status values from offers for filter dropdowns
 */
export function useOfferFilterOptions(offers: Offer[] | undefined) {
  return useMemo(() => {
    if (!offers || offers.length === 0) {
      return {
        statuses: ["ACTIVE", "INACTIVE", "ARCHIVED"] as OfferStatus[],
      };
    }

    const statuses = Array.from(new Set(offers.map((o) => o.status))) as OfferStatus[];
    statuses.sort();

    return {
      statuses,
    };
  }, [offers]);
}
