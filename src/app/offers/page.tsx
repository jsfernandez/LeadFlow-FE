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
import type { OfferStatus } from "@/types";

export default function OffersPage() {
  const { user } = useAuth();
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
          <h1 className="text-3xl font-bold">Offers</h1>
          <p className="text-muted-foreground">Browse and manage available offers</p>
        </div>
        {isSeller && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>Create Offer</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
          <CardDescription>List of all available offers in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">Failed to load offers. Please try again.</p>
            </div>
          ) : offers && offers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
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
              title="No offers available"
              description={
                isSeller
                  ? "Get started by creating your first offer"
                  : "There are no active offers at the moment"
              }
              action={
                isSeller
                  ? {
                      label: "Create Offer",
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
              <DialogTitle>Create New Offer</DialogTitle>
              <DialogDescription>
                Create a new offer for lead managers to submit proposals
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Premium SaaS Leads"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the offer details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
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
                Cancel
              </Button>
              <Button type="submit" disabled={createOffer.isPending}>
                {createOffer.isPending ? "Creating..." : "Create Offer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
