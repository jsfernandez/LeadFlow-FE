"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { RatingModal } from "@/components/ui/rating-modal";
import { useLeadOffersByManager, useUpdateLeadOfferStatus } from "@/hooks/use-lead-offers";
import { useCreateRating } from "@/hooks/use-ratings";
import { useAuth } from "@/components/providers/auth-provider";
import type { LeadStatus, LeadOffer } from "@/types";
import { dataProvider } from "@/lib/dataProvider";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";

export default function AssignmentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: assignments, isLoading, error } = useLeadOffersByManager(user?.id || "");
  const updateStatus = useUpdateLeadOfferStatus();
  const createRating = useCreateRating();
  
  const [selectedAssignment, setSelectedAssignment] = useState<LeadOffer | null>(null);
  const [isQualifyDialogOpen, setIsQualifyDialogOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [assignmentToRate, setAssignmentToRate] = useState<LeadOffer | null>(null);

  // Fetch offer details for rating context
  const { data: offerForRating } = useQuery({
    queryKey: ["offer", assignmentToRate?.offerId],
    queryFn: () =>
      assignmentToRate?.offerId
        ? dataProvider.getOfferById(assignmentToRate.offerId)
        : null,
    enabled: !!assignmentToRate?.offerId,
  });

  // Fetch seller details for rating
  const { data: sellerForRating } = useQuery({
    queryKey: ["user", offerForRating?.sellerId],
    queryFn: () =>
      offerForRating?.sellerId
        ? dataProvider.getUserById(offerForRating.sellerId)
        : null,
    enabled: !!offerForRating?.sellerId,
  });

  const handleQualify = async (status: "WON" | "LOST") => {
    if (!selectedAssignment) return;

    try {
      await updateStatus.mutateAsync({
        id: selectedAssignment.id,
        status,
      });
      setIsQualifyDialogOpen(false);
      setSelectedAssignment(null);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Failed to qualify lead:", error);
    }
  };

  const openQualifyDialog = (assignment: LeadOffer) => {
    setSelectedAssignment(assignment);
    setIsQualifyDialogOpen(true);
  };

  const handleRateSeller = (assignment: LeadOffer) => {
    setAssignmentToRate(assignment);
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = async (score: number, feedback?: string) => {
    if (!user || !assignmentToRate || !offerForRating) return;

    await createRating.mutateAsync({
      raterId: user.id,
      ratedUserId: offerForRating.sellerId,
      score,
      feedback,
      context: "LEAD_MANAGER_RATED",
      relatedOfferId: assignmentToRate.offerId,
      relatedProposalId: assignmentToRate.id,
    });
  };

  const getStatusBadge = (status: LeadStatus) => {
    const variants: Record<LeadStatus, string> = {
      PENDING: "bg-yellow-600 text-white",
      WON: "bg-green-600 text-white",
      LOST: "bg-red-600 text-white",
    };

    return <Badge className={variants[status]}>{status}</Badge>;
  };

  // Filter only PENDING assignments (leads that need qualification)
  const pendingAssignments = assignments?.filter((a) => a.status === "PENDING") || [];
  const qualifiedAssignments = assignments?.filter((a) => a.status !== "PENDING") || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t("assignments.title")}</h1>
        <p className="text-muted-foreground">{t("assignments.subtitle")}</p>
      </div>

      {/* Pending Assignments - Need Action */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle>{t("assignments.pendingQualification")}</CardTitle>
          <CardDescription>{t("assignments.leadsAssignedNeedQualified")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={3} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">{t("assignments.failedToLoad")}</p>
            </div>
          ) : pendingAssignments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("assignments.customerName")}</TableHead>
                  <TableHead>{t("assignments.email")}</TableHead>
                  <TableHead>{t("assignments.phone")}</TableHead>
                  <TableHead>{t("assignments.status")}</TableHead>
                  <TableHead>{t("assignments.submitted")}</TableHead>
                  <TableHead>{t("assignments.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.customerName}</TableCell>
                    <TableCell>{assignment.customerEmail}</TableCell>
                    <TableCell>{assignment.customerPhone}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => openQualifyDialog(assignment)}
                      >
                        {t("assignments.qualifyLead")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Clipboard}
              title={t("assignments.noPendingAssignments")}
              description={t("assignments.allQualified")}
            />
          )}
        </CardContent>
      </Card>

      {/* Qualified Assignments - History */}
      <Card>
        <CardHeader>
          <CardTitle>{t("assignments.qualificationHistory")}</CardTitle>
          <CardDescription>{t("assignments.previouslyQualifiedLeads")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={3} />
          ) : qualifiedAssignments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("assignments.customerName")}</TableHead>
                  <TableHead>{t("assignments.email")}</TableHead>
                  <TableHead>{t("assignments.phone")}</TableHead>
                  <TableHead>{t("assignments.status")}</TableHead>
                  <TableHead>{t("assignments.submitted")}</TableHead>
                  <TableHead>{t("assignments.qualified")}</TableHead>
                  <TableHead>{t("assignments.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualifiedAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.customerName}</TableCell>
                    <TableCell>{assignment.customerEmail}</TableCell>
                    <TableCell>{assignment.customerPhone}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {assignment.qualifiedAt
                        ? new Date(assignment.qualifiedAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRateSeller(assignment)}
                      >
                        {t("assignments.rateCompany")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Document}
              title={t("assignments.noQualifiedLeadsYet")}
              description={t("assignments.qualifiedLeadsAppear")}
            />
          )}
        </CardContent>
      </Card>

      {/* Qualify Lead Dialog */}
      <Dialog open={isQualifyDialogOpen} onOpenChange={setIsQualifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("assignments.qualifyLeadTitle")}</DialogTitle>
            <DialogDescription>
              {t("assignments.qualifyLeadDescription")}
            </DialogDescription>
          </DialogHeader>

          {selectedAssignment && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div>
                  <p className="text-sm font-medium">{t("assignments.customer")}</p>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t("assignments.email")}</p>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t("assignments.phone")}</p>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.customerPhone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">{t("assignments.selectOutcome")}</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleQualify("WON")}
                    disabled={updateStatus.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {updateStatus.isPending ? t("assignments.processing") : t("assignments.markAsWonButton")}
                  </Button>
                  <Button
                    onClick={() => handleQualify("LOST")}
                    disabled={updateStatus.isPending}
                    variant="destructive"
                  >
                    {updateStatus.isPending ? t("assignments.processing") : t("assignments.markAsLostButton")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsQualifyDialogOpen(false);
                setSelectedAssignment(null);
              }}
              disabled={updateStatus.isPending}
            >
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <RatingModal
        open={isRatingModalOpen}
        onOpenChange={setIsRatingModalOpen}
        onSubmit={handleSubmitRating}
        title={t("ratings.rateCompany")}
        description={
          sellerForRating
            ? t("ratings.rateUser").replace("{name}", sellerForRating.name)
            : t("ratings.rateCompany")
        }
      />
    </div>
  );
}
