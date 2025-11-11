"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton, StatsCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { usePayoutsByManager, useUpdatePayoutStatus } from "@/hooks/use-payouts";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrencyCLP } from "@/lib/utils";
import { toast } from "sonner";

export default function PayoutsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: payouts, isLoading, error } = usePayoutsByManager(user?.id || "");
  const updatePayoutStatus = useUpdatePayoutStatus();

  const isAdmin = user?.role === "ADMIN";

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

  // Calculate totals
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
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">{t("payouts.errorLoading")}</p>
            </div>
          ) : payouts && payouts.length > 0 ? (
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
                  {payouts.map((payout) => (
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
