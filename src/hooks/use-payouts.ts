import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockProvider } from "@/lib/mockProvider";

/**
 * Hook for fetching all payouts
 */
export function usePayouts() {
  return useQuery({
    queryKey: ["payouts"],
    queryFn: () => mockProvider.getPayouts(),
  });
}

/**
 * Hook for fetching a single payout by ID
 */
export function usePayout(id: string) {
  return useQuery({
    queryKey: ["payouts", id],
    queryFn: () => mockProvider.getPayoutById(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching payouts by lead offer ID
 */
export function usePayoutsByLeadOffer(leadOfferId: string) {
  return useQuery({
    queryKey: ["payouts", "leadOffer", leadOfferId],
    queryFn: () => mockProvider.getPayoutsByLeadOfferId(leadOfferId),
    enabled: !!leadOfferId,
  });
}

/**
 * Hook for fetching payouts by manager ID
 */
export function usePayoutsByManager(managerId: string) {
  return useQuery({
    queryKey: ["payouts", "manager", managerId],
    queryFn: () => mockProvider.getPayoutsByManagerId(managerId),
    enabled: !!managerId,
  });
}

/**
 * Hook for updating payout status (admin only)
 */
export function useUpdatePayoutStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "PENDING" | "PAID" }) =>
      mockProvider.updatePayoutStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidate specific payout and all payouts queries
      queryClient.invalidateQueries({ queryKey: ["payouts", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
    },
  });
}
