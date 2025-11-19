"use client";

import { useState } from "react";
import { Star, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EvaluationModal } from "@/components/ui/evaluation-modal";
import { DisputeTicketModal } from "@/components/ui/dispute-ticket-modal";
import { RetractionModal } from "@/components/ui/retraction-modal";
import { useDealEvaluation } from "@/hooks/use-deal-evaluation";
import { useTranslation } from "@/hooks/use-translation";
import type { LeadOffer, TicketCategory } from "@/types";

interface DealEvaluationActionsProps {
  proposal: LeadOffer;
  currentUserId: string;
  currentUserRole: "SELLER" | "LEAD_MANAGER";
  otherUserId: string; // The user being rated (seller or lead manager)
  offerId: string;
}

/**
 * Deal Evaluation Actions Component
 * Displays evaluation actions based on deal status and user evaluation status
 */
export function DealEvaluationActions({
  proposal,
  currentUserId,
  currentUserRole,
  otherUserId,
  offerId,
}: DealEvaluationActionsProps) {
  const { t } = useTranslation();
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [showRetraction, setShowRetraction] = useState(false);

  const {
    submitEvaluation,
    createTicket,
    retractDeal,
    markCompleted,
  } = useDealEvaluation();

  // Check if deal is completed
  const isCompleted = proposal.dealStatus === "COMPLETED";
  const isRetracted = proposal.dealStatus === "RETRACTED";
  
  // Check if current user has already evaluated
  const hasEvaluated =
    currentUserRole === "SELLER"
      ? proposal.evaluatedBySeller
      : proposal.evaluatedByManager;

  // Check if proposal is qualified (WON or LOST) to enable completion
  const canMarkCompleted = 
    (proposal.status === "WON" || proposal.status === "LOST") &&
    !isCompleted &&
    !isRetracted;

  const handleMarkCompleted = async () => {
    await markCompleted.mutateAsync(proposal.id);
  };

  const handleSubmitEvaluation = async (rating: number, review?: string) => {
    await submitEvaluation.mutateAsync({
      proposalId: proposal.id,
      rating,
      review,
      raterId: currentUserId,
      ratedUserId: otherUserId,
      userRole: currentUserRole,
      relatedOfferId: offerId,
    });
  };

  const handleCreateTicket = async (
    category: TicketCategory,
    description: string
  ) => {
    await createTicket.mutateAsync({
      reporterId: currentUserId,
      reportedUserId: otherUserId,
      relatedProposalId: proposal.id,
      relatedOfferId: offerId,
      category,
      description,
    });
  };

  const handleRetract = async (reason: string) => {
    await retractDeal.mutateAsync({
      proposalId: proposal.id,
      reason,
      userId: currentUserId,
    });
  };

  // If retracted, show status
  if (isRetracted) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="destructive" className="gap-1">
          <Ban className="h-3 w-3" />
          {t("retraction.retracted")}
        </Badge>
      </div>
    );
  }

  // If not completed yet but can be, show mark completed button
  if (canMarkCompleted) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleMarkCompleted}
        disabled={markCompleted.isPending}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        {t("evaluation.markCompleted")}
      </Button>
    );
  }

  // If completed but not evaluated, show evaluate button
  if (isCompleted && !hasEvaluated) {
    return (
      <>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            onClick={() => setShowEvaluation(true)}
            className="gap-2"
          >
            <Star className="h-4 w-4" />
            {t("evaluation.title")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowRetraction(true)}
            className="gap-2"
          >
            <Ban className="h-4 w-4" />
            {t("retraction.retractButton")}
          </Button>
        </div>

        <EvaluationModal
          open={showEvaluation}
          onOpenChange={setShowEvaluation}
          onSubmit={handleSubmitEvaluation}
          onDenounce={() => {
            setShowEvaluation(false);
            setShowDispute(true);
          }}
        />

        <DisputeTicketModal
          open={showDispute}
          onOpenChange={setShowDispute}
          onSubmit={handleCreateTicket}
          proposalId={proposal.id}
          reportedUserId={otherUserId}
          relatedOfferId={offerId}
        />

        <RetractionModal
          open={showRetraction}
          onOpenChange={setShowRetraction}
          onConfirm={handleRetract}
          proposalId={proposal.id}
        />
      </>
    );
  }

  // If completed and evaluated, show status
  if (isCompleted && hasEvaluated) {
    return (
      <Badge variant="outline" className="gap-1 bg-green-600/10 text-green-600 border-green-600/20">
        <CheckCircle className="h-3 w-3" />
        {t("evaluation.completed")}
      </Badge>
    );
  }

  // Default: no actions available
  return null;
}
