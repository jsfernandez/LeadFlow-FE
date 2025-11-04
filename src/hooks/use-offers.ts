import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockProvider } from "@/lib/mockProvider";
import type { Offer, OfferStatus } from "@/types";

/**
 * Hook for fetching all offers
 */
export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: () => mockProvider.getOffers(),
  });
}

/**
 * Hook for fetching a single offer by ID
 */
export function useOffer(id: string) {
  return useQuery({
    queryKey: ["offers", id],
    queryFn: () => mockProvider.getOfferById(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching offers by seller ID
 */
export function useOffersBySeller(sellerId: string) {
  return useQuery({
    queryKey: ["offers", "seller", sellerId],
    queryFn: () => mockProvider.getOffersBySellerId(sellerId),
    enabled: !!sellerId,
  });
}

/**
 * Hook for creating a new offer
 */
export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Offer, "id" | "createdAt" | "updatedAt">) =>
      mockProvider.createOffer(data),
    onSuccess: () => {
      // Invalidate and refetch offers queries
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

/**
 * Hook for updating an offer
 */
export function useUpdateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Offer> }) =>
      mockProvider.updateOffer(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific offer and all offers queries
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

/**
 * Hook for updating offer status
 */
export function useUpdateOfferStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OfferStatus }) =>
      mockProvider.updateOffer(id, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

/**
 * Hook for deleting an offer
 */
export function useDeleteOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mockProvider.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}
