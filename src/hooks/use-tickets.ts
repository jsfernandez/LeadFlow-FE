import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "@/lib/dataProvider";

/**
 * Hook for creating a ticket
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof dataProvider.createTicket>[0]) =>
      dataProvider.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

/**
 * Hook for fetching a single ticket by ID
 */
export function useTicket(id: string) {
  return useQuery({
    queryKey: ["tickets", id],
    queryFn: () => dataProvider.getTicketById(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching tickets by reporter ID
 */
export function useTicketsByReporter(reporterId: string) {
  return useQuery({
    queryKey: ["tickets", "reporter", reporterId],
    queryFn: () => dataProvider.getTicketsByReporter(reporterId),
    enabled: !!reporterId,
  });
}

/**
 * Hook for fetching tickets by proposal ID
 */
export function useTicketsByProposal(proposalId: string) {
  return useQuery({
    queryKey: ["tickets", "proposal", proposalId],
    queryFn: () => dataProvider.getTicketsByProposal(proposalId),
    enabled: !!proposalId,
  });
}
