import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "@/lib/dataProvider";
import type { PaymentStatus } from "@/types";

/**
 * Hook for fetching all payments
 */
export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => dataProvider.getPayments(),
  });
}

/**
 * Hook for fetching a single payment by ID
 */
export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => dataProvider.getPaymentById(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching payments by offer ID
 */
export function usePaymentsByOffer(offerId: string) {
  return useQuery({
    queryKey: ["payments", "offer", offerId],
    queryFn: () => dataProvider.getPaymentsByOfferId(offerId),
    enabled: !!offerId,
  });
}

/**
 * Hook for fetching payments by seller ID
 */
export function usePaymentsBySeller(sellerId: string) {
  return useQuery({
    queryKey: ["payments", "seller", sellerId],
    queryFn: () => dataProvider.getPaymentsBySellerId(sellerId),
    enabled: !!sellerId,
  });
}

/**
 * Hook for fetching payments by lead manager ID
 */
export function usePaymentsByLeadManager(leadManagerId: string) {
  return useQuery({
    queryKey: ["payments", "leadManager", leadManagerId],
    queryFn: () => dataProvider.getPaymentsByLeadManagerId(leadManagerId),
    enabled: !!leadManagerId,
  });
}

/**
 * Hook for fetching overdue payments
 */
export function useOverduePayments() {
  return useQuery({
    queryKey: ["payments", "overdue"],
    queryFn: () => dataProvider.getOverduePayments(),
  });
}

/**
 * Hook for fetching upcoming payments
 */
export function useUpcomingPayments(daysAhead: number = 7) {
  return useQuery({
    queryKey: ["payments", "upcoming", daysAhead],
    queryFn: () => dataProvider.getUpcomingPayments(daysAhead),
  });
}

/**
 * Hook for updating payment status with optimistic update
 * Note: Success/error toasts should be handled by the consuming component for i18n support
 */
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: PaymentStatus;
      notes?: string;
    }) => dataProvider.updatePaymentStatus(id, status, notes),
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "overdue"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "upcoming"] });
    },
  });
}

/**
 * Hook for creating a new payment
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof dataProvider.createPayment>[0]) =>
      dataProvider.createPayment(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
