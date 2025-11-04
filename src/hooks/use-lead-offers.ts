import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockProvider } from "@/lib/mockProvider";
import type { LeadOffer, LeadStatus } from "@/types";

/**
 * Hook for fetching all lead offers (proposals)
 */
export function useLeadOffers() {
  return useQuery({
    queryKey: ["leadOffers"],
    queryFn: () => mockProvider.getLeadOffers(),
  });
}

/**
 * Hook for fetching a single lead offer by ID
 */
export function useLeadOffer(id: string) {
  return useQuery({
    queryKey: ["leadOffers", id],
    queryFn: () => mockProvider.getLeadOfferById(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching lead offers by manager ID (lead manager's proposals)
 */
export function useLeadOffersByManager(managerId: string) {
  return useQuery({
    queryKey: ["leadOffers", "manager", managerId],
    queryFn: () => mockProvider.getLeadOffersByManagerId(managerId),
    enabled: !!managerId,
  });
}

/**
 * Hook for fetching lead offers by offer ID
 */
export function useLeadOffersByOffer(offerId: string) {
  return useQuery({
    queryKey: ["leadOffers", "offer", offerId],
    queryFn: () => mockProvider.getLeadOffersByOfferId(offerId),
    enabled: !!offerId,
  });
}

/**
 * Hook for creating a new lead offer (proposal)
 */
export function useCreateLeadOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<LeadOffer, "id" | "createdAt" | "status" | "assignedAt" | "qualifiedAt">
    ) => mockProvider.createLeadOffer(data),
    onSuccess: () => {
      // Invalidate all lead offers queries
      queryClient.invalidateQueries({ queryKey: ["leadOffers"] });
    },
  });
}

/**
 * Hook for updating lead offer status (PENDING → WON/LOST)
 * Used for lead qualification
 */
export function useUpdateLeadOfferStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      mockProvider.updateLeadOfferStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidate lead offers and payouts (payouts are created when status is WON)
      queryClient.invalidateQueries({ queryKey: ["leadOffers", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["leadOffers"] });
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
    },
  });
}
