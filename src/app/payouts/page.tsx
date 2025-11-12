"use client";

import { useState, useMemo } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableSkeleton, StatsCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { usePayoutsByManager, useUpdatePayoutStatus } from "@/hooks/use-payouts";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrencyCLP } from "@/lib/utils";
import { toast } from "sonner";
import { useFilteredPayouts, type PayoutFilters, type PayoutSort } from "@/hooks/use-filtered-payouts";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

export default function PayoutsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: payouts, isLoading, error } = usePayoutsByManager(user?.id || "");
  const updatePayoutStatus = useUpdatePayoutStatus();

  const isAdmin = user?.role === "ADMIN";

  // Filter and sort state
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [filters, setFilters] = useState<PayoutFilters>({
    search: "",
    status: "all",
  });

  // Sort state - default to createdAt DESC
  const [sort, setSort] = useState<PayoutSort>({
    field: "createdAt",
    direction: "desc",
  });

  // Update filters when debounced search changes
  useMemo(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // Apply filters and sorting to payouts
  const filteredPayouts = useFilteredPayouts(payouts, filters, sort);

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
  const handleSort = (field: PayoutSort["field"]) => {
    setSort((prev) => {
      if (prev.field === field) {
        // Toggle direction if same field
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      // Default to descending for new field
      return { field, direction: "desc" };
    });
  };

  const handleMarkAsPaid = async (payoutId: string) => {
    try {
      await updatePayoutStatus.mutateAsync({
        id: payoutId,
        status: "PAID",
      });
      toast.success(t("common.submit"), {
        description: t("payouts.successMarkedPaid"),
      });
    } catch (error) {
      toast.error(t("common.error"), {
        description: t("payouts.errorMarkingPaid"),
      });
      console.error("Failed to update payout status:", error);
    }
  };

  const getStatusBadge = (status: "PENDING" | "PAID") => {
    const variants = {
      PENDING: "bg-yellow-600 text-white",
      PAID: "bg-green-600 text-white",
    };

    const statusLabels = {
      PENDING: t("payouts.statusBadges.pending"),
      PAID: t("payouts.statusBadges.paid"),
    };

    return <Badge className={variants[status]}>{statusLabels[status]}</Badge>;
  };

  // Calculate totals (based on all payouts, not filtered)
  const pendingTotal = payouts?.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0) || 0;
  const paidTotal = payouts?.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0) || 0;
  const totalAmount = pendingTotal + paidTotal;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t("payouts.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("payouts.subtitle")}</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("payouts.cards.pending")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{formatCurrencyCLP(pendingTotal)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {payouts?.filter((p) => p.status === "PENDING").length || 0} {t("payouts.payoutCount")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("payouts.cards.paid")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrencyCLP(paidTotal)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {payouts?.filter((p) => p.status === "PAID").length || 0} {t("payouts.payoutCount")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("payouts.cards.totalEarnings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrencyCLP(totalAmount)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {payouts?.length || 0} {t("payouts.totalPayoutCount")}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("payouts.payoutHistory")}</CardTitle>
          <CardDescription>{t("payouts.payoutHistoryDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter and Sort Bar */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("payouts.filters.searchPlaceholder")}
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
                  {t("payouts.filters.clearFilters")}
                </Button>
              )}
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap gap-2">
              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value as "PENDING" | "PAID" | "all" })}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("payouts.filters.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("payouts.filters.allStatuses")}</SelectItem>
                  <SelectItem value="PENDING">{t("payouts.statusBadges.pending")}</SelectItem>
                  <SelectItem value="PAID">{t("payouts.statusBadges.paid")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 w-full sm:w-auto">
                    <ArrowUpDown className="h-4 w-4" />
                    {t("payouts.filters.sortBy")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px]">
                  <DropdownMenuLabel>{t("payouts.filters.sortBy")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                    {sort.field === "createdAt" && sort.direction === "desc" ? t("payouts.filters.sort.dateDesc") : t("payouts.filters.sort.dateAsc")}
                    {sort.field === "createdAt" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("amount")}>
                    {sort.field === "amount" && sort.direction === "asc" ? t("payouts.filters.sort.amountAsc") : t("payouts.filters.sort.amountDesc")}
                    {sort.field === "amount" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("status")}>
                    {sort.field === "status" && sort.direction === "asc" ? t("payouts.filters.sort.statusAsc") : t("payouts.filters.sort.statusDesc")}
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
            {!isLoading && filteredPayouts && (
              <p className="text-sm text-muted-foreground">
                {`${t("common.showing")} ${filteredPayouts.length} ${t("common.of")} ${payouts?.length || 0} ${t("payouts.title").toLowerCase()}`}
              </p>
            )}
          </div>

          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">{t("payouts.errorLoading")}</p>
            </div>
          ) : filteredPayouts && filteredPayouts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">{t("payouts.payoutId")}</TableHead>
                    <TableHead className="min-w-[120px]">{t("payouts.amount")}</TableHead>
                    <TableHead className="min-w-[100px]">{t("payouts.status")}</TableHead>
                    <TableHead className="min-w-[120px]">{t("payouts.createdAt")}</TableHead>
                    <TableHead className="min-w-[120px]">{t("payouts.paidDate")}</TableHead>
                    {isAdmin && <TableHead className="min-w-[120px]">{t("payouts.actions")}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono text-xs">{payout.id.substring(0, 20)}...</TableCell>
                      <TableCell className="font-semibold text-primary text-sm md:text-base whitespace-nowrap">
                        {formatCurrencyCLP(payout.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(payout.status)}</TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : "-"}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          {payout.status === "PENDING" && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsPaid(payout.id)}
                              disabled={updatePayoutStatus.isPending}
                            >
                              {updatePayoutStatus.isPending ? t("payouts.processing") : t("payouts.markAsPaid")}
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Cash}
              title={t("payouts.emptyStateTitle")}
              description={t("payouts.emptyStateDescription")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
