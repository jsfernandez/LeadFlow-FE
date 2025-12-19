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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { DealEvaluationActions } from "@/components/ui/deal-evaluation-actions";
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
      let successMessage = "";
      
      if (newStatus === "IN_PROGRESS") {
        successMessage = t("sellerProposals.startManagementSuccess") || "Lead management started successfully";
      } else if (newStatus === "WON") {
        successMessage = t("sellerProposals.acceptSuccess");
      } else if (newStatus === "LOST") {
        successMessage = t("sellerProposals.rejectSuccess");
      } else {
        // Default success message for any other status
        successMessage = "Proposal status updated successfully";
      }
      
      toast.success(successMessage);
      setIsDrawerOpen(false);
    } catch {
      toast.error(t("sellerProposals.updateError"));
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    const variants: Record<LeadStatus, string> = {
      PENDING: "bg-yellow-600 text-white",
      IN_PROGRESS: "bg-blue-600 text-white",
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

  // Component to display lead info - masked until proposal accepted or in progress
  const LeadCell = ({ leadId, proposalStatus }: { leadId: string; proposalStatus: LeadStatus }) => {
    const { data: lead } = useQuery({
      queryKey: ["lead", leadId],
      queryFn: () => dataProvider.getLeadById(leadId),
      enabled: !!leadId,
    });

    if (!lead) {
      return <span className="text-sm text-muted-foreground">{t("common.loading")}</span>;
    }

    const showFullData = proposalStatus === "WON" || proposalStatus === "IN_PROGRESS";

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          {showFullData ? lead.fullName : maskLeadData(lead.fullName, "name")}
        </span>
        <span className="text-xs text-muted-foreground">
          {showFullData ? lead.companyName : maskLeadData(lead.companyName, "name")}
        </span>
      </div>
    );
  };

  // Helper function to mask sensitive lead data before acceptance
  const maskLeadData = (data: string, type: "email" | "phone" | "name" = "name"): string => {
    if (!data) return "***";
    
    if (type === "email") {
      const [localPart, domain] = data.split("@");
      if (!domain) return "***@***";
      const maskedLocal = localPart.length > 2 ? localPart.substring(0, 2) + "***" : "***";
      const [domainName, tld] = domain.split(".");
      const maskedDomain = domainName.length > 2 ? domainName.substring(0, 2) + "***" : "***";
      return `${maskedLocal}@${maskedDomain}.${tld || "***"}`;
    } else if (type === "phone") {
      // Show only last 4 digits
      const cleaned = data.replace(/\D/g, "");
      if (cleaned.length <= 4) return "***";
      return "***-" + cleaned.slice(-4);
    } else if (type === "name") {
      // Show only first name or first word
      const parts = data.split(" ");
      if (parts.length === 0) return "***";
      return parts[0] + " ***";
    }
    
    return "***";
  };

  // Helper function to calculate qualification window status
  // Uses the qualificationWindow from the offer (configurable hours)
  const getQualificationWindowStatus = (proposal: LeadOffer, offer: { qualificationWindow?: number } | null): { 
    isWithinWindow: boolean; 
    remainingTime: string;
    isExpired: boolean;
  } => {
    // Only applicable for IN_PROGRESS status when assignedAt is set
    if (proposal.status !== "IN_PROGRESS" || !proposal.assignedAt) {
      return { isWithinWindow: false, remainingTime: "", isExpired: false };
    }

    // Default to 24 hours if not specified in offer
    const qualificationWindowHours = offer?.qualificationWindow || 24;
    
    const assignedDate = new Date(proposal.assignedAt);
    const now = new Date();
    const hoursElapsed = (now.getTime() - assignedDate.getTime()) / (1000 * 60 * 60);
    
    const isWithinWindow = hoursElapsed < qualificationWindowHours;
    const remainingHours = Math.max(0, qualificationWindowHours - hoursElapsed);
    
    let remainingTime = "";
    if (isWithinWindow) {
      if (remainingHours >= 1) {
        remainingTime = `${Math.floor(remainingHours)}h ${Math.floor((remainingHours % 1) * 60)}m`;
      } else {
        remainingTime = `${Math.floor(remainingHours * 60)}m`;
      }
    }
    
    return {
      isWithinWindow,
      remainingTime,
      isExpired: !isWithinWindow && hoursElapsed >= qualificationWindowHours
    };
  };

  // Helper function to check if proposal is within 24-hour withdrawal window (for WON status)
  // This is the quality check window after accepting
  const canWithdrawProposal = (proposal: LeadOffer): { canWithdraw: boolean; remainingTime: string } => {
    if (proposal.status !== "WON" || !proposal.assignedAt) {
      return { canWithdraw: false, remainingTime: "" };
    }

    const assignedDate = new Date(proposal.assignedAt);
    const now = new Date();
    
    // Calculate business hours elapsed
    let businessHoursElapsed = 0;
    const currentDate = new Date(assignedDate);
    
    while (currentDate < now && businessHoursElapsed < 24) {
      const dayOfWeek = currentDate.getDay();
      const hour = currentDate.getHours();
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Check if within business hours (9 AM - 5 PM)
        if (hour >= 9 && hour < 17) {
          businessHoursElapsed++;
        }
      }
      
      // Move to next hour
      currentDate.setHours(currentDate.getHours() + 1);
    }
    
    const canWithdraw = businessHoursElapsed < 24;
    const remainingHours = Math.max(0, 24 - businessHoursElapsed);
    
    return {
      canWithdraw,
      remainingTime: canWithdraw ? `${remainingHours}h remaining` : ""
    };
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

    // Show full lead data if proposal is accepted (WON) or in progress (IN_PROGRESS)
    const showFullLeadData = proposal.status === "WON" || proposal.status === "IN_PROGRESS";

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
            {!showFullLeadData && (
              <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  {t("sellerProposals.leadDataHiddenNotice") || "Lead contact details are hidden until you accept this proposal. This ensures proper traceability."}
                </p>
              </div>
            )}
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t("leads.fullName")}:</span>
                <span className="ml-2 font-medium">
                  {showFullLeadData ? lead.fullName : maskLeadData(lead.fullName, "name")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("leads.company")}:</span>
                <span className="ml-2 font-medium">
                  {showFullLeadData ? lead.companyName : maskLeadData(lead.companyName, "name")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("leads.email")}:</span>
                <span className="ml-2">
                  {showFullLeadData ? lead.email : maskLeadData(lead.email, "email")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("leads.phone")}:</span>
                <span className="ml-2">
                  {showFullLeadData ? lead.phone : maskLeadData(lead.phone, "phone")}
                </span>
              </div>
              {showFullLeadData && lead.profileUrl && (
                <div>
                  <span className="text-muted-foreground">{t("leads.profileUrl") || "Profile"}:</span>
                  <a href={lead.profileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline">
                    {lead.profileUrl}
                  </a>
                </div>
              )}
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

        {/* Actions for PENDING proposals - Start Management or Reject */}
        {proposal.status === "PENDING" && (
          <div className="pt-4 border-t space-y-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {t("sellerProposals.startManagementNotice")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleUpdateStatus(proposal.id, "IN_PROGRESS")}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={updateStatus.isPending}
              >
                {t("sellerProposals.actions.startManagement")}
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
          </div>
        )}

        {/* Actions for IN_PROGRESS proposals - Mark as Won or Lost */}
        {proposal.status === "IN_PROGRESS" && (() => {
          const qualificationStatus = getQualificationWindowStatus(proposal, offer);
          return (
            <div className="pt-4 border-t space-y-3">
              {/* Qualification Window Info */}
              <div className={`p-3 border rounded-md ${
                qualificationStatus.isExpired 
                  ? "bg-red-500/10 border-red-500/20" 
                  : "bg-amber-500/10 border-amber-500/20"
              }`}>
                <p className="text-xs font-semibold mb-1 ${
                  qualificationStatus.isExpired 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-amber-600 dark:text-amber-400"
                }">
                  {t("sellerProposals.qualificationWindow") || "Qualification Window"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {qualificationStatus.isExpired ? (
                    t("sellerProposals.qualificationExpired") || "The qualification window has expired. Please make a decision on this lead."
                  ) : qualificationStatus.isWithinWindow ? (
                    <>
                      {t("sellerProposals.qualificationWindowNotice") || "You have time to evaluate this lead before committing to payment. Time remaining: "}
                      <strong className="text-foreground">{qualificationStatus.remainingTime}</strong>
                    </>
                  ) : (
                    t("sellerProposals.qualificationWindowNotice") || "Evaluating lead qualification..."
                  )}
                </p>
                {offer?.qualificationWindow && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("sellerProposals.totalQualificationTime") || "Total qualification time: "}{offer.qualificationWindow}h
                  </p>
                )}
              </div>

              {/* Final Decision Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUpdateStatus(proposal.id, "WON")}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={updateStatus.isPending}
                >
                  {t("sellerProposals.actions.markWon")}
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(proposal.id, "LOST")}
                  variant="outline"
                  className="flex-1"
                  disabled={updateStatus.isPending}
                >
                  {t("sellerProposals.actions.markLost")}
                </Button>
              </div>
            </div>
          );
        })()}

        {/* Withdrawal option for accepted proposals within 24 business hours */}
        {proposal.status === "WON" && (() => {
          const { canWithdraw, remainingTime } = canWithdrawProposal(proposal);
          return canWithdraw ? (
            <div className="pt-4 border-t">
              <div className="mb-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-md">
                <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">
                  <strong>{t("sellerProposals.withdrawalWindow") || "24-Hour Quality Window"}</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("sellerProposals.withdrawalNotice") || "You can withdraw this accepted lead within 24 business hours if the quality is poor. Time remaining: "}{remainingTime}
                </p>
              </div>
              <Button
                onClick={() => handleUpdateStatus(proposal.id, "LOST")}
                variant="destructive"
                className="w-full"
                disabled={updateStatus.isPending}
              >
                {t("sellerProposals.actions.withdraw") || "Withdraw Lead (Poor Quality)"}
              </Button>
            </div>
          ) : null;
        })()}
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
                  <SelectItem value="IN_PROGRESS">{t("common.in_progress")}</SelectItem>
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
                        <LeadCell leadId={proposal.leadId} proposalStatus={proposal.status} />
                      </TableCell>
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(proposal.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProposal(proposal);
                              setIsDrawerOpen(true);
                            }}
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t("sellerProposals.viewDetails")}
                          </Button>
                          {user && (
                            <DealEvaluationActions
                              proposal={proposal}
                              currentUserId={user.id}
                              currentUserRole="SELLER"
                              otherUserId={proposal.leadManagerId}
                              offerId={proposal.offerId}
                            />
                          )}
                        </div>
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

      {/* Proposal Details Dialog */}
      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("sellerProposals.detailsTitle")}</DialogTitle>
            <DialogDescription>
              {selectedProposal && `ID: ${selectedProposal.id.substring(0, 8)}...`}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <ProposalDetailsDrawer proposal={selectedProposal} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
