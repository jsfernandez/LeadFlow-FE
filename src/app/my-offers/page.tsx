"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingModal } from "@/components/ui/rating-modal";
import { useOffersBySeller, useUpdateOfferStatus } from "@/hooks/use-offers";
import { useLeadOffers } from "@/hooks/use-lead-offers";
import { useCreateRating } from "@/hooks/use-ratings";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import type { OfferStatus, LeadOffer } from "@/types";
import { dataProvider } from "@/lib/dataProvider";
import { useQuery } from "@tanstack/react-query";

// Helper component to fetch and display lead field
const LeadCell = ({ leadId, field }: { leadId: string; field: "fullName" | "email" | "phone" }) => {
  const { t } = useTranslation();
  const { data: lead } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: () => dataProvider.getLeadById(leadId),
    enabled: !!leadId,
  });

  if (!lead) {
    return <span className="text-sm text-muted-foreground">{t("common.loading")}</span>;
  }

  return <span>{lead[field]}</span>;
};

export default function MyOffersPage() {
  const { user } = useAuth();
  const { data: offers, isLoading } = useOffersBySeller(user?.id || "");
  const { data: allLeadOffers, isLoading: isLoadingProposals } = useLeadOffers();
  const updateStatus = useUpdateOfferStatus();
  const createRating = useCreateRating();
  
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<LeadOffer | null>(null);

  // Fetch lead manager details for rating
  const { data: leadManagerForRating } = useQuery({
    queryKey: ["user", selectedProposal?.leadManagerId],
    queryFn: () => 
      selectedProposal?.leadManagerId 
        ? dataProvider.getUserById(selectedProposal.leadManagerId)
        : null,
    enabled: !!selectedProposal?.leadManagerId,
  });

  // Filter proposals for seller's offers
  const myProposals = allLeadOffers?.filter((proposal) =>
    offers?.some((offer) => offer.id === proposal.offerId)
  ) || [];

  const handleStatusChange = async (offerId: string, newStatus: OfferStatus) => {
    try {
      await updateStatus.mutateAsync({ id: offerId, status: newStatus });
    } catch (error) {
      console.error("Failed to update offer status:", error);
    }
  };

  const handleRateLeadManager = (proposal: LeadOffer) => {
    setSelectedProposal(proposal);
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = async (score: number, feedback?: string) => {
    if (!user || !selectedProposal || !leadManagerForRating) return;

    // Determine rating context based on proposal status
    let context: "PROPOSAL_ACCEPTED" | "PROPOSAL_REJECTED" | "LEAD_MANAGER_RATED";
    if (selectedProposal.status === "WON") {
      context = "PROPOSAL_ACCEPTED";
    } else if (selectedProposal.status === "LOST") {
      context = "PROPOSAL_REJECTED";
    } else {
      // Pending proposals shouldn't be rated, but handle gracefully
      console.warn("Attempting to rate a PENDING proposal");
      context = "PROPOSAL_ACCEPTED";
    }

    await createRating.mutateAsync({
      raterId: user.id,
      ratedUserId: selectedProposal.leadManagerId,
      score,
      feedback,
      context,
      relatedOfferId: selectedProposal.offerId,
      relatedProposalId: selectedProposal.id,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      ACTIVE: "bg-green-600 text-white",
      INACTIVE: "bg-gray-600 text-white",
      ARCHIVED: "bg-slate-600 text-white",
      PENDING: "bg-yellow-600 text-white",
      WON: "bg-green-600 text-white",
      LOST: "bg-red-600 text-white",
    };

    const statusTranslationKey = status.toLowerCase();
    return <Badge className={variants[status] || "bg-gray-600 text-white"}>{t(`common.${statusTranslationKey}`)}</Badge>;
  };

  const { t } = useTranslation();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t("myOffers.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("myOffers.subtitle")}</p>
        </div>
      </div>

      <Tabs defaultValue="offers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
          <TabsTrigger value="offers" className="text-sm sm:text-base">{t("myOffers.title")}</TabsTrigger>
          <TabsTrigger value="proposals" className="text-sm sm:text-base">
            {t("myOffers.proposalsReceived")}
            {myProposals.length > 0 && (
              <Badge className="ml-2 bg-primary/20 text-primary text-xs">{myProposals.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>{t("myOffers.yourOffers")}</CardTitle>
              <CardDescription>{t("myOffers.offersYouCreated")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">{t("myOffers.loadingYourOffers")}</p>
              ) : offers && offers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">{t("myOffers.table.title")}</TableHead>
                        <TableHead className="min-w-[200px]">{t("myOffers.table.description")}</TableHead>
                        <TableHead className="min-w-[120px]">{t("myOffers.table.price")}</TableHead>
                        <TableHead className="min-w-[100px]">{t("myOffers.table.status")}</TableHead>
                        <TableHead className="min-w-[120px]">{t("myOffers.table.created")}</TableHead>
                        <TableHead className="min-w-[150px]">{t("myOffers.table.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offers.map((offer) => (
                        <TableRow key={offer.id}>
                          <TableCell className="font-medium text-sm md:text-base">{offer.title}</TableCell>
                          <TableCell className="max-w-md truncate text-sm md:text-base">{offer.description}</TableCell>
                          <TableCell className="font-semibold text-primary text-sm md:text-base whitespace-nowrap">
                            ${offer.price.toFixed(2)}
                          </TableCell>
                          <TableCell>{getStatusBadge(offer.status)}</TableCell>
                          <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(offer.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={offer.status}
                              onValueChange={(value) => handleStatusChange(offer.id, value as OfferStatus)}
                            >
                              <SelectTrigger className="w-full sm:w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ACTIVE">{t("myOffers.table.active")}</SelectItem>
                                <SelectItem value="INACTIVE">{t("myOffers.table.inactive")}</SelectItem>
                                <SelectItem value="ARCHIVED">{t("myOffers.table.archived")}</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("myOffers.haventCreatedOffers")}
                  </p>
                  <Button onClick={() => (window.location.href = "/offers")}>{t("myOffers.createYourFirstOffer")}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals">
          <Card>
            <CardHeader>
              <CardTitle>{t("myOffers.proposalsReceived")}</CardTitle>
              <CardDescription>{t("myOffers.proposalsReceivedDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProposals ? (
                <p className="text-sm text-muted-foreground">{t("myOffers.loadingProposals")}</p>
              ) : myProposals.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">{t("myOffers.table.customer")}</TableHead>
                        <TableHead className="min-w-[180px]">{t("myOffers.table.email")}</TableHead>
                        <TableHead className="min-w-[120px]">{t("myOffers.table.phone")}</TableHead>
                        <TableHead className="min-w-[150px]">{t("myOffers.table.offer")}</TableHead>
                        <TableHead className="min-w-[100px]">{t("myOffers.table.status")}</TableHead>
                        <TableHead className="min-w-[120px]">{t("myOffers.table.submitted")}</TableHead>
                        <TableHead className="min-w-[120px]">{t("myOffers.table.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myProposals.map((proposal) => {
                        const offer = offers?.find((o) => o.id === proposal.offerId);
                        return (
                          <TableRow key={proposal.id}>
                            <TableCell className="font-medium text-sm md:text-base">
                              <LeadCell leadId={proposal.leadId} field="fullName" />
                            </TableCell>
                            <TableCell className="text-sm md:text-base">
                              <LeadCell leadId={proposal.leadId} field="email" />
                            </TableCell>
                            <TableCell className="text-sm md:text-base">
                              <LeadCell leadId={proposal.leadId} field="phone" />
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-sm md:text-base">
                              {offer?.title || t("common.unknownOffer")}
                            </TableCell>
                            <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                            <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                              {new Date(proposal.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {proposal.status !== "PENDING" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRateLeadManager(proposal)}
                                  className="text-xs sm:text-sm whitespace-nowrap"
                                >
                                  {t("myOffers.rateLeadManager")}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {t("myOffers.noProposalsReceived")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rating Modal */}
      <RatingModal
        open={isRatingModalOpen}
        onOpenChange={setIsRatingModalOpen}
        onSubmit={handleSubmitRating}
        title={t("ratings.modal.title")}
        description={
          leadManagerForRating
            ? t("ratings.modal.rateForProposal").replace("{name}", leadManagerForRating.name)
            : t("ratings.modal.subtitle")
        }
      />
    </div>
  );
}
