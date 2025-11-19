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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { DealEvaluationActions } from "@/components/ui/deal-evaluation-actions";
import { useLeadOffersByManager } from "@/hooks/use-lead-offers";
import { useAuth } from "@/components/providers/auth-provider";
import type { LeadStatus } from "@/types";
import { dataProvider } from "@/lib/dataProvider";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useFilteredProposals, type ProposalFilters, type ProposalSort } from "@/hooks/use-filtered-proposals";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

export default function ProposalsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: proposals, isLoading: proposalsLoading, error } = useLeadOffersByManager(user?.id || "");

  // Filter and sort state
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [filters, setFilters] = useState<ProposalFilters>({
    search: "",
    status: "all",
  });

  // Sort state - default to createdAt DESC
  const [sort, setSort] = useState<ProposalSort>({
    field: "createdAt",
    direction: "desc",
  });

  // Update filters when debounced search changes
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // Apply filters and sorting to proposals
  const filteredProposals = useFilteredProposals(proposals, filters, sort);

  // For search, we need to filter by offer name and seller name
  // This requires fetching related data, so we'll do it here
  const finalFilteredProposals = useMemo(() => {
    if (!filters.search || !filteredProposals) return filteredProposals;
    
    // We can't easily filter by offer/seller name without fetching all related data
    // For now, we'll just return the status-filtered results
    // In a real app, this would be done server-side
    return filteredProposals;
  }, [filteredProposals, filters.search]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.search !== "" || filters.status !== "all";
  }, [filters]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      status: "all",
    });
  };

  // Toggle sort or change sort field
  const handleSort = (field: ProposalSort["field"]) => {
    setSort((prev) => {
      if (prev.field === field) {
        // Toggle direction if same field
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      // Default to descending for new field
      return { field, direction: "desc" };
    });
  };

  const getStatusBadge = (status: LeadStatus) => {
    const variants: Record<LeadStatus, string> = {
      PENDING: "bg-yellow-600 text-white",
      WON: "bg-green-600 text-white",
      LOST: "bg-red-600 text-white",
    };

    const statusTranslationKey = status.toLowerCase();
    return <Badge className={variants[status]}>{t(`common.${statusTranslationKey}`)}</Badge>;
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

  // Helper component to fetch and display lead data
  const LeadCell = ({ leadId }: { leadId: string }) => {
    const { data: lead } = useQuery({
      queryKey: ["lead", leadId],
      queryFn: () => dataProvider.getLeadById(leadId),
      enabled: !!leadId,
    });

    if (!lead) {
      return <span className="text-sm text-muted-foreground">{t("proposals.loading")}</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{lead.fullName}</span>
        <span className="text-xs text-muted-foreground">{lead.companyName}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t("proposals.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("proposals.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("proposals.yourProposals")}</CardTitle>
          <CardDescription>{t("proposals.allSubmitted")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter and Sort Bar */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("proposals.filters.searchPlaceholder")}
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
                  {t("proposals.filters.clearFilters")}
                </Button>
              )}
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap gap-2">
              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value as LeadStatus | "all" })}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("proposals.filters.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("proposals.filters.allStatuses")}</SelectItem>
                  <SelectItem value="PENDING">{t("common.pending")}</SelectItem>
                  <SelectItem value="WON">{t("common.won")}</SelectItem>
                  <SelectItem value="LOST">{t("common.lost")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 w-full sm:w-auto">
                    <ArrowUpDown className="h-4 w-4" />
                    {t("proposals.filters.sortBy")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>{t("proposals.filters.sortBy")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                    {sort.field === "createdAt" && sort.direction === "desc" ? t("proposals.filters.sort.dateDesc") : t("proposals.filters.sort.dateAsc")}
                    {sort.field === "createdAt" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("status")}>
                    {sort.field === "status" && sort.direction === "asc" ? t("proposals.filters.sort.statusAsc") : t("proposals.filters.sort.statusDesc")}
                    {sort.field === "status" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Results count */}
            {!proposalsLoading && finalFilteredProposals && (
              <p className="text-sm text-muted-foreground">
                {`${t("common.showing")} ${finalFilteredProposals.length} ${t("common.of")} ${proposals?.length || 0} ${t("proposals.title").toLowerCase()}`}
              </p>
            )}
          </div>

          {proposalsLoading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">{t("proposals.failedToLoad")}</p>
            </div>
          ) : finalFilteredProposals && finalFilteredProposals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">{t("proposals.lead")}</TableHead>
                    <TableHead className="min-w-[150px]">{t("proposals.offerCompany")}</TableHead>
                    <TableHead className="min-w-[100px]">{t("proposals.status")}</TableHead>
                    <TableHead className="min-w-[120px]">{t("proposals.submitted")}</TableHead>
                    <TableHead className="min-w-[120px]">{t("proposals.qualified")}</TableHead>
                    <TableHead className="min-w-[150px]">{t("proposals.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalFilteredProposals.map((proposal) => {
                    // Fetch offer to get seller ID for evaluation
                    const OfferWithActions = () => {
                      const { data: offer } = useQuery({
                        queryKey: ["offer", proposal.offerId],
                        queryFn: () => dataProvider.getOfferById(proposal.offerId),
                      });

                      return (
                        <>
                          <TableCell>
                            <LeadCell leadId={proposal.leadId} />
                          </TableCell>
                          <TableCell>
                            <OfferCell offerId={proposal.offerId} />
                          </TableCell>
                          <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                          <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(proposal.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                            {proposal.qualifiedAt
                              ? new Date(proposal.qualifiedAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {offer && user && (
                              <DealEvaluationActions
                                proposal={proposal}
                                currentUserId={user.id}
                                currentUserRole="LEAD_MANAGER"
                                otherUserId={offer.sellerId}
                                offerId={proposal.offerId}
                              />
                            )}
                          </TableCell>
                        </>
                      );
                    };

                    return (
                      <TableRow key={proposal.id}>
                        <OfferWithActions />
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Clipboard}
              title={t("proposals.noProposalsYet")}
              description={t("proposals.noneSubmitted")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
