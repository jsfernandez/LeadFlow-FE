"use client";

import React, { useState, useMemo } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { MoneyInput } from "@/components/ui/money-input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrencyCLP } from "@/lib/utils";
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
import { useFilteredOffers, type OfferFilters, type OfferSort } from "@/hooks/use-filtered-offers";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Filter, ArrowUpDown, X, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [isOfferDisclaimerOpen, setIsOfferDisclaimerOpen] = useState(false);
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
  const [isLeadSelectorOpen, setIsLeadSelectorOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [offerFormData, setOfferFormData] = useState({
    title: "",
    description: "",
    offerAttachmentUrl: "",
    price: 0,
    leadType: "",
    leadQuantity: "",
    clientType: "",
    acceptanceCriteria: "",
    offerDuration: "",
    allowConsultations: "no",
    qualificationWindow: "",
  });

  const [proposalFormData, setProposalFormData] = useState({
    leadIds: [] as string[],
    description: "",
  });

  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [offerDisclaimerAccepted, setOfferDisclaimerAccepted] = useState(false);

  const isSeller = user?.role === "SELLER";
  const isLeadManager = user?.role === "LEAD_MANAGER";

  // Filter and sort state
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [filters, setFilters] = useState<OfferFilters>({
    search: "",
    status: "all",
  });

  // Sort state - default to createdAt DESC
  const [sort, setSort] = useState<OfferSort>({
    field: "createdAt",
    direction: "desc",
  });

  // Update filters when debounced search changes
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // Apply filters and sorting to offers
  const filteredAllOffers = useFilteredOffers(allOffers, filters, sort);
  const filteredMyOffers = useFilteredOffers(myOffers, filters, sort);

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
  const handleSort = (field: OfferSort["field"]) => {
    setSort((prev) => {
      if (prev.field === field) {
        // Toggle direction if same field
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      // Default to descending for new field
      return { field, direction: "desc" };
    });
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    // Intercept the submit and show disclaimer modal instead
    setOfferDisclaimerAccepted(false);
    setIsOfferDisclaimerOpen(true);
  };

  const handleConfirmCreateOffer = async () => {
    if (!user) return;

    try {
      const offerData: Omit<Offer, "id" | "createdAt" | "updatedAt"> = {
        title: offerFormData.title,
        description: offerFormData.description,
        offerAttachmentUrl: offerFormData.offerAttachmentUrl,
        price: offerFormData.price,
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
        ...(offerFormData.qualificationWindow && { qualificationWindow: parseInt(offerFormData.qualificationWindow, 10) }),
      };

      const validatedData = createOfferSchema.parse(offerData);
      await createOffer.mutateAsync(validatedData);

      setOfferFormData({
        title: "",
        description: "",
        offerAttachmentUrl: "",
        price: 0,
        leadType: "",
        leadQuantity: "",
        clientType: "",
        acceptanceCriteria: "",
        offerDuration: "",
        allowConsultations: "no",
        qualificationWindow: "",
      });
      setIsOfferDisclaimerOpen(false);
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
      // Verify all leads exist
      const selectedLeads = leads?.filter(l => proposalFormData.leadIds.includes(l.id)) || [];
      if (selectedLeads.length === 0) {
        toast.error(t("offers.proposalDialog.error"), {
          description: t("offers.proposalDialog.leadNotFound"),
        });
        return;
      }

      // Create a proposal for each selected lead
      const proposalPromises = proposalFormData.leadIds.map((leadId) =>
        createProposal.mutateAsync({
          offerId: selectedOffer.id,
          leadManagerId: user.id,
          leadId: leadId,
          description: proposalFormData.description,
        })
      );

      await Promise.all(proposalPromises);

      setProposalFormData({
        leadIds: [],
        description: "",
      });
      setDisclaimerAccepted(false);
      setIsProposalDialogOpen(false);
      setIsDetailDialogOpen(false);
      toast.success(t("offers.proposalDialog.success"), {
        description: `${proposalFormData.leadIds.length} proposal(s) submitted successfully`,
      });
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
      leadIds: [],
      description: "",
    });
    // Open lead selector modal
    setIsLeadSelectorOpen(true);
  };

  const handleLeadsSelected = (selectedLeads: Lead[]) => {
    // Set the selected lead IDs
    setProposalFormData((prev) => ({
      ...prev,
      leadIds: selectedLeads.map((lead) => lead.id),
    }));
    // Reset disclaimer acceptance
    setDisclaimerAccepted(false);
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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">{t("offers.offerTitle")}</TableHead>
              <TableHead className="min-w-[200px]">{t("offers.description")}</TableHead>
              <TableHead className="min-w-[200px]">{t("offers.offerAttachmentUrl")}</TableHead>
              <TableHead className="min-w-[120px]">{t("offers.price")}</TableHead>
              <TableHead className="min-w-[100px]">{t("offers.status")}</TableHead>
              {!showActions && <TableHead className="min-w-[150px]">{t("offers.company")}</TableHead>}
              <TableHead className="min-w-[120px]">{t("offers.createdAt")}</TableHead>
              <TableHead className="text-right min-w-[200px]">{t("offers.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-medium text-sm md:text-base">{offer.title}</TableCell>
                <TableCell className="max-w-md truncate text-sm md:text-base">{offer.description}</TableCell>
                <TableCell className="max-w-md truncate text-sm md:text-base">{offer.offerAttachmentUrl ? (
                  <a
                    href={offer.offerAttachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {offer.offerAttachmentUrl}
                    </a>
                    ) : (
                      <span className="text-muted-foreground">{t("offers.noAttachment")}</span>
                    )}</TableCell>
                <TableCell className="font-semibold text-primary text-sm md:text-base whitespace-nowrap">
                  {formatCurrencyCLP(offer.price)}
                </TableCell>
                <TableCell>{getStatusBadge(offer.status)}</TableCell>
                {!showActions && (
                  <TableCell>
                    <SellerCell sellerId={offer.sellerId} />
                  </TableCell>
                )}
                <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(offer.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(offer)}
                    className="w-full sm:w-auto"
                  >
                    {t("common.viewDetails")}
                  </Button>
                  {showActions && (
                    <Select
                      value={offer.status}
                      onValueChange={(value) => handleStatusChange(offer.id, value as OfferStatus)}
                    >
                      <SelectTrigger className="w-full sm:w-32">
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
                      className="w-full sm:w-auto"
                    >
                      {t("common.createProposal")}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t("offers.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("offers.subtitle")}</p>
        </div>
        {isSeller && (
          <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">{t("offers.createOffer")}</Button>
        )}
      </div>

      {isSeller ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("offers.myOffers")}</CardTitle>
            <CardDescription>{t("myOffers.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filter and Sort Bar */}
            <div className="space-y-4 mb-6">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("offers.filters.searchPlaceholder")}
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
                    {t("offers.filters.clearFilters")}
                  </Button>
                )}
              </div>

              {/* Filters and Sort */}
              <div className="flex flex-wrap gap-2">
                {/* Status Filter */}
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value as OfferStatus | "all" })}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t("offers.filters.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("offers.filters.allStatuses")}</SelectItem>
                    <SelectItem value="ACTIVE">{t("common.active")}</SelectItem>
                    <SelectItem value="INACTIVE">{t("common.inactive")}</SelectItem>
                    <SelectItem value="ARCHIVED">{t("common.archived")}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1 w-full sm:w-auto">
                      <ArrowUpDown className="h-4 w-4" />
                      {t("offers.filters.sortBy")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>{t("offers.filters.sortBy")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                      {sort.field === "createdAt" && sort.direction === "desc" ? t("offers.filters.sort.dateDesc") : t("offers.filters.sort.dateAsc")}
                      {sort.field === "createdAt" && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {sort.direction === "asc" ? "↑" : "↓"}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort("price")}>
                      {sort.field === "price" && sort.direction === "asc" ? t("offers.filters.sort.priceAsc") : t("offers.filters.sort.priceDesc")}
                      {sort.field === "price" && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {sort.direction === "asc" ? "↑" : "↓"}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort("title")}>
                      {sort.field === "title" && sort.direction === "asc" ? t("offers.filters.sort.titleAsc") : t("offers.filters.sort.titleDesc")}
                      {sort.field === "title" && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {sort.direction === "asc" ? "↑" : "↓"}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Results count */}
              {!isLoadingMy && filteredMyOffers && (
                <p className="text-sm text-muted-foreground">
                  {`${filteredMyOffers.length} ${t("common.of")} ${myOffers?.length || 0} ${t("offers.title").toLowerCase()}`}
                </p>
              )}
            </div>

            {renderOffersTable(filteredMyOffers, isLoadingMy, true)}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("offers.allOffers")}</CardTitle>
            <CardDescription>{t("offers.listDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filter and Sort Bar */}
            <div className="space-y-4 mb-6">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("offers.filters.searchPlaceholder")}
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
                    {t("offers.filters.clearFilters")}
                  </Button>
                )}
              </div>

              {/* Filters and Sort */}
              <div className="flex flex-wrap gap-2">
                {/* Status Filter */}
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value as OfferStatus | "all" })}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t("offers.filters.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("offers.filters.allStatuses")}</SelectItem>
                    <SelectItem value="ACTIVE">{t("common.active")}</SelectItem>
                    <SelectItem value="INACTIVE">{t("common.inactive")}</SelectItem>
                    <SelectItem value="ARCHIVED">{t("common.archived")}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1 w-full sm:w-auto">
                      <ArrowUpDown className="h-4 w-4" />
                      {t("offers.filters.sortBy")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>{t("offers.filters.sortBy")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                      {sort.field === "createdAt" && sort.direction === "desc" ? t("offers.filters.sort.dateDesc") : t("offers.filters.sort.dateAsc")}
                      {sort.field === "createdAt" && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {sort.direction === "asc" ? "↑" : "↓"}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort("price")}>
                      {sort.field === "price" && sort.direction === "asc" ? t("offers.filters.sort.priceAsc") : t("offers.filters.sort.priceDesc")}
                      {sort.field === "price" && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {sort.direction === "asc" ? "↑" : "↓"}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort("title")}>
                      {sort.field === "title" && sort.direction === "asc" ? t("offers.filters.sort.titleAsc") : t("offers.filters.sort.titleDesc")}
                      {sort.field === "title" && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {sort.direction === "asc" ? "↑" : "↓"}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Results count */}
              {!isLoadingAll && filteredAllOffers && (
                <p className="text-sm text-muted-foreground">
                  {`${filteredAllOffers.length} ${t("common.of")} ${allOffers?.length || 0} ${t("offers.title").toLowerCase()}`}
                </p>
              )}
            </div>

            {errorAll ? (
              <div className="text-center py-8">
                <p className="text-sm text-red-400">{t("offers.failedToLoad")}</p>
              </div>
            ) : (
              renderOffersTable(filteredAllOffers, isLoadingAll, false)
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Offer Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="offerAttachmentUrl">{t("offers.createDialog.offerAttachmentUrl")}</Label>
                <Input
                  id="offerAttachmentUrl"
                  placeholder={t("offers.createDialog.offerAttachmentUrlPlaceholder")}
                  value={offerFormData.offerAttachmentUrl}
                  onChange={(e) => setOfferFormData({ ...offerFormData, offerAttachmentUrl: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{t("offers.createDialog.offerPrice")} (CLP)</Label>
                <MoneyInput
                  id="price"
                  placeholder={t("offers.createDialog.pricePlaceholder")}
                  value={offerFormData.price}
                  onChange={(value) => setOfferFormData({ ...offerFormData, price: value })}
                  required
                />
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground">{t("offers.createDialog.optionalDetails")}</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                      <Label htmlFor="qualificationWindow">{t("offers.createDialog.qualificationWindow")}</Label>
                      <Input
                        id="qualificationWindow"
                        type="number"
                        placeholder={t("offers.createDialog.qualificationWindowPlaceholder")}
                        value={offerFormData.qualificationWindow || ""}
                        onChange={(e) => setOfferFormData({ ...offerFormData, qualificationWindow: e.target.value })}
                        min="1"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("offers.createDialog.qualificationWindowHelp")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="acceptanceCriteria">{t("offers.createDialog.acceptanceCriteria")}</Label>
                    <Textarea
                      id="acceptanceCriteria"
                      placeholder={t("offers.createDialog.acceptanceCriteriaPlaceholder")}
                      value={offerFormData.acceptanceCriteria}
                      onChange={(e) => setOfferFormData({ ...offerFormData, acceptanceCriteria: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {offerFormData.allowConsultations === "yes" && (
                    <div className="bg-muted p-3 rounded-md border border-border sm:col-span-2">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{t("offers.createDialog.internalMessageChannel")}</span> {t("offers.createDialog.consultationsEnabledMessage")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createOffer.isPending}
                className="w-full sm:w-auto"
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={createOffer.isPending} className="w-full sm:w-auto">
                {createOffer.isPending ? t("common.loading") : t("offers.createOffer")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Offer Terms Disclaimer Modal */}
      <Dialog open={isOfferDisclaimerOpen} onOpenChange={setIsOfferDisclaimerOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("offers.offerDisclaimer.title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {t("offers.offerDisclaimer.body")}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="offer-disclaimer-checkbox"
                  checked={offerDisclaimerAccepted}
                  onCheckedChange={(checked) => setOfferDisclaimerAccepted(checked === true)}
                />
                <label
                  htmlFor="offer-disclaimer-checkbox"
                  className="text-sm font-medium leading-relaxed cursor-pointer"
                >
                  {t("offers.offerDisclaimer.acceptLabel")}
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOfferDisclaimerOpen(false)}
              disabled={createOffer.isPending}
              className="w-full sm:w-auto"
            >
              {t("offers.offerDisclaimer.cancel")}
            </Button>
            <Button
              onClick={handleConfirmCreateOffer}
              disabled={!offerDisclaimerAccepted || createOffer.isPending}
              className="w-full sm:w-auto"
            >
              {createOffer.isPending ? t("common.loading") : t("offers.offerDisclaimer.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead Selector Modal */}
      <LeadSelector
        open={isLeadSelectorOpen}
        onOpenChange={setIsLeadSelectorOpen}
        leads={leads}
        isLoading={false}
        onSelectLeads={handleLeadsSelected}
        selectedLeadIds={proposalFormData.leadIds}
      />

      {/* Create Proposal Dialog */}
      <Dialog open={isProposalDialogOpen} onOpenChange={setIsProposalDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
          <form onSubmit={handleSubmitProposal}>
            <DialogHeader>
              <DialogTitle>{t("offers.proposalDialog.title")}</DialogTitle>
              <DialogDescription>
                {t("offers.proposalDialog.description")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Display selected leads info */}
              {proposalFormData.leadIds.length > 0 && leads && (
                <div className="space-y-2">
                  <Label>
                    {t("proposals.selectedLead")} ({proposalFormData.leadIds.length})
                  </Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {proposalFormData.leadIds.map((leadId) => {
                      const selectedLead = leads.find(l => l.id === leadId);
                      return selectedLead ? (
                        <div key={leadId} className="p-3 border rounded-md bg-muted/50">
                          <p className="font-medium">{selectedLead.companyName}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedLead.fullName} - {selectedLead.email}
                          </p>
                        </div>
                      ) : null;
                    })}
                  </div>
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

              {/* Privacy & Data Processing Disclaimer */}
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <h4 className="text-xs font-semibold text-foreground">
                      {t("offers.proposalDisclaimer.title")}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t("offers.proposalDisclaimer.body")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="disclaimer-checkbox"
                    checked={disclaimerAccepted}
                    onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
                  />
                  <label
                    htmlFor="disclaimer-checkbox"
                    className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    {t("offers.proposalDisclaimer.checkbox")}
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsProposalDialogOpen(false)}
                disabled={createProposal.isPending}
                className="w-full sm:w-auto"
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={createProposal.isPending || proposalFormData.leadIds.length === 0 || !disclaimerAccepted} className="w-full sm:w-auto">
                {createProposal.isPending ? t("common.loading") : t("offers.proposalDialog.submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Offer Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.title")}</p>
                    <p className="text-sm font-medium">{selectedOffer.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.offerAttachmentUrl")}</p>
                    <p className="text-sm font-medium">{selectedOffer.offerAttachmentUrl}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.status")}</p>
                    <div className="mt-1">{getStatusBadge(selectedOffer.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.price")}</p>
                    <p className="text-sm font-semibold text-primary">{formatCurrencyCLP(selectedOffer.price)}</p>
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    {selectedOffer.qualificationWindow && (
                      <div>
                        <p className="text-sm text-muted-foreground">{t("offers.detailDialog.fields.qualificationWindow")}</p>
                        <p className="text-sm font-medium">{selectedOffer.qualificationWindow} {t("offers.detailDialog.fields.hours")}</p>
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

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {isLeadManager && selectedOffer && (
              <Button 
                onClick={() => {
                  setIsDetailDialogOpen(false);
                  handleCreateProposal(selectedOffer);
                }}
                className="w-full sm:w-auto"
              >
                {t("common.createProposal")}
              </Button>
            )}
            <Button variant="secondary" onClick={() => setIsDetailDialogOpen(false)} className="w-full sm:w-auto">
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
