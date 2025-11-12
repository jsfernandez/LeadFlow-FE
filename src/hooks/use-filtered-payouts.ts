import { useMemo } from "react";
import type { Payout } from "@/types";

/**
 * Filter configuration for payouts
 */
export interface PayoutFilters {
  search: string;
  status: "PENDING" | "PAID" | "all";
}

/**
 * Sort configuration for payouts
 */
export interface PayoutSort {
  field: "createdAt" | "paidAt" | "amount" | "status";
  direction: "asc" | "desc";
}

/**
 * Hook for filtering and sorting payouts in client-side
 * Implements efficient memoization to avoid unnecessary recomputations
 * 
 * @param payouts - Array of payouts to filter and sort
 * @param filters - Filter criteria
 * @param sort - Sort configuration (defaults to createdAt DESC)
 * @returns Filtered and sorted array of payouts
 */
export function useFilteredPayouts(
  payouts: Payout[] | undefined,
  filters: PayoutFilters,
  sort: PayoutSort = { field: "createdAt", direction: "desc" }
): Payout[] {
  return useMemo(() => {
    if (!payouts) return [];

    // Step 1: Apply filters
    const filtered = payouts.filter((payout) => {
      // Status filter
      if (filters.status && filters.status !== "all") {
        if (payout.status !== filters.status) return false;
      }

      // Note: Search filter for lead manager name
      // is handled at the component level since we need to fetch
      // related entities (lead offers, leads, users) for each payout

      return true;
    });

    // Step 2: Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (sort.field) {
        case "amount":
          compareValue = a.amount - b.amount;
          break;
        case "createdAt":
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "paidAt":
          // Handle null dates - put them at the end
          if (!a.paidAt && !b.paidAt) compareValue = 0;
          else if (!a.paidAt) compareValue = 1;
          else if (!b.paidAt) compareValue = -1;
          else compareValue = new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime();
          break;
        case "status":
          // PENDING first, then PAID
          const statusOrder = { PENDING: 1, PAID: 2 };
          compareValue = statusOrder[a.status] - statusOrder[b.status];
          break;
      }

      return sort.direction === "asc" ? compareValue : -compareValue;
    });

    return filtered;
  }, [payouts, filters, sort]);
}

/**
 * Extract unique status values from payouts for filter dropdowns
 */
export function usePayoutFilterOptions(payouts: Payout[] | undefined) {
  return useMemo(() => {
    if (!payouts || payouts.length === 0) {
      return {
        statuses: ["PENDING", "PAID"] as ("PENDING" | "PAID")[],
      };
    }

    const statuses = Array.from(new Set(payouts.map((p) => p.status))) as ("PENDING" | "PAID")[];
    // Sort: PENDING first, then PAID
    statuses.sort((a, b) => {
      const order = { PENDING: 1, PAID: 2 };
      return order[a] - order[b];
    });

    return {
      statuses,
    };
  }, [payouts]);
}
