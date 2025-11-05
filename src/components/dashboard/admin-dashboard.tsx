"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { useOffers } from "@/hooks/use-offers";
import { useLeadOffers } from "@/hooks/use-lead-offers";
import { usePayouts } from "@/hooks/use-payouts";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * ADMIN Dashboard Component
 * Shows payouts summary, user counts, system-wide metrics, and payout trends
 */
export function AdminDashboard() {
  const { data: allOffers = [] } = useOffers();
  const { data: allLeadOffers = [] } = useLeadOffers();
  const { data: allPayouts = [] } = usePayouts();

  // Calculate metrics
  const totalOffers = allOffers.length;
  const activeOffers = allOffers.filter(o => o.status === "ACTIVE").length;
  const totalLeads = allLeadOffers.length;
  const wonLeads = allLeadOffers.filter(l => l.status === "WON").length;
  const totalPayouts = allPayouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = allPayouts.filter(p => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0);
  const paidPayouts = allPayouts.filter(p => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);

  // User counts (mock - in real app would fetch from users endpoint)
  const userCounts = [
    { role: "Sellers", count: 1, fill: "rgb(59, 130, 246)" },
    { role: "Managers", count: 1, fill: "rgb(34, 197, 94)" },
    { role: "Admins", count: 1, fill: "rgb(168, 85, 247)" },
  ];

  // Generate payout trends (last 7 days)
  const generatePayoutTrends = () => {
    const data = [];
    const now = new Date();
    
    // Group payouts by date
    const payoutsByDate = new Map<string, { pending: number; paid: number }>();
    allPayouts.forEach(p => {
      const dateKey = p.createdAt.toISOString().split('T')[0];
      const current = payoutsByDate.get(dateKey) || { pending: 0, paid: 0 };
      if (p.status === "PAID") {
        current.paid += p.amount;
      } else {
        current.pending += p.amount;
      }
      payoutsByDate.set(dateKey, current);
    });

    // Generate data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const amounts = payoutsByDate.get(dateKey) || { pending: 0, paid: 0 };
      
      data.push({
        date: dayName,
        pending: amounts.pending,
        paid: amounts.paid,
      });
    }
    
    return data;
  };

  const payoutTrends = generatePayoutTrends();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System-wide overview and analytics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Payouts"
          value={`$${totalPayouts.toFixed(0)}`}
          description="All time"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
          className="border-primary/50"
        />

        <StatCard
          title="Active Offers"
          value={activeOffers}
          description={`${totalOffers} total offers`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              <rect width="20" height="14" x="2" y="6" rx="2" />
            </svg>
          }
        />

        <StatCard
          title="Total Leads"
          value={totalLeads}
          description={`${wonLeads} won (${totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0}%)`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />

        <StatCard
          title="User Count"
          value={3}
          description="Total users"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Payout Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Trends</CardTitle>
            <CardDescription>Daily payouts by status (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={payoutTrends}>
                <XAxis
                  dataKey="date"
                  stroke="rgb(148, 163, 184)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgb(148, 163, 184)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(15, 23, 42)",
                    border: "1px solid rgb(51, 65, 85)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "rgb(226, 232, 240)" }}
                  cursor={{ fill: "rgba(251, 191, 36, 0.1)" }}
                  formatter={(value) => [`$${value}`, ""]}
                />
                <Bar dataKey="paid" fill="rgb(34, 197, 94)" radius={[8, 8, 0, 0]} name="Paid" />
                <Bar dataKey="pending" fill="rgb(251, 191, 36)" radius={[8, 8, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
            <CardDescription>Distribution of system users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userCounts} layout="vertical">
                <XAxis
                  type="number"
                  stroke="rgb(148, 163, 184)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="role"
                  stroke="rgb(148, 163, 184)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(15, 23, 42)",
                    border: "1px solid rgb(51, 65, 85)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "rgb(226, 232, 240)" }}
                  cursor={{ fill: "rgba(251, 191, 36, 0.1)" }}
                  formatter={(value) => [value, "Count"]}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payout Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payout Summary</CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-muted-foreground">Pending Payouts</span>
                </div>
                <span className="font-semibold text-yellow-500">
                  ${pendingPayouts.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">Paid Payouts</span>
                </div>
                <span className="font-semibold text-green-500">
                  ${paidPayouts.toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-4 flex items-center justify-between">
                <span className="text-sm font-medium">Total Payouts</span>
                <span className="font-bold text-primary text-lg">
                  ${totalPayouts.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Count</span>
                <span className="text-xs text-muted-foreground">
                  {allPayouts.length} payouts
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allLeadOffers.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{lead.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      lead.status === "WON"
                        ? "default"
                        : lead.status === "LOST"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {lead.status}
                  </Badge>
                </div>
              ))}
              {allLeadOffers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No activity yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
