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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeadOffersByManager, useCreateLeadOffer } from "@/hooks/use-lead-offers";
import { useOffers } from "@/hooks/use-offers";
import { useAuth } from "@/components/providers/auth-provider";
import type { LeadStatus } from "@/types";

export default function ProposalsPage() {
  const { user } = useAuth();
  const { data: proposals, isLoading: proposalsLoading } = useLeadOffersByManager(user?.id || "");
  const { data: offers } = useOffers();
  const createProposal = useCreateLeadOffer();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    offerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createProposal.mutateAsync({
        offerId: formData.offerId,
        leadManagerId: user.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
      });

      // Reset form and close dialog
      setFormData({
        offerId: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
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

  const activeOffers = offers?.filter((offer) => offer.status === "ACTIVE") || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">Manage your lead proposals</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Submit Proposal</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Proposals</CardTitle>
          <CardDescription>All proposals you&apos;ve submitted</CardDescription>
        </CardHeader>
        <CardContent>
          {proposalsLoading ? (
            <p className="text-sm text-muted-foreground">Loading proposals...</p>
          ) : proposals && proposals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Qualified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-medium">{proposal.customerName}</TableCell>
                    <TableCell>{proposal.customerEmail}</TableCell>
                    <TableCell>{proposal.customerPhone}</TableCell>
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
            <p className="text-sm text-muted-foreground">You haven&apos;t submitted any proposals yet</p>
          )}
        </CardContent>
      </Card>

      {/* Submit Proposal Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmitProposal}>
            <DialogHeader>
              <DialogTitle>Submit Lead Proposal</DialogTitle>
              <DialogDescription>
                Submit a lead proposal for an active offer
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="offerId">Select Offer</Label>
                <Select
                  value={formData.offerId}
                  onValueChange={(value) => setFormData({ ...formData, offerId: value })}
                  required
                >
                  <SelectTrigger id="offerId">
                    <SelectValue placeholder="Choose an offer" />
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
                        No active offers available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="customer@example.com"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProposal.isPending || activeOffers.length === 0}
              >
                {createProposal.isPending ? "Submitting..." : "Submit Proposal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
