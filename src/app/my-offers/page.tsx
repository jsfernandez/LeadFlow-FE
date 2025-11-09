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
import type { OfferStatus, LeadOffer } from "@/types";
import { dataProvider } from "@/lib/dataProvider";
import { useQuery } from "@tanstack/react-query";

// Helper component to fetch and display lead field
const LeadCell = ({ leadId, field }: { leadId: string; field: "fullName" | "email" | "phone" }) => {
  const { data: lead } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: () => dataProvider.getLeadById(leadId),
    enabled: !!leadId,
  });

  if (!lead) {
    return <span className="text-sm text-muted-foreground">Loading...</span>;
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

    return <Badge className={variants[status] || "bg-gray-600 text-white"}>{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Offers</h1>
          <p className="text-muted-foreground">Manage your created offers and proposals</p>
        </div>
      </div>

      <Tabs defaultValue="offers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="proposals">
            Proposals Received
            {myProposals.length > 0 && (
              <Badge className="ml-2 bg-primary/20 text-primary">{myProposals.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>Your Offers</CardTitle>
              <CardDescription>Offers you have created</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading your offers...</p>
              ) : offers && offers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell className="font-medium">{offer.title}</TableCell>
                        <TableCell className="max-w-md truncate">{offer.description}</TableCell>
                        <TableCell className="font-semibold text-primary">
                          ${offer.price.toFixed(2)}
                        </TableCell>
                        <TableCell>{getStatusBadge(offer.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={offer.status}
                            onValueChange={(value) => handleStatusChange(offer.id, value as OfferStatus)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="INACTIVE">Inactive</SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven&apos;t created any offers yet
                  </p>
                  <Button onClick={() => (window.location.href = "/offers")}>Create Your First Offer</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals">
          <Card>
            <CardHeader>
              <CardTitle>Proposals Received</CardTitle>
              <CardDescription>Lead proposals submitted for your offers</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProposals ? (
                <p className="text-sm text-muted-foreground">Loading proposals...</p>
              ) : myProposals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Offer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myProposals.map((proposal) => {
                      const offer = offers?.find((o) => o.id === proposal.offerId);
                      return (
                        <TableRow key={proposal.id}>
                          <TableCell className="font-medium">
                            <LeadCell leadId={proposal.leadId} field="fullName" />
                          </TableCell>
                          <TableCell>
                            <LeadCell leadId={proposal.leadId} field="email" />
                          </TableCell>
                          <TableCell>
                            <LeadCell leadId={proposal.leadId} field="phone" />
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {offer?.title || "Unknown Offer"}
                          </TableCell>
                          <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(proposal.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {proposal.status !== "PENDING" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRateLeadManager(proposal)}
                              >
                                Rate Lead Manager
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No proposals received yet
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
        title="Rate Lead Manager"
        description={
          leadManagerForRating
            ? `Rate ${leadManagerForRating.name} for their proposal submission`
            : "Rate this Lead Manager"
        }
      />
    </div>
  );
}
