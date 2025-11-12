import { useMemo } from "react";
import type { LeadOffer, LeadStatus } from "@/types";

/**
 * Filter configuration for proposals
 */
export interface ProposalFilters {
  search: string;
  status: LeadStatus | "all";
}

/**
 * Sort configuration for proposals
 */
export interface ProposalSort {
  field: "createdAt" | "qualifiedAt" | "status";
  direction: "asc" | "desc";
}

/**
 * Hook for filtering and sorting proposals (LeadOffers) in client-side
 * Implements efficient memoization to avoid unnecessary recomputations
 * 
 * @param proposals - Array of proposals to filter and sort
 * @param filters - Filter criteria
 * @param sort - Sort configuration (defaults to createdAt DESC)
 * @returns Filtered and sorted array of proposals
 */
export function useFilteredProposals(
  proposals: LeadOffer[] | undefined,
  filters: ProposalFilters,
  sort: ProposalSort = { field: "createdAt", direction: "desc" }
): LeadOffer[] {
  return useMemo(() => {
    if (!proposals) return [];

    // Step 1: Apply filters
    const filtered = proposals.filter((proposal) => {
      // Status filter
      if (filters.status && filters.status !== "all") {
        if (proposal.status !== filters.status) return false;
      }

      // Note: Search filter for offer name and lead manager name
      // is handled at the component level since we need to fetch
      // related entities (offers and users) for each proposal

      return true;
    });

    // Step 2: Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (sort.field) {
        case "createdAt":
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "qualifiedAt":
          // Handle null dates - put them at the end
          if (!a.qualifiedAt && !b.qualifiedAt) compareValue = 0;
          else if (!a.qualifiedAt) compareValue = 1;
          else if (!b.qualifiedAt) compareValue = -1;
          else compareValue = new Date(a.qualifiedAt).getTime() - new Date(b.qualifiedAt).getTime();
          break;
        case "status":
          // Define status order: PENDING, WON, LOST
          const statusOrder = { PENDING: 1, WON: 2, LOST: 3 };
          compareValue = statusOrder[a.status] - statusOrder[b.status];
          break;
      }

      return sort.direction === "asc" ? compareValue : -compareValue;
    });

    return filtered;
  }, [proposals, filters, sort]);
}

/**
 * Extract unique status values from proposals for filter dropdowns
 */
export function useProposalFilterOptions(proposals: LeadOffer[] | undefined) {
  return useMemo(() => {
    if (!proposals || proposals.length === 0) {
      return {
        statuses: ["PENDING", "WON", "LOST"] as LeadStatus[],
      };
    }

    const statuses = Array.from(new Set(proposals.map((p) => p.status))) as LeadStatus[];
    // Sort in a logical order
    const statusOrder = { PENDING: 1, WON: 2, LOST: 3 };
    statuses.sort((a, b) => statusOrder[a] - statusOrder[b]);

    return {
      statuses,
    };
  }, [proposals]);
}
