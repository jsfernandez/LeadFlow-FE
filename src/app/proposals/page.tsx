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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { useLeadOffersByManager, useCreateLeadOffer } from "@/hooks/use-lead-offers";
import { useOffers } from "@/hooks/use-offers";
import { useLeads } from "@/hooks/use-leads";
import { useAuth } from "@/components/providers/auth-provider";
import type { LeadStatus } from "@/types";
import { dataProvider } from "@/lib/dataProvider";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { Textarea } from "@/components/ui/textarea";

export default function ProposalsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: proposals, isLoading: proposalsLoading, error } = useLeadOffersByManager(user?.id || "");
  const { data: offers, isLoading: offersLoading } = useOffers();
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const createProposal = useCreateLeadOffer();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    offerId: "",
    leadId: "",
    description: "",
  });

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Get lead info to populate deprecated fields for backward compatibility
      const lead = leads?.find(l => l.id === formData.leadId);
      if (!lead) {
        console.error("Selected lead not found");
        return;
      }

      await createProposal.mutateAsync({
        offerId: formData.offerId,
        leadManagerId: user.id,
        leadId: formData.leadId,
        description: formData.description,
        // Deprecated fields for backward compatibility
        customerName: lead.name,
        customerEmail: lead.email,
        customerPhone: lead.phone,
      });

      // Reset form and close dialog
      setFormData({
        offerId: "",
        leadId: "",
        description: "",
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Failed to submit proposal:", error);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    const variants: Record<LeadStatus, string> = {
      PENDING: "bg-yellow-600 text-white",
      WON: "bg-green-600 text-white",
      LOST: "bg-red-600 text-white",
    };

    return <Badge className={variants[status]}>{status}</Badge>;
  };

  // Component to display offer with seller reputation
  // NOTE: This creates an N+1 query pattern. For optimization in production,
  // consider prefetching offer and seller data at the parent level or implementing
  // data aggregation in the API.
  const OfferCell = ({ offerId }: { offerId: string }) => {
    const { data: offer } = useQuery({
      queryKey: ["offer", offerId],
      queryFn: () => dataProvider.getOfferById(offerId),
      enabled: !!offerId,
    });

    const { data: seller } = useQuery({
      queryKey: ["user", offer?.sellerId],
      queryFn: () => offer?.sellerId ? dataProvider.getUserById(offer.sellerId) : null,
      enabled: !!offer?.sellerId,
    });

    if (!offer) {
      return <span className="text-sm text-muted-foreground">{t("proposals.loading")}</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{offer.title}</span>
        {seller?.reputation && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{seller.name}</span>
            <ReputationBadge reputation={seller.reputation} size="sm" />
          </div>
        )}
      </div>
    );
  };

  const activeOffers = offers?.filter((offer) => offer.status === "ACTIVE") || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("proposals.title")}</h1>
          <p className="text-muted-foreground">{t("proposals.subtitle")}</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={offersLoading || leadsLoading || activeOffers.length === 0 || !leads || leads.length === 0}
        >
          {t("proposals.submitProposal")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("proposals.yourProposals")}</CardTitle>
          <CardDescription>{t("proposals.allSubmitted")}</CardDescription>
        </CardHeader>
        <CardContent>
          {proposalsLoading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">{t("proposals.failedToLoad")}</p>
            </div>
          ) : proposals && proposals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("proposals.customerName")}</TableHead>
                  <TableHead>{t("proposals.email")}</TableHead>
                  <TableHead>{t("proposals.phone")}</TableHead>
                  <TableHead>{t("proposals.offerCompany")}</TableHead>
                  <TableHead>{t("proposals.status")}</TableHead>
                  <TableHead>{t("proposals.submitted")}</TableHead>
                  <TableHead>{t("proposals.qualified")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-medium">{proposal.customerName}</TableCell>
                    <TableCell>{proposal.customerEmail}</TableCell>
                    <TableCell>{proposal.customerPhone}</TableCell>
                    <TableCell>
                      <OfferCell offerId={proposal.offerId} />
                    </TableCell>
                    <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {proposal.qualifiedAt
                        ? new Date(proposal.qualifiedAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Clipboard}
              title={t("proposals.noProposalsYet")}
              description={t("proposals.noneSubmitted")}
              action={{
                label: t("proposals.submitProposal"),
                onClick: () => setIsCreateDialogOpen(true),
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Submit Proposal Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmitProposal}>
            <DialogHeader>
              <DialogTitle>{t("proposals.submitLeadProposal")}</DialogTitle>
              <DialogDescription>
                {t("proposals.submitProposalForOffer")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="offerId">{t("proposals.selectOffer")}</Label>
                <Select
                  value={formData.offerId}
                  onValueChange={(value) => setFormData({ ...formData, offerId: value })}
                  required
                >
                  <SelectTrigger id="offerId">
                    <SelectValue placeholder={t("proposals.chooseOffer")} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeOffers.length > 0 ? (
                      activeOffers.map((offer) => (
                        <SelectItem key={offer.id} value={offer.id}>
                          {offer.title} - ${offer.price.toFixed(2)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        {t("proposals.noActiveOffers")}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadId">{t("proposals.selectLead")}</Label>
                <Select
                  value={formData.leadId}
                  onValueChange={(value) => setFormData({ ...formData, leadId: value })}
                  required
                >
                  <SelectTrigger id="leadId">
                    <SelectValue placeholder={t("proposals.chooseLead")} />
                  </SelectTrigger>
                  <SelectContent>
                    {leads && leads.length > 0 ? (
                      leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.companyName || lead.name} - {lead.email}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        {t("proposals.noLeadsAvailable")}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("proposals.description")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("proposals.descriptionPlaceholder")}
                  value={formData.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 500) {
                      setFormData({ ...formData, description: value });
                    }
                  }}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {t("proposals.descriptionHelper")} ({formData.description.length}/500)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createProposal.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createProposal.isPending || activeOffers.length === 0 || !leads || leads.length === 0}
              >
                {createProposal.isPending ? t("proposals.submitting") : t("proposals.submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
