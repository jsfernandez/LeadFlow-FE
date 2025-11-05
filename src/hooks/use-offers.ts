import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "@/lib/dataProvider";
import type { Offer, OfferStatus } from "@/types";
import { toast } from "sonner";

/**
 * Hook for fetching all offers
 */
export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: () => dataProvider.getOffers(),
  });
}

/**
 * Hook for fetching a single offer by ID
 */
export function useOffer(id: string) {
  return useQuery({
    queryKey: ["offers", id],
    queryFn: () => dataProvider.getOfferById(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching offers by seller ID
 */
export function useOffersBySeller(sellerId: string) {
  return useQuery({
    queryKey: ["offers", "seller", sellerId],
    queryFn: () => dataProvider.getOffersBySellerId(sellerId),
    enabled: !!sellerId,
  });
}

/**
 * Hook for creating a new offer with optimistic update
 */
export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Offer, "id" | "createdAt" | "updatedAt">) =>
      dataProvider.createOffer(data),
    onMutate: async (newOffer) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["offers"] });

      // Snapshot the previous value
      const previousOffers = queryClient.getQueryData<Offer[]>(["offers"]);

      // Optimistically update to the new value
      if (previousOffers) {
        const optimisticOffer: Offer = {
          ...newOffer,
          id: `temp-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        queryClient.setQueryData<Offer[]>(["offers"], [optimisticOffer, ...previousOffers]);
      }

      return { previousOffers };
    },
    onSuccess: () => {
      toast.success("Success", {
        description: "Offer created successfully",
      });
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousOffers) {
        queryClient.setQueryData(["offers"], context.previousOffers);
      }
      toast.error("Error", {
        description: "Failed to create offer. Please try again.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

/**
 * Hook for updating an offer with optimistic update
 */
export function useUpdateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Offer> }) =>
      dataProvider.updateOffer(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["offers", id] });
      
      const previousOffer = queryClient.getQueryData<Offer>(["offers", id]);
      
      if (previousOffer) {
        queryClient.setQueryData<Offer>(["offers", id], {
          ...previousOffer,
          ...data,
          updatedAt: new Date(),
        });
      }
      
      return { previousOffer };
    },
    onSuccess: () => {
      toast.success("Success", {
        description: "Offer updated successfully",
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousOffer) {
        queryClient.setQueryData(["offers", variables.id], context.previousOffer);
      }
      toast.error("Error", {
        description: "Failed to update offer. Please try again.",
      });
    },
    onSettled: (_, __, variables) => {
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
      dataProvider.updateOffer(id, { status }),
    onSuccess: () => {
      toast.success("Success", {
        description: "Offer status updated successfully",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to update offer status. Please try again.",
      });
    },
    onSettled: (_, __, variables) => {
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
    mutationFn: (id: string) => dataProvider.deleteOffer(id),
    onSuccess: () => {
      toast.success("Success", {
        description: "Offer deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to delete offer. Please try again.",
      });
    },
  });
}
