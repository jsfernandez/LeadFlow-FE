"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { TableSkeleton, StatsCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { usePaymentsBySeller, usePaymentsByLeadManager, useUpdatePaymentStatus } from "@/hooks/use-payments";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrencyCLP } from "@/lib/utils";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Filter, X, Clock, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import type { Payment } from "@/types";
import {
  getDaysRemaining,
  formatDaysRemaining,
  getPaymentStatusColor,
  calculatePaymentSummary,
  isPaymentOverdue,
  isPaymentDueSoon,
  canMarkAsPaid,
  canDisputePayment,
} from "@/lib/payment-utils";
import { DisputeTicketModal } from "@/components/ui/dispute-ticket-modal";
import { useOffers } from "@/hooks/use-offers";
import { useLeadOffers } from "@/hooks/use-lead-offers";
import { useLeads } from "@/hooks/use-leads";
import { useCreateTicket } from "@/hooks/use-tickets";
import type { TicketCategory } from "@/types";

export default function PaymentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isSeller = user?.role === "SELLER";
  const isLeadManager = user?.role === "LEAD_MANAGER";

  // Fetch payments based on role
  const { data: sellerPayments, isLoading: isLoadingSeller } = usePaymentsBySeller(
    isSeller ? user?.id || "" : ""
  );
  const { data: managerPayments, isLoading: isLoadingManager } = usePaymentsByLeadManager(
    isLeadManager ? user?.id || "" : ""
  );

  const payments = isSeller ? sellerPayments || [] : managerPayments || [];
  const isLoading = isSeller ? isLoadingSeller : isLoadingManager;

  // Fetch related data for display
  const { data: offers = [] } = useOffers();
  const { data: leadOffers = [] } = useLeadOffers();
  const { data: leads = [] } = useLeads();

  const updatePaymentStatus = useUpdatePaymentStatus();
  const createTicket = useCreateTicket();

  // Filter and sort state
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dueDateFilter, setDueDateFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  // Calculate summary
  const paymentSummary = useMemo(() => calculatePaymentSummary(payments), [payments]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter((payment) => {
        const offer = offers.find((o) => o.id === payment.offerId);
        const lead = leads.find((l) => l.id === payment.leadId);
        
        return (
          offer?.title.toLowerCase().includes(searchLower) ||
          lead?.fullName.toLowerCase().includes(searchLower) ||
          lead?.companyName.toLowerCase().includes(searchLower) ||
          payment.notes?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Due date filter
    if (dueDateFilter === "overdue") {
      filtered = filtered.filter((p) => isPaymentOverdue(p));
    } else if (dueDateFilter === "upcoming") {
      filtered = filtered.filter((p) => isPaymentDueSoon(p, 7) && !isPaymentOverdue(p));
    }

    // Sort by due date (soonest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });

    return filtered;
  }, [payments, debouncedSearch, statusFilter, dueDateFilter, offers, leadOffers, leads]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return debouncedSearch !== "" || statusFilter !== "all" || dueDateFilter !== "all";
  }, [debouncedSearch, statusFilter, dueDateFilter]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput("");
    setStatusFilter("all");
    setDueDateFilter("all");
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      await updatePaymentStatus.mutateAsync({
        id: paymentId,
        status: "PAID",
      });
      toast.success(t("common.submit"), {
        description: t("payments.paymentUpdated"),
      });
      setIsDetailsOpen(false);
    } catch (error) {
      toast.error(t("common.error"), {
        description: t("common.error"),
      });
      console.error("Failed to update payment status:", error);
    }
  };

  const handleOpenDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
  };

  const handleOpenDispute = () => {
    setIsDetailsOpen(false);
    setIsDisputeModalOpen(true);
  };

  const handleDisputeSubmit = async (
    category: TicketCategory,
    description: string,
    attachmentUrl?: string
  ) => {
    if (!selectedPayment || !user) return;

    try {
      await createTicket.mutateAsync({
        category,
        description,
        reporterId: user.id,
        relatedProposalId: selectedPayment.proposalId,
        relatedOfferId: selectedPayment.offerId,
        attachmentUrl,
      });

      // Update payment status to DISPUTED
      await updatePaymentStatus.mutateAsync({
        id: selectedPayment.id,
        status: "DISPUTED",
        notes: `Dispute ticket created: ${category}`,
      });

      toast.success(t("payments.ticketCreated"));
      setIsDisputeModalOpen(false);
      setSelectedPayment(null);
    } catch (error) {
      toast.error(t("common.error"));
      console.error("Failed to create dispute ticket:", error);
    }
  };

  const getStatusBadge = (status: Payment["status"]) => {
    const color = getPaymentStatusColor(status);
    const label = t(`payments.status.${status.toLowerCase()}`);
    return <Badge className={color}>{label}</Badge>;
  };

  const getDueDateBadge = (payment: Payment) => {
    const daysRemaining = getDaysRemaining(payment.dueDate);
    const { text, isOverdue } = formatDaysRemaining(daysRemaining);

    if (payment.status === "PAID") {
      return (
        <Badge className="bg-green-600 text-white flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {t("common.paid")}
        </Badge>
      );
    }

    if (isOverdue) {
      return (
        <Badge className="bg-red-600 text-white flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Overdue {text} days
        </Badge>
      );
    }

    if (parseInt(text) <= 3) {
      return (
        <Badge className="bg-orange-600 text-white flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Due in {text} days
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-600 text-white flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Due in {text} days
      </Badge>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t("payments.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("payments.subtitle")}</p>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {isSeller ? t("payments.iMustPay") : t("payments.owedToMe")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{paymentSummary.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrencyCLP(paymentSummary.pendingAmount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("common.paid")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{paymentSummary.paid}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrencyCLP(paymentSummary.paidAmount)}
              </p>
            </CardContent>
          </Card>

          {paymentSummary.overdue > 0 && (
            <Card className="border-red-500/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  {t("payments.overduePayments")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{paymentSummary.overdue}</div>
                <p className="text-xs text-red-400 mt-1">{t("payments.duesSoon")}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("payments.upcomingPayments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{paymentSummary.upcoming}</div>
              <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("payments.title")}</CardTitle>
          <CardDescription>
            {isSeller ? t("payments.iMustPay") : t("payments.owedToMe")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Bar */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by offer, lead or company..."
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
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">{t("payments.status.pending")}</SelectItem>
                  <SelectItem value="IN_GRACE_PERIOD">{t("payments.status.inGracePeriod")}</SelectItem>
                  <SelectItem value="PAID">{t("payments.status.paid")}</SelectItem>
                  <SelectItem value="DISPUTED">{t("payments.status.disputed")}</SelectItem>
                  <SelectItem value="REJECTED">{t("payments.status.rejected")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Due Date Filter */}
              <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Due Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="overdue">{t("payments.filters.overdue")}</SelectItem>
                  <SelectItem value="upcoming">{t("payments.filters.upcoming")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            {!isLoading && (
              <p className="text-sm text-muted-foreground">
                Showing {filteredPayments.length} of {payments.length} payments
              </p>
            )}
          </div>

          {/* Payments Table */}
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Offer</TableHead>
                    <TableHead className="min-w-[120px]">
                      {isSeller ? "Lead Manager" : "Seller"}
                    </TableHead>
                    <TableHead className="min-w-[120px]">Lead</TableHead>
                    <TableHead className="min-w-[120px]">Amount</TableHead>
                    <TableHead className="min-w-[120px]">Due Date</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const offer = offers.find((o) => o.id === payment.offerId);
                    const lead = leads.find((l) => l.id === payment.leadId);
                    
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {offer?.title || "Unknown Offer"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {isSeller ? "Lead Manager" : "Seller"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {lead?.fullName || "—"}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {lead?.companyName || ""}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-primary whitespace-nowrap">
                          {formatCurrencyCLP(payment.amountCLP)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(payment.dueDate).toLocaleDateString()}
                          <br />
                          {getDueDateBadge(payment)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDetails(payment)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Cash}
              title="No payments recorded yet"
              description="Payments are automatically generated when proposals are accepted and leads are converted."
            />
          )}
        </CardContent>
      </Card>

      {/* Payment Details Sheet */}
      {selectedPayment && (
        <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <SheetContent className="sm:max-w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Payment Details</SheetTitle>
              <SheetDescription>
                Contract terms and deadline information
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Status and Deadline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(selectedPayment.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Due Date</span>
                  {getDueDateBadge(selectedPayment)}
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold text-primary">
                      {formatCurrencyCLP(selectedPayment.amountCLP)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Offer</span>
                    <span>
                      {offers.find((o) => o.id === selectedPayment.offerId)?.title || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lead</span>
                    <span>
                      {leads.find((l) => l.id === selectedPayment.leadId)?.fullName || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedPayment.notes && (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold">Notes</h3>
                  <p className="text-sm text-muted-foreground">{selectedPayment.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold">Actions</h3>
                <div className="flex flex-col gap-2">
                  {canMarkAsPaid(selectedPayment) && isSeller && (
                    <Button
                      onClick={() => handleMarkAsPaid(selectedPayment.id)}
                      disabled={updatePaymentStatus.isPending}
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("payments.markAsPaid")}
                    </Button>
                  )}
                  {canDisputePayment(selectedPayment) && (
                    <Button
                      variant="outline"
                      onClick={handleOpenDispute}
                      className="w-full"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {t("payments.dispute")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Dispute Modal */}
      {selectedPayment && (
        <DisputeTicketModal
          open={isDisputeModalOpen}
          onOpenChange={(open) => {
            setIsDisputeModalOpen(open);
            if (!open) {
              setSelectedPayment(null);
            }
          }}
          onSubmit={handleDisputeSubmit}
          proposalId={selectedPayment.proposalId}
          relatedOfferId={selectedPayment.offerId}
        />
      )}
    </div>
  );
}
