"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/components/providers/auth-provider";
import { useLeadOffersByManager } from "@/hooks/use-lead-offers";
import { usePayoutsByManager } from "@/hooks/use-payouts";
import { Badge } from "@/components/ui/badge";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { RatingsList } from "@/components/ui/ratings-list";
import { useUserRatings, useUserReputation } from "@/hooks/use-ratings";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "@/hooks/use-translation";

// Constants
const MAX_DISPLAYED_RATINGS = 5;

/**
 * LEAD_MANAGER Dashboard Component
 * Shows assigned leads, won ratio, pending actions, and performance metrics
 */
export function LeadManagerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: myLeads = [] } = useLeadOffersByManager(user?.id || "");
  const { data: myPayouts = [] } = usePayoutsByManager(user?.id || "");
  const { data: myReputation } = useUserReputation(user?.id || "");
  const { data: myRatings = [] } = useUserRatings(user?.id || "");

  // Calculate metrics
  const totalLeads = myLeads.length;
  const wonLeads = myLeads.filter(l => l.status === "WON").length;
  const lostLeads = myLeads.filter(l => l.status === "LOST").length;
  const pendingLeads = myLeads.filter(l => l.status === "PENDING").length;
  const wonRatio = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";
  const totalEarnings = myPayouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = myPayouts.filter(p => p.status === "PENDING").length;

  // Generate performance chart data (using translated labels)
  const performanceData = [
    { status: t("dashboard.leadManager.chartStatusWon"), count: wonLeads, fill: "rgb(34, 197, 94)" },
    { status: t("dashboard.leadManager.chartStatusLost"), count: lostLeads, fill: "rgb(239, 68, 68)" },
    { status: t("dashboard.leadManager.chartStatusPending"), count: pendingLeads, fill: "rgb(251, 191, 36)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("dashboard.leadManager.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.leadManager.subtitle")}
        </p>
      </div>

      {/* User Reputation Card - Prominent Display */}
      {myReputation && myReputation.totalRatings > 0 && (
        <Card className="border-primary/50 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {t("dashboard.leadManager.yourReputation")}
              <ReputationBadge reputation={myReputation} variant="detailed" size="lg" />
            </CardTitle>
            <CardDescription>
              {t("dashboard.leadManager.basedOnRatings")
                .replace("{count}", myReputation.totalRatings.toString())
                .replace("{rating}", myReputation.totalRatings === 1 ? t("dashboard.leadManager.rating") : t("dashboard.leadManager.ratings"))}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("dashboard.leadManager.assignedLeads")}
          value={totalLeads}
          description={t("dashboard.leadManager.totalManaged")}
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
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
          }
        />

        <StatCard
          title={t("dashboard.leadManager.wonRatio")}
          value={`${wonRatio}%`}
          description={`${wonLeads} ${t("dashboard.leadManager.wonTotal")}`}
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
          className="border-green-500/50"
        />

        <StatCard
          title={t("dashboard.leadManager.pendingActions")}
          value={pendingLeads}
          description={t("dashboard.leadManager.needQualification")}
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />

        <StatCard
          title={t("dashboard.leadManager.totalEarnings")}
          value={`$${totalEarnings.toFixed(0)}`}
          description={`${pendingPayouts} ${t("dashboard.leadManager.pendingPayouts")}`}
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
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.leadManager.leadPerformance")}</CardTitle>
            <CardDescription>{t("dashboard.leadManager.distributionOfStatuses")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <XAxis
                  dataKey="status"
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(15, 23, 42)",
                    border: "1px solid rgb(51, 65, 85)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "rgb(226, 232, 240)" }}
                  cursor={{ fill: "rgba(251, 191, 36, 0.1)" }}
                  formatter={(value) => [value, t("dashboard.leadManager.count")]}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.leadManager.recentLeads")}</CardTitle>
            <CardDescription>{t("dashboard.leadManager.yourLatestAssignedLeads")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myLeads.slice(0, 5).map((lead) => (
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
              {myLeads.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("dashboard.leadManager.noLeadsAssignedYet")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions Details */}
      {pendingLeads > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.leadManager.pendingActionsTitle")}</CardTitle>
            <CardDescription>{t("dashboard.leadManager.leadsWaitingQualification")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myLeads
                .filter(l => l.status === "PENDING")
                .slice(0, 6)
                .map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{lead.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.customerEmail} • {lead.customerPhone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {t("dashboard.leadManager.assigned")} {new Date(lead.assignedAt || lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payouts Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.leadManager.earningsSummary")}</CardTitle>
          <CardDescription>{t("dashboard.leadManager.yourPayoutBreakdown")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("dashboard.leadManager.pendingPayoutsLabel")}</span>
              <span className="font-semibold text-yellow-500">
                ${myPayouts.filter(p => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("dashboard.leadManager.paidPayouts")}</span>
              <span className="font-semibold text-green-500">
                ${myPayouts.filter(p => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-4 flex items-center justify-between">
              <span className="text-sm font-medium">{t("dashboard.leadManager.totalEarnings")}</span>
              <span className="font-bold text-primary text-lg">
                ${totalEarnings.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings & Reviews Section */}
      {myRatings && myRatings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("dashboard.leadManager.yourRatingsAndReviews")}</span>
              {myReputation && (
                <ReputationBadge reputation={myReputation} size="md" />
              )}
            </CardTitle>
            <CardDescription>
              {t("dashboard.leadManager.feedbackFromSellers")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RatingsList 
              ratings={myRatings.slice(0, MAX_DISPLAYED_RATINGS)} 
              showRaterInfo={true}
              showRatedInfo={false}
            />
            {myRatings.length > MAX_DISPLAYED_RATINGS && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                {t("dashboard.leadManager.showing")} {MAX_DISPLAYED_RATINGS} {t("dashboard.leadManager.of")} {myRatings.length} {t("dashboard.leadManager.ratings")}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
