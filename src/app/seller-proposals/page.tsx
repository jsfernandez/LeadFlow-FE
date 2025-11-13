"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { useLeadOffersBySeller, useUpdateLeadOfferStatus } from "@/hooks/use-lead-offers";
import { useAuth } from "@/components/providers/auth-provider";
import type { LeadOffer, LeadStatus } from "@/types";
import { dataProvider } from "@/lib/dataProvider";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Filter, X, Eye } from "lucide-react";
import { toast } from "sonner";

export default function SellerProposalsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: proposals, isLoading: proposalsLoading } = useLeadOffersBySeller(user?.id || "");
  const updateStatus = useUpdateLeadOfferStatus();

  // Filter and search state
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [selectedProposal, setSelectedProposal] = useState<LeadOffer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Apply filters
  const filteredProposals = useMemo(() => {
    if (!proposals) return [];

    let filtered = [...proposals];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Search filter (client-side for now)
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter((p) => {
        // We'll need to fetch offer and manager data to search properly
        // For now, just filter by ID
        return p.id.toLowerCase().includes(searchLower);
      });
    }

    return filtered;
  }, [proposals, statusFilter, debouncedSearch]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return debouncedSearch !== "" || statusFilter !== "all";
  }, [debouncedSearch, statusFilter]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput("");
    setStatusFilter("all");
  };

  // Handle proposal status update
  const handleUpdateStatus = async (proposalId: string, newStatus: LeadStatus) => {
    try {
      await updateStatus.mutateAsync({ id: proposalId, status: newStatus });
      const successKey = newStatus === "WON" ? "acceptSuccess" : "rejectSuccess";
      toast.success(t(`sellerProposals.${successKey}`));
      setIsDrawerOpen(false);
    } catch {
      toast.error(t("sellerProposals.updateError"));
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    const variants: Record<LeadStatus, string> = {
      PENDING: "bg-yellow-600 text-white",
      WON: "bg-green-600 text-white",
      LOST: "bg-red-600 text-white",
    };

    return <Badge className={variants[status]}>{t(`common.${status.toLowerCase()}`)}</Badge>;
  };

  // Component to display offer info
  const OfferCell = ({ offerId }: { offerId: string }) => {
    const { data: offer } = useQuery({
      queryKey: ["offer", offerId],
      queryFn: () => dataProvider.getOfferById(offerId),
      enabled: !!offerId,
    });

    if (!offer) {
      return <span className="text-sm text-muted-foreground">{t("common.loading")}</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{offer.title}</span>
        <span className="text-xs text-muted-foreground">${offer.price}</span>
      </div>
    );
  };

  // Component to display lead manager info
  const ManagerCell = ({ managerId }: { managerId: string }) => {
    const { data: manager } = useQuery({
      queryKey: ["user", managerId],
      queryFn: () => dataProvider.getUserById(managerId),
      enabled: !!managerId,
    });

    if (!manager) {
      return <span className="text-sm text-muted-foreground">{t("common.loading")}</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{manager.name}</span>
        {manager.reputation && (
          <ReputationBadge reputation={manager.reputation} size="sm" />
        )}
      </div>
    );
  };

  // Component to display lead info
  const LeadCell = ({ leadId }: { leadId: string }) => {
    const { data: lead } = useQuery({
      queryKey: ["lead", leadId],
      queryFn: () => dataProvider.getLeadById(leadId),
      enabled: !!leadId,
    });

    if (!lead) {
      return <span className="text-sm text-muted-foreground">{t("common.loading")}</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{lead.fullName}</span>
        <span className="text-xs text-muted-foreground">{lead.companyName}</span>
      </div>
    );
  };

  // Proposal details drawer
  const ProposalDetailsDrawer = ({ proposal }: { proposal: LeadOffer | null }) => {
    const { data: offer } = useQuery({
      queryKey: ["offer", proposal?.offerId],
      queryFn: () => proposal?.offerId ? dataProvider.getOfferById(proposal.offerId) : null,
      enabled: !!proposal?.offerId,
    });

    const { data: manager } = useQuery({
      queryKey: ["user", proposal?.leadManagerId],
      queryFn: () => proposal?.leadManagerId ? dataProvider.getUserById(proposal.leadManagerId) : null,
      enabled: !!proposal?.leadManagerId,
    });

    const { data: lead } = useQuery({
      queryKey: ["lead", proposal?.leadId],
      queryFn: () => proposal?.leadId ? dataProvider.getLeadById(proposal.leadId) : null,
      enabled: !!proposal?.leadId,
    });

    if (!proposal) return null;

    return (
      <div className="space-y-6">
        {/* Proposal Status */}
        <div>
          <h3 className="text-sm font-medium mb-2">{t("sellerProposals.proposalStatus")}</h3>
          {getStatusBadge(proposal.status)}
        </div>

        {/* Offer Information */}
        {offer && (
          <div>
            <h3 className="text-sm font-medium mb-2">{t("sellerProposals.offerInfo")}</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t("sellerProposals.table.offer")}:</span>
                <span className="ml-2 font-medium">{offer.title}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("offers.description")}:</span>
                <p className="mt-1 text-foreground">{offer.description}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t("sellerProposals.table.value")}:</span>
                <span className="ml-2 font-medium">${offer.price}</span>
              </div>
            </div>
          </div>
        )}

        {/* Lead Information */}
        {lead && (
          <div>
            <h3 className="text-sm font-medium mb-2">{t("sellerProposals.leadInfo")}</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t("leads.fullName")}:</span>
                <span className="ml-2 font-medium">{lead.fullName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("leads.company")}:</span>
                <span className="ml-2 font-medium">{lead.companyName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("leads.email")}:</span>
                <span className="ml-2">{lead.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("leads.phone")}:</span>
                <span className="ml-2">{lead.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Lead Manager Information */}
        {manager && (
          <div>
            <h3 className="text-sm font-medium mb-2">{t("sellerProposals.managerInfo")}</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t("users.name")}:</span>
                <span className="ml-2 font-medium">{manager.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("users.email")}:</span>
                <span className="ml-2">{manager.email}</span>
              </div>
              {manager.reputation && (
                <div>
                  <span className="text-muted-foreground">{t("users.reputation")}:</span>
                  <div className="mt-1">
                    <ReputationBadge reputation={manager.reputation} size="md" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proposal Description */}
        {proposal.description && (
          <div>
            <h3 className="text-sm font-medium mb-2">{t("proposals.description")}</h3>
            <p className="text-sm text-foreground">{proposal.description}</p>
          </div>
        )}

        {/* Submission Date */}
        <div>
          <span className="text-sm text-muted-foreground">{t("proposals.submitted")}:</span>
          <span className="ml-2 text-sm font-medium">
            {new Date(proposal.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Actions (only for PENDING proposals) */}
        {proposal.status === "PENDING" && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={() => handleUpdateStatus(proposal.id, "WON")}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={updateStatus.isPending}
            >
              {t("sellerProposals.actions.accept")}
            </Button>
            <Button
              onClick={() => handleUpdateStatus(proposal.id, "LOST")}
              variant="outline"
              className="flex-1"
              disabled={updateStatus.isPending}
            >
              {t("sellerProposals.actions.reject")}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t("sellerProposals.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("sellerProposals.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("sellerProposals.allProposals")}</CardTitle>
          <CardDescription>{t("sellerProposals.listDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter and Search Bar */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("sellerProposals.filters.searchPlaceholder")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9"
                />
              </div>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="gap-1 w-full sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  {t("sellerProposals.filters.clearFilters")}
                </Button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as LeadStatus | "all")}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("sellerProposals.filters.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("sellerProposals.filters.all")}</SelectItem>
                  <SelectItem value="PENDING">{t("common.pending")}</SelectItem>
                  <SelectItem value="WON">{t("common.won")}</SelectItem>
                  <SelectItem value="LOST">{t("common.lost")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            {!proposalsLoading && filteredProposals && (
              <p className="text-sm text-muted-foreground">
                {`${t("common.showing")} ${filteredProposals.length} ${t("common.of")} ${proposals?.length || 0} ${t("sellerProposals.allProposals").toLowerCase()}`}
              </p>
            )}
          </div>

          {proposalsLoading ? (
            <TableSkeleton rows={5} />
          ) : filteredProposals && filteredProposals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">{t("sellerProposals.table.id")}</TableHead>
                    <TableHead className="min-w-[150px]">{t("sellerProposals.table.offer")}</TableHead>
                    <TableHead className="min-w-[150px]">{t("sellerProposals.table.leadManager")}</TableHead>
                    <TableHead className="min-w-[150px]">{t("sellerProposals.leadInfo")}</TableHead>
                    <TableHead className="min-w-[100px]">{t("sellerProposals.table.status")}</TableHead>
                    <TableHead className="min-w-[120px]">{t("sellerProposals.table.date")}</TableHead>
                    <TableHead className="min-w-[100px]">{t("proposals.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="text-xs sm:text-sm font-mono">
                        {proposal.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <OfferCell offerId={proposal.offerId} />
                      </TableCell>
                      <TableCell>
                        <ManagerCell managerId={proposal.leadManagerId} />
                      </TableCell>
                      <TableCell>
                        <LeadCell leadId={proposal.leadId} />
                      </TableCell>
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(proposal.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setIsDrawerOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t("sellerProposals.viewDetails")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Clipboard}
              title={t("sellerProposals.empty")}
              description={t("sellerProposals.listDescription")}
            />
          )}
        </CardContent>
      </Card>

      {/* Proposal Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-[90vw] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("sellerProposals.detailsTitle")}</SheetTitle>
            <SheetDescription>
              {selectedProposal && `ID: ${selectedProposal.id.substring(0, 8)}...`}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ProposalDetailsDrawer proposal={selectedProposal} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
