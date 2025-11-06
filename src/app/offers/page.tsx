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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { useOffers, useCreateOffer } from "@/hooks/use-offers";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import type { OfferStatus, Offer } from "@/types";
import { createOfferSchema } from "@/lib/schemas/offer.schema";
import { toast } from "sonner";

export default function OffersPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: offers, isLoading, error } = useOffers();
  const createOffer = useCreateOffer();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
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

  const isSeller = user?.role === "SELLER";

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Build offer data with optional fields
      const offerData: Omit<Offer, "id" | "createdAt" | "updatedAt"> = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        status: "ACTIVE" as OfferStatus,
        sellerId: user.id,
        ...(formData.leadType && { leadType: formData.leadType }),
        ...(formData.leadQuantity && { leadQuantity: parseInt(formData.leadQuantity, 10) }),
        ...(formData.clientType && { clientType: formData.clientType }),
        ...(formData.acceptanceCriteria && { acceptanceCriteria: formData.acceptanceCriteria }),
        ...(formData.offerDuration && { offerDuration: parseInt(formData.offerDuration, 10) }),
        ...(formData.allowConsultations && { allowConsultations: formData.allowConsultations === "yes" }),
      };

      // Validate with Zod schema
      const validatedData = createOfferSchema.parse(offerData);

      await createOffer.mutateAsync(validatedData);

      // Reset form and close dialog
      setFormData({
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
      // Error is handled by the mutation hook
      if (error instanceof Error) {
        console.error("Failed to create offer:", error);
        toast.error("Validation Error", {
          description: error.message,
        });
      }
    }
  };

  const getStatusBadge = (status: OfferStatus) => {
    const variants: Record<OfferStatus, string> = {
      ACTIVE: "bg-green-600 text-white",
      INACTIVE: "bg-gray-600 text-white",
      ARCHIVED: "bg-slate-600 text-white",
    };

    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const handleViewDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDetailDialogOpen(true);
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

      <Card>
        <CardHeader>
          <CardTitle>{t("offers.allOffers")}</CardTitle>
          <CardDescription>{t("offers.listDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">{t("offers.failedToLoad")}</p>
            </div>
          ) : offers && offers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("offers.offerTitle")}</TableHead>
                  <TableHead>{t("offers.description")}</TableHead>
                  <TableHead>{t("offers.price")}</TableHead>
                  <TableHead>{t("offers.status")}</TableHead>
                  <TableHead>{t("offers.createdAt")}</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{offer.title}</TableCell>
                    <TableCell className="max-w-md truncate">{offer.description}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      ${offer.price.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(offer.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(offer)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Document}
              title={t("offers.noOffersAvailable")}
              description={
                isSeller
                  ? t("offers.startCreating")
                  : t("offers.noOffersAvailable")
              }
              action={
                isSeller
                  ? {
                      label: t("offers.createOffer"),
                      onClick: () => setIsCreateDialogOpen(true),
                    }
                  : undefined
              }
            />
          )}
        </CardContent>
      </Card>

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
              {/* Required fields */}
              <div className="space-y-2">
                <Label htmlFor="title">{t("offers.createDialog.offerTitle")}</Label>
                <Input
                  id="title"
                  placeholder={t("offers.createDialog.titlePlaceholder")}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("offers.createDialog.offerDescription")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("offers.createDialog.descriptionPlaceholder")}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{t("offers.createDialog.offerPrice")} ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={t("offers.createDialog.pricePlaceholder")}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              {/* Optional fields */}
              <div className="border-t border-border pt-4 mt-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground">Optional Details</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="leadType">Lead Type</Label>
                    <Input
                      id="leadType"
                      placeholder="e.g., B2B Enterprise, B2C Retail"
                      value={formData.leadType}
                      onChange={(e) => setFormData({ ...formData, leadType: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leadQuantity">Lead Quantity</Label>
                    <Input
                      id="leadQuantity"
                      type="number"
                      min="1"
                      placeholder="Number of leads"
                      value={formData.leadQuantity}
                      onChange={(e) => setFormData({ ...formData, leadQuantity: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientType">Client Type</Label>
                    <Input
                      id="clientType"
                      placeholder="e.g., SaaS Companies, E-commerce Platforms"
                      value={formData.clientType}
                      onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="acceptanceCriteria">Acceptance Criteria</Label>
                    <Textarea
                      id="acceptanceCriteria"
                      placeholder="Define the criteria for accepting this offer"
                      value={formData.acceptanceCriteria}
                      onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offerDuration">Offer Duration (days)</Label>
                    <Input
                      id="offerDuration"
                      type="number"
                      min="1"
                      placeholder="Number of days the offer is valid"
                      value={formData.offerDuration}
                      onChange={(e) => setFormData({ ...formData, offerDuration: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allowConsultations">Allow Consultations</Label>
                    <Select
                      value={formData.allowConsultations}
                      onValueChange={(value) => setFormData({ ...formData, allowConsultations: value })}
                    >
                      <SelectTrigger id="allowConsultations">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.allowConsultations === "yes" && (
                    <div className="bg-muted p-3 rounded-md border border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Internal Message Channel:</span> When consultations are enabled, an internal messaging channel will be available for communication between the seller and lead manager.
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

      {/* Offer Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Offer Details</DialogTitle>
            <DialogDescription>
              Complete information about this offer
            </DialogDescription>
          </DialogHeader>

          {selectedOffer && (
            <div className="space-y-4 py-4">
              {/* Basic Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="text-sm font-medium">{selectedOffer.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedOffer.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-sm font-semibold text-primary">${selectedOffer.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm">{new Date(selectedOffer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm mt-1">{selectedOffer.description}</p>
                </div>
              </div>

              {/* Extended Information */}
              {(selectedOffer.leadType || selectedOffer.leadQuantity || selectedOffer.clientType || 
                selectedOffer.acceptanceCriteria || selectedOffer.offerDuration || 
                selectedOffer.allowConsultations !== undefined) && (
                <div className="space-y-3 border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                    Extended Details
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {selectedOffer.leadType && (
                      <div>
                        <p className="text-sm text-muted-foreground">Lead Type</p>
                        <p className="text-sm font-medium">{selectedOffer.leadType}</p>
                      </div>
                    )}
                    {selectedOffer.leadQuantity && (
                      <div>
                        <p className="text-sm text-muted-foreground">Lead Quantity</p>
                        <p className="text-sm font-medium">{selectedOffer.leadQuantity}</p>
                      </div>
                    )}
                    {selectedOffer.clientType && (
                      <div>
                        <p className="text-sm text-muted-foreground">Client Type</p>
                        <p className="text-sm font-medium">{selectedOffer.clientType}</p>
                      </div>
                    )}
                    {selectedOffer.offerDuration && (
                      <div>
                        <p className="text-sm text-muted-foreground">Offer Duration</p>
                        <p className="text-sm font-medium">{selectedOffer.offerDuration} days</p>
                      </div>
                    )}
                    {selectedOffer.allowConsultations !== undefined && (
                      <div>
                        <p className="text-sm text-muted-foreground">Allow Consultations</p>
                        <p className="text-sm font-medium">
                          {selectedOffer.allowConsultations ? (
                            <Badge className="bg-green-600 text-white">Yes</Badge>
                          ) : (
                            <Badge className="bg-gray-600 text-white">No</Badge>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedOffer.acceptanceCriteria && (
                    <div>
                      <p className="text-sm text-muted-foreground">Acceptance Criteria</p>
                      <p className="text-sm mt-1 bg-muted p-3 rounded-md">
                        {selectedOffer.acceptanceCriteria}
                      </p>
                    </div>
                  )}

                  {selectedOffer.allowConsultations && (
                    <div className="bg-amber-950/20 border border-amber-900/30 p-3 rounded-md">
                      <p className="text-sm text-amber-400">
                        <span className="font-semibold">Internal Message Channel Available:</span> Consultations are enabled for this offer, allowing communication between seller and lead manager.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
