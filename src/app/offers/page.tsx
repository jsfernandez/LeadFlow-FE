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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { useOffers, useCreateOffer } from "@/hooks/use-offers";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import type { OfferStatus } from "@/types";

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
  });

  const isSeller = user?.role === "SELLER";

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createOffer.mutateAsync({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        status: "ACTIVE" as OfferStatus,
        sellerId: user.id,
      });

      // Reset form and close dialog
      setFormData({ title: "", description: "", price: "" });
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Failed to create offer:", error);
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
        <DialogContent>
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
    </div>
  );
}
