import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "@/lib/dataProvider";
import type { TicketCategory } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "./use-translation";

interface EvaluationData {
  proposalId: string;
  rating: number;
  review?: string;
  raterId: string;
  ratedUserId: string;
  userRole: "SELLER" | "LEAD_MANAGER";
  relatedOfferId?: string;
}

interface TicketData {
  reporterId: string;
  reportedUserId?: string;
  relatedProposalId: string;
  relatedOfferId?: string;
  category: TicketCategory;
  description: string;
}

interface RetractionData {
  proposalId: string;
  reason: string;
  userId: string;
}

/**
 * Hook for managing deal evaluation, tickets, and retractions
 */
export function useDealEvaluation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Submit evaluation (rating + review)
  const submitEvaluation = useMutation({
    mutationFn: async (data: EvaluationData) => {
      // Create the rating
      const rating = await dataProvider.createRating({
        raterId: data.raterId,
        ratedUserId: data.ratedUserId,
        score: data.rating,
        feedback: data.review,
        context: "PROPOSAL_ACCEPTED",
        relatedOfferId: data.relatedOfferId,
        relatedProposalId: data.proposalId,
      });

      // Record that this user has evaluated
      await dataProvider.recordEvaluation(
        data.proposalId,
        data.raterId,
        data.userRole
      );

      return rating;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["leadOffers"] });
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      toast.success(t("evaluation.completed"));
    },
    onError: (error) => {
      console.error("Failed to submit evaluation:", error);
      toast.error("Failed to submit evaluation");
    },
  });

  // Create dispute ticket
  const createTicket = useMutation({
    mutationFn: async (data: TicketData) => {
      return await dataProvider.createTicket(data);
    },
    onSuccess: () => {
      toast.success(t("ticket.success"));
    },
    onError: (error) => {
      console.error("Failed to create ticket:", error);
      toast.error(t("ticket.error"));
    },
  });

  // Retract deal
  const retractDeal = useMutation({
    mutationFn: async (data: RetractionData) => {
      return await dataProvider.retractDeal(
        data.proposalId,
        data.reason,
        data.userId
      );
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["leadOffers"] });
      toast.success(t("retraction.success"));
    },
    onError: (error) => {
      console.error("Failed to retract deal:", error);
      toast.error(t("retraction.error"));
    },
  });

  // Mark deal as completed
  const markCompleted = useMutation({
    mutationFn: async (proposalId: string) => {
      return await dataProvider.markDealCompleted(proposalId);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["leadOffers"] });
      toast.success(t("evaluation.dealCompleted"));
    },
    onError: (error) => {
      console.error("Failed to mark deal completed:", error);
      toast.error("Failed to mark deal as completed");
    },
  });

  return {
    submitEvaluation,
    createTicket,
    retractDeal,
    markCompleted,
  };
}
