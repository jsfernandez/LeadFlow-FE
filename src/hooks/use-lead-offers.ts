import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "@/lib/dataProvider";
import type { LeadOffer, LeadStatus } from "@/types";
import { toast } from "sonner";

/**
 * Hook for fetching all lead offers (proposals)
 */
export function useLeadOffers() {
  return useQuery({
    queryKey: ["leadOffers"],
    queryFn: () => dataProvider.getLeadOffers(),
  });
}

/**
 * Hook for fetching a single lead offer by ID
 */
export function useLeadOffer(id: string) {
  return useQuery({
    queryKey: ["leadOffers", id],
    queryFn: () => dataProvider.getLeadOfferById(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching lead offers by manager ID (lead manager's proposals)
 */
export function useLeadOffersByManager(managerId: string) {
  return useQuery({
    queryKey: ["leadOffers", "manager", managerId],
    queryFn: () => dataProvider.getLeadOffersByManagerId(managerId),
    enabled: !!managerId,
  });
}

/**
 * Hook for fetching lead offers by offer ID
 */
export function useLeadOffersByOffer(offerId: string) {
  return useQuery({
    queryKey: ["leadOffers", "offer", offerId],
    queryFn: () => dataProvider.getLeadOffersByOfferId(offerId),
    enabled: !!offerId,
  });
}

/**
 * Hook for fetching lead offers by seller ID (seller's proposals)
 */
export function useLeadOffersBySeller(sellerId: string) {
  return useQuery({
    queryKey: ["leadOffers", "seller", sellerId],
    queryFn: () => dataProvider.getLeadOffersBySellerId(sellerId),
    enabled: !!sellerId,
  });
}

/**
 * Hook for creating a new lead offer (proposal) with optimistic update
 */
export function useCreateLeadOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<LeadOffer, "id" | "createdAt" | "status" | "assignedAt" | "qualifiedAt">
    ) => dataProvider.createLeadOffer(data),
    onMutate: async (newLeadOffer) => {
      await queryClient.cancelQueries({ queryKey: ["leadOffers"] });
      
      const previousLeadOffers = queryClient.getQueryData<LeadOffer[]>(["leadOffers"]);
      
      if (previousLeadOffers) {
        const optimisticLeadOffer: LeadOffer = {
          ...newLeadOffer,
          id: `temp-${Date.now()}`,
          status: "PENDING",
          createdAt: new Date(),
        };
        queryClient.setQueryData<LeadOffer[]>(["leadOffers"], [optimisticLeadOffer, ...previousLeadOffers]);
      }
      
      return { previousLeadOffers };
    },
    onSuccess: () => {
      toast.success("Success", {
        description: "Proposal submitted successfully",
      });
    },
    onError: (error, _, context) => {
      if (context?.previousLeadOffers) {
        queryClient.setQueryData(["leadOffers"], context.previousLeadOffers);
      }
      toast.error("Error", {
        description: "Failed to submit proposal. Please try again.",
      });
    },
    onSettled: () => {
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
      dataProvider.updateLeadOfferStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["leadOffers", id] });
      
      const previousLeadOffer = queryClient.getQueryData<LeadOffer>(["leadOffers", id]);
      
      if (previousLeadOffer) {
        queryClient.setQueryData<LeadOffer>(["leadOffers", id], {
          ...previousLeadOffer,
          status,
          qualifiedAt: new Date(),
        });
      }
      
      return { previousLeadOffer };
    },
    onSuccess: (_, variables) => {
      const statusText = variables.status === "WON" ? "won" : "lost";
      toast.success("Success", {
        description: `Lead marked as ${statusText.toUpperCase()}`,
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousLeadOffer) {
        queryClient.setQueryData(["leadOffers", variables.id], context.previousLeadOffer);
      }
      toast.error("Error", {
        description: "Failed to update lead status. Please try again.",
      });
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leadOffers", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["leadOffers"] });
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
    },
  });
}
