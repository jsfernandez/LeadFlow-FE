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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { useOffers, useOffersBySeller, useCreateOffer, useUpdateOfferStatus } from "@/hooks/use-offers";
import { useCreateLeadOffer } from "@/hooks/use-lead-offers";
import { useLeads } from "@/hooks/use-leads";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import type { OfferStatus, Offer, Lead } from "@/types";
import { createOfferSchema } from "@/lib/schemas/offer.schema";
import { toast } from "sonner";
import { dataProvider } from "@/lib/dataProvider";
import { useQuery } from "@tanstack/react-query";
import { LeadSelector } from "@/components/leads/LeadSelector";

export default function OffersPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: allOffers, isLoading: isLoadingAll, error: errorAll } = useOffers();
  const { data: myOffers, isLoading: isLoadingMy } = useOffersBySeller(user?.id || "");
  const { data: leads } = useLeads();
  const createOffer = useCreateOffer();
  const createProposal = useCreateLeadOffer();
  const updateStatus = useUpdateOfferStatus();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
  const [isLeadSelectorOpen, setIsLeadSelectorOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [offerFormData, setOfferFormData] = useState({
    title: "",
    description: "",
    price: "",
    leadType: "",
    leadQuantity: "",
    clientType: "",
    acceptanceCriteria: "",
    offerDuration: "",
    allowConsultations: "no",
  });

  const [proposalFormData, setProposalFormData] = useState({
    leadId: "",
    description: "",
  });

  const isSeller = user?.role === "SELLER";
  const isLeadManager = user?.role === "LEAD_MANAGER";

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const offerData: Omit<Offer, "id" | "createdAt" | "updatedAt"> = {
        title: offerFormData.title,
        description: offerFormData.description,
        price: parseFloat(offerFormData.price),
        status: "ACTIVE" as OfferStatus,
        sellerId: user.id,
        ...(offerFormData.leadType && { leadType: offerFormData.leadType }),
        ...(offerFormData.leadQuantity && { leadQuantity: parseInt(offerFormData.leadQuantity, 10) }),
        ...(offerFormData.clientType && { clientType: offerFormData.clientType }),
        ...(offerFormData.acceptanceCriteria && { acceptanceCriteria: offerFormData.acceptanceCriteria }),
        ...(offerFormData.offerDuration && { offerDuration: parseInt(offerFormData.offerDuration, 10) }),
        ...(offerFormData.allowConsultations && offerFormData.allowConsultations !== "no" && { 
          allowConsultations: offerFormData.allowConsultations === "yes" 
        }),
      };

      const validatedData = createOfferSchema.parse(offerData);
      await createOffer.mutateAsync(validatedData);

      setOfferFormData({
        title: "",
        description: "",
        price: "",
        leadType: "",
        leadQuantity: "",
        clientType: "",
        acceptanceCriteria: "",
        offerDuration: "",
        allowConsultations: "no",
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to create offer:", error);
        toast.error("Validation Error", {
          description: error.message,
        });
      }
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedOffer) return;

    try {
      // Verify lead exists
      const lead = leads?.find(l => l.id === proposalFormData.leadId);
      if (!lead) {
        toast.error(t("offers.proposalDialog.error"), {
          description: t("offers.proposalDialog.leadNotFound"),
        });
        return;
      }

      await createProposal.mutateAsync({
        offerId: selectedOffer.id,
        leadManagerId: user.id,
        leadId: proposalFormData.leadId,
        description: proposalFormData.description,
      });

      setProposalFormData({
        leadId: "",
        description: "",
      });
      setIsProposalDialogOpen(false);
      setIsDetailDialogOpen(false);
      toast.success(t("offers.proposalDialog.success"));
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      toast.error(t("offers.proposalDialog.error"));
    }
  };

  const handleStatusChange = async (offerId: string, newStatus: OfferStatus) => {
    try {
      await updateStatus.mutateAsync({ id: offerId, status: newStatus });
    } catch (error) {
      console.error("Failed to update offer status:", error);
    }
  };

  const handleViewDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDetailDialogOpen(true);
  };

  const handleCreateProposal = (offer: Offer) => {
    setSelectedOffer(offer);
    // Reset proposal form
    setProposalFormData({
      leadId: "",
      description: "",
    });
    // Open lead selector modal
    setIsLeadSelectorOpen(true);
  };

  const handleLeadSelected = (lead: Lead) => {
    // Set the selected lead ID
    setProposalFormData((prev) => ({
      ...prev,
      leadId: lead.id,
    }));
    // Close lead selector and open proposal dialog
    setIsLeadSelectorOpen(false);
    setIsProposalDialogOpen(true);
  };

  const getStatusBadge = (status: OfferStatus) => {
    const variants: Record<OfferStatus, string> = {
      ACTIVE: "bg-green-600 text-white",
      INACTIVE: "bg-gray-600 text-white",
      ARCHIVED: "bg-slate-600 text-white",
    };

    return <Badge className={variants[status]}>{status}</Badge>;
  };

  // Component to display seller info with reputation
  // NOTE: This creates an N+1 query pattern. For optimization in production,
  // consider including seller data in the initial offers query or implementing
  // batch fetching at the parent level.
  const SellerCell = ({ sellerId }: { sellerId: string }) => {
    const { data: seller } = useQuery({
      queryKey: ["user", sellerId],
      queryFn: () => dataProvider.getUserById(sellerId),
      enabled: !!sellerId,
    });

    if (!seller) {
      return <span className="text-sm text-muted-foreground">{t("common.loading")}</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{seller.name}</span>
        {seller.reputation && (
          <ReputationBadge reputation={seller.reputation} size="sm" />
        )}
      </div>
    );
  };

  const renderOffersTable = (offers: Offer[] | undefined, isLoading: boolean, showActions: boolean = false) => {
    if (isLoading) {
      return <TableSkeleton rows={5} />;
    }

    if (!offers || offers.length === 0) {
      return (
        <EmptyState
          icon={EmptyStateIcons.Document}
          title={t("offers.noOffersAvailable")}
          description={
            isSeller
              ? t("offers.startCreating")
              : t("offers.noOffersAvailable")
          }
          action={
            isSeller && !showActions
              ? {
                  label: t("offers.createOffer"),
                  onClick: () => setIsCreateDialogOpen(true),
                }
              : undefined
          }
        />
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("offers.offerTitle")}</TableHead>
            <TableHead>{t("offers.description")}</TableHead>
            <TableHead>{t("offers.price")}</TableHead>
            <TableHead>{t("offers.status")}</TableHead>
            {!showActions && <TableHead>{t("offers.company")}</TableHead>}
            <TableHead>{t("offers.createdAt")}</TableHead>
            <TableHead className="text-right">{t("offers.actions")}</TableHead>
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
              {!showActions && (
                <TableCell>
                  <SellerCell sellerId={offer.sellerId} />
                </TableCell>
              )}
              <TableCell className="text-sm text-muted-foreground">
                {new Date(offer.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(offer)}
                >
                  {t("common.viewDetails")}
                </Button>
                {showActions && (
                  <Select
                    value={offer.status}
                    onValueChange={(value) => handleStatusChange(offer.id, value as OfferStatus)}
                  >
                    <SelectTrigger className="w-32 inline-flex">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">{t("common.active")}</SelectItem>
                      <SelectItem value="INACTIVE">{t("common.inactive")}</SelectItem>
                      <SelectItem value="ARCHIVED">{t("common.archived")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {isLeadManager && !showActions && (
                  <Button
                    size="sm"
                    onClick={() => handleCreateProposal(offer)}
                  >
                    {t("common.createProposal")}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("offers.title")}</h1>
          <p className="text-muted-foreground">{t("offers.subtitle")}</p>
        </div>
        {isSeller && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>{t("offers.createOffer")}</Button>
        )}
      </div>

      {isSeller ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("offers.myOffers")}</CardTitle>
            <CardDescription>{t("myOffers.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderOffersTable(myOffers, isLoadingMy, true)}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("offers.allOffers")}</CardTitle>
            <CardDescription>{t("offers.listDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {errorAll ? (
              <div className="text-center py-8">
                <p className="text-sm text-red-400">{t("offers.failedToLoad")}</p>
              </div>
            ) : (
              renderOffersTable(allOffers, isLoadingAll, false)
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Offer Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleCreateOffer}>
            <DialogHeader>
              <DialogTitle>{t("offers.createDialog.title")}</DialogTitle>
              <DialogDescription>
                {t("offers.createDialog.description")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("offers.createDialog.offerTitle")}</Label>
                <Input
                  id="title"
                  placeholder={t("offers.createDialog.titlePlaceholder")}
                  value={offerFormData.title}
                  onChange={(e) => setOfferFormData({ ...offerFormData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("offers.createDialog.offerDescription")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("offers.createDialog.descriptionPlaceholder")}
                  value={offerFormData.description}
                  onChange={(e) => setOfferFormData({ ...offerFormData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{t("offers.createDialog.offerPrice")} ($)</Label>
                <NumericInput
                  id="price"
                  decimalPlaces={2}
                  placeholder={t("offers.createDialog.pricePlaceholder")}
                  value={offerFormData.price}
                  onChange={(e) => setOfferFormData({ ...offerFormData, price: e.target.value })}
                  required
                />
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground">{t("offers.createDialog.optionalDetails")}</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="leadType">{t("offers.createDialog.leadType")}</Label>
                    <Input
                      id="leadType"
                      placeholder={t("offers.createDialog.leadTypePlaceholder")}
                      value={offerFormData.leadType}
                      onChange={(e) => setOfferFormData({ ...offerFormData, leadType: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leadQuantity">{t("offers.createDialog.leadQuantity")}</Label>
                    <NumericInput
                      id="leadQuantity"
                      decimalPlaces={0}
                      placeholder={t("offers.createDialog.leadQuantityPlaceholder")}
                      value={offerFormData.leadQuantity}
                      onChange={(e) => setOfferFormData({ ...offerFormData, leadQuantity: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientType">{t("offers.createDialog.clientType")}</Label>
                    <Input
                      id="clientType"
                      placeholder={t("offers.createDialog.clientTypePlaceholder")}
                      value={offerFormData.clientType}
                      onChange={(e) => setOfferFormData({ ...offerFormData, clientType: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="acceptanceCriteria">{t("offers.createDialog.acceptanceCriteria")}</Label>
                    <Textarea
                      id="acceptanceCriteria"
                      placeholder={t("offers.createDialog.acceptanceCriteriaPlaceholder")}
                      value={offerFormData.acceptanceCriteria}
                      onChange={(e) => setOfferFormData({ ...offerFormData, acceptanceCriteria: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offerDuration">{t("offers.createDialog.offerDuration")}</Label>
                    <NumericInput
                      id="offerDuration"
                      decimalPlaces={0}
                      placeholder={t("offers.createDialog.offerDurationPlaceholder")}
                      value={offerFormData.offerDuration}
                      onChange={(e) => setOfferFormData({ ...offerFormData, offerDuration: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allowConsultations">{t("offers.createDialog.allowConsultations")}</Label>
                    <Select
                      value={offerFormData.allowConsultations}
                      onValueChange={(value) => setOfferFormData({ ...offerFormData, allowConsultations: value })}
                    >
                      <SelectTrigger id="allowConsultations">
                        <SelectValue placeholder={t("offers.createDialog.selectOption")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">{t("offers.createDialog.no")}</SelectItem>
                        <SelectItem value="yes">{t("offers.createDialog.yes")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {offerFormData.allowConsultations === "yes" && (
                    <div className="bg-muted p-3 rounded-md border border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{t("offers.createDialog.internalMessageChannel")}</span> {t("offers.createDialog.consultationsEnabledMessage")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createOffer.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={createOffer.isPending}>
                {createOffer.isPending ? t("common.loading") : t("offers.createOffer")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lead Selector Modal */}
      <LeadSelector
        open={isLeadSelectorOpen}
        onOpenChange={setIsLeadSelectorOpen}
        leads={leads}
        isLoading={false}
        onSelectLead={handleLeadSelected}
        selectedLeadId={proposalFormData.leadId}
      />

      {/* Create Proposal Dialog */}
      <Dialog open={isProposalDialogOpen} onOpenChange={setIsProposalDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmitProposal}>
            <DialogHeader>
              <DialogTitle>{t("offers.proposalDialog.title")}</DialogTitle>
              <DialogDescription>
                {t("offers.proposalDialog.description")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Display selected lead info */}
              {proposalFormData.leadId && leads && (
                <div className="space-y-2">
                  <Label>{t("proposals.selectedLead")}</Label>
                  {(() => {
                    const selectedLead = leads.find(l => l.id === proposalFormData.leadId);
                    return selectedLead ? (
                      <div className="p-3 border rounded-md bg-muted/50">
                        <p className="font-medium">{selectedLead.companyName}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedLead.fullName} - {selectedLead.email}
                        </p>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="px-0 h-auto"
                          onClick={() => {
                            setIsProposalDialogOpen(false);
                            setIsLeadSelectorOpen(true);
                          }}
                        >
                          {t("offers.detailDialog.messages.changeLead")}
                        </Button>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">{t("proposals.description")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("proposals.descriptionPlaceholder")}
                  value={proposalFormData.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 500) {
                      setProposalFormData({ ...proposalFormData, description: value });
                    }
                  }}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {t("proposals.descriptionHelper")} ({proposalFormData.description.length}/500)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsProposalDialogOpen(false)}
                disabled={createProposal.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={createProposal.isPending || !proposalFormData.leadId}>
                {createProposal.isPending ? t("common.loading") : t("offers.proposalDialog.submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Offer Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("offers.detailDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("offers.detailDialog.description")}
            </DialogDescription>
          </DialogHeader>

          {selectedOffer && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  {t("offers.detailDialog.basicInformation")}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.title")}</p>
                    <p className="text-sm font-medium">{selectedOffer.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.status")}</p>
                    <div className="mt-1">{getStatusBadge(selectedOffer.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.price")}</p>
                    <p className="text-sm font-semibold text-primary">${selectedOffer.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.created")}</p>
                    <p className="text-sm">{new Date(selectedOffer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.description")}</p>
                  <p className="text-sm mt-1">{selectedOffer.description}</p>
                </div>
              </div>

              {(selectedOffer.leadType || selectedOffer.leadQuantity || selectedOffer.clientType || 
                selectedOffer.acceptanceCriteria || selectedOffer.offerDuration || 
                selectedOffer.allowConsultations !== undefined) && (
                <div className="space-y-3 border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                    {t("offers.detailDialog.extendedDetails")}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {selectedOffer.leadType && (
                      <div>
                        <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.leadType")}</p>
                        <p className="text-sm font-medium">{selectedOffer.leadType}</p>
                      </div>
                    )}
                    {selectedOffer.leadQuantity && (
                      <div>
                        <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.leadQuantity")}</p>
                        <p className="text-sm font-medium">{selectedOffer.leadQuantity}</p>
                      </div>
                    )}
                    {selectedOffer.clientType && (
                      <div>
                        <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.clientType")}</p>
                        <p className="text-sm font-medium">{selectedOffer.clientType}</p>
                      </div>
                    )}
                    {selectedOffer.offerDuration && (
                      <div>
                        <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.offerDuration")}</p>
                        <p className="text-sm font-medium">{selectedOffer.offerDuration} {t("offers.detailDialog.fields.days")}</p>
                      </div>
                    )}
                    {selectedOffer.allowConsultations !== undefined && (
                      <div>
                        <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.allowConsultations")}</p>
                        <p className="text-sm font-medium">
                          {selectedOffer.allowConsultations ? (
                            <Badge className="bg-green-600 text-white">{t("offers.detailDialog.fields.yes")}</Badge>
                          ) : (
                            <Badge className="bg-gray-600 text-white">{t("offers.detailDialog.fields.no")}</Badge>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedOffer.acceptanceCriteria && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.acceptanceCriteria")}</p>
                      <p className="text-sm mt-1 bg-muted p-3 rounded-md">
                        {selectedOffer.acceptanceCriteria}
                      </p>
                    </div>
                  )}

                  {selectedOffer.allowConsultations && (
                    <div className="bg-amber-950/20 border border-amber-900/30 p-3 rounded-md">
                      <p className="text-sm text-amber-400">
                        <span className="font-semibold">{t("offers.detailDialog.messages.consultationsAvailable")}</span> {t("offers.detailDialog.messages.consultationsEnabled")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {isLeadManager && selectedOffer && (
              <Button onClick={() => {
                setIsDetailDialogOpen(false);
                handleCreateProposal(selectedOffer);
              }}>
                {t("common.createProposal")}
              </Button>
            )}
            <Button variant="secondary" onClick={() => setIsDetailDialogOpen(false)}>
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
