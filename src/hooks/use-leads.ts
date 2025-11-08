import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "@/lib/dataProvider";
import type { Lead } from "@/types";
import { toast } from "sonner";

/**
 * Hook for fetching all leads
 */
export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: () => dataProvider.getLeads(),
  });
}

/**
 * Hook for fetching a single lead by ID
 */
export function useLead(id: string) {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => dataProvider.getLeadById(id),
    enabled: !!id,
  });
}

/**
 * Hook for creating a new lead with optimistic update
 */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Lead, "id" | "createdAt" | "updatedAt">) =>
      dataProvider.createLead(data),
    onMutate: async (newLead) => {
      await queryClient.cancelQueries({ queryKey: ["leads"] });

      const previousLeads = queryClient.getQueryData<Lead[]>(["leads"]);

      if (previousLeads) {
        const optimisticLead: Lead = {
          ...newLead,
          id: `temp-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        queryClient.setQueryData<Lead[]>(["leads"], [optimisticLead, ...previousLeads]);
      }

      return { previousLeads };
    },
    onSuccess: () => {
      toast.success("Success", {
        description: "Lead created successfully",
      });
    },
    onError: (error, _, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(["leads"], context.previousLeads);
      }
      toast.error("Error", {
        description: "Failed to create lead. Please try again.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

/**
 * Hook for updating a lead
 */
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      dataProvider.updateLead(id, data),
    onSuccess: () => {
      toast.success("Success", {
        description: "Lead updated successfully",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to update lead. Please try again.",
      });
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

/**
 * Hook for deleting a lead
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dataProvider.deleteLead(id),
    onSuccess: () => {
      toast.success("Success", {
        description: "Lead deleted successfully",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to delete lead. Please try again.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
