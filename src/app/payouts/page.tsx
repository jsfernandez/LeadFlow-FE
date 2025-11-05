"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton, StatsCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { usePayoutsByManager, useUpdatePayoutStatus } from "@/hooks/use-payouts";
import { useAuth } from "@/components/providers/auth-provider";

export default function PayoutsPage() {
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
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Failed to update payout status:", error);
    }
  };

  const getStatusBadge = (status: "PENDING" | "PAID") => {
    const variants = {
      PENDING: "bg-yellow-600 text-white",
      PAID: "bg-green-600 text-white",
    };

    return <Badge className={variants[status]}>{status}</Badge>;
  };

  // Calculate totals
  const pendingTotal = payouts?.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0) || 0;
  const paidTotal = payouts?.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0) || 0;
  const totalAmount = pendingTotal + paidTotal;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="text-muted-foreground">Track your earnings and payout history</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">${pendingTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {payouts?.filter((p) => p.status === "PENDING").length || 0} payout(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">${paidTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {payouts?.filter((p) => p.status === "PAID").length || 0} payout(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {payouts?.length || 0} total payout(s)
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>All your past and pending payouts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">Failed to load payouts. Please try again.</p>
            </div>
          ) : payouts && payouts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Paid Date</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-mono text-xs">{payout.id.substring(0, 20)}...</TableCell>
                    <TableCell className="font-semibold text-primary">
                      ${payout.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payout.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
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
                            {updatePayoutStatus.isPending ? "Processing..." : "Mark as Paid"}
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Cash}
              title="No payout history yet"
              description="Payouts are generated when leads are marked as WON. Start qualifying your leads to earn payouts!"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
