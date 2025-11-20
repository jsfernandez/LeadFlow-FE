"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { useOffersBySeller } from "@/hooks/use-offers";
import { useLeadOffers } from "@/hooks/use-lead-offers";
import { Badge } from "@/components/ui/badge";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { RatingsList } from "@/components/ui/ratings-list";
import { useUserRatings, useUserReputation } from "@/hooks/use-ratings";
import { usePaymentsBySeller } from "@/hooks/use-payments";
import { calculatePaymentSummary } from "@/lib/payment-utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LeadInfo } from "./lead-info";
import { formatCurrencyCLP } from "@/lib/utils";
import { AlertCircle, Clock } from "lucide-react";

// Constants
const MAX_DISPLAYED_RATINGS = 5;

/**
 * SELLER Dashboard Component
 * Shows active offers, proposals received, conversion KPIs, and revenue trends
 */
export function SellerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: myOffers = [] } = useOffersBySeller(user?.id || "");
  const { data: allLeadOffers = [] } = useLeadOffers();
  const { data: myReputation } = useUserReputation(user?.id || "");
  const { data: myRatings = [] } = useUserRatings(user?.id || "");
  const { data: myPayments = [] } = usePaymentsBySeller(user?.id || "");

  // Filter proposals related to seller's offers
  const myOfferIds = myOffers.map(offer => offer.id);
  const proposalsForMyOffers = allLeadOffers.filter(lo => myOfferIds.includes(lo.offerId));
  
  // Calculate payment summary
  const paymentSummary = calculatePaymentSummary(myPayments);
  
  // Calculate metrics
  const activeOffers = myOffers.filter(o => o.status === "ACTIVE").length;
  const totalProposals = proposalsForMyOffers.length;
  const wonProposals = proposalsForMyOffers.filter(p => p.status === "WON").length;
  const conversionRate = totalProposals > 0 ? ((wonProposals / totalProposals) * 100).toFixed(1) : "0.0";
  
  // Calculate total revenue from won proposals by matching actual offer prices
  const totalRevenue = proposalsForMyOffers
    .filter(p => p.status === "WON")
    .reduce((sum, proposal) => {
      const offer = myOffers.find(o => o.id === proposal.offerId);
      return sum + (offer?.price || 0);
    }, 0);

  // Generate revenue chart data (last 30 days)
  const generateRevenueData = () => {
    const data = [];
    const now = new Date();
    
    // Group won proposals by date
    const revenueByDate = new Map<string, number>();
    proposalsForMyOffers
      .filter(p => p.status === "WON" && p.qualifiedAt)
      .forEach(p => {
        const offer = myOffers.find(o => o.id === p.offerId);
        if (offer && p.qualifiedAt) {
          const dateKey = p.qualifiedAt.toISOString().split('T')[0];
          revenueByDate.set(dateKey, (revenueByDate.get(dateKey) || 0) + offer.price);
        }
      });

    // Generate data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      data.push({
        date: dayName,
        revenue: revenueByDate.get(dateKey) || 0,
      });
    }
    
    return data;
  };

  const revenueData = generateRevenueData();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t("dashboard.seller.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("dashboard.seller.subtitle")}
        </p>
      </div>

      {/* User Reputation Card - Prominent Display */}
      {myReputation && myReputation.totalRatings > 0 && (
        <Card className="border-primary/50 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {t("dashboard.seller.yourReputation")}
              <ReputationBadge reputation={myReputation} variant="detailed" size="lg" />
            </CardTitle>
            <CardDescription>
              {t("dashboard.seller.basedOnRatingsFrom")
                .replace("{count}", String(myReputation.totalRatings))
                .replace("{rating}", myReputation.totalRatings === 1 ? t("dashboard.seller.rating") : t("dashboard.seller.ratings"))}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("dashboard.seller.activeOffers")}
          value={activeOffers}
          description={t("dashboard.seller.currentlyAvailable")}
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
          title={t("dashboard.seller.proposalsReceived")}
          value={totalProposals}
          description={t("dashboard.seller.totalSubmissions")}
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
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
        />

        <StatCard
          title={t("dashboard.seller.conversionRate")}
          value={`${conversionRate}%`}
          description={`${wonProposals} ${t("dashboard.seller.wonTotal")} ${totalProposals}`}
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          }
        />

        <StatCard
          title={t("dashboard.seller.estimatedRevenue")}
          value={formatCurrencyCLP(totalRevenue)}
          description={t("dashboard.seller.fromWonProposals")}
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

      {/* Payment Obligations Summary */}
      {paymentSummary.total > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              {t("payments.paymentObligations")}
            </CardTitle>
            <CardDescription>{t("payments.iMustPay")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">{t("payments.pendingPayments")}</p>
                <p className="text-2xl font-bold text-yellow-500">{paymentSummary.pending}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrencyCLP(paymentSummary.pendingAmount)}
                </p>
              </div>
              {paymentSummary.overdue > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    {t("payments.overduePayments")}
                  </p>
                  <p className="text-2xl font-bold text-red-500">{paymentSummary.overdue}</p>
                  <p className="text-xs text-red-400 mt-1">{t("payments.duesSoon")}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">{t("payments.upcomingPayments")}</p>
                <p className="text-2xl font-bold text-orange-500">{paymentSummary.upcoming}</p>
                <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.seller.revenueTrend")}</CardTitle>
            <CardDescription>{t("dashboard.seller.revenueChartDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(251, 191, 36)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(251, 191, 36)" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  itemStyle={{ color: "rgb(251, 191, 36)" }}
                  formatter={(value) => [formatCurrencyCLP(Number(value)), t("dashboard.seller.revenue")]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="rgb(251, 191, 36)"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Offers */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.seller.recentOffers")}</CardTitle>
            <CardDescription>{t("dashboard.seller.latestCreatedOffers")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myOffers.slice(0, 5).map((offer) => (
                <div key={offer.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{offer.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-primary text-sm">
                        {formatCurrencyCLP(offer.price)}
                      </p>
                    </div>
                    <Badge variant={offer.status === "ACTIVE" ? "default" : "secondary"}>
                      {offer.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {myOffers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("dashboard.seller.noOffersCreated")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.seller.proposalsSummary")}</CardTitle>
          <CardDescription>{t("dashboard.seller.recentProposalsForOffers")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {proposalsForMyOffers.slice(0, 6).map((proposal) => {
              const offer = myOffers.find(o => o.id === proposal.offerId);
              return (
                <div key={proposal.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div className="flex-1">
                    <LeadInfo leadId={proposal.leadId} />
                    <p className="text-xs text-muted-foreground">
                      {offer?.title} • {new Date(proposal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      proposal.status === "WON"
                        ? "default"
                        : proposal.status === "LOST"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {proposal.status}
                  </Badge>
                </div>
              );
            })}
            {proposalsForMyOffers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("dashboard.seller.noProposalsReceived")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ratings & Reviews Section */}
      {myRatings && myRatings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("dashboard.seller.yourRatingsAndReviews")}</span>
              {myReputation && (
                <ReputationBadge reputation={myReputation} size="md" />
              )}
            </CardTitle>
            <CardDescription>
              {t("dashboard.seller.feedbackFromLeadManagers")}
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
                {t("dashboard.seller.showingOf")
                  .replace("{current}", String(MAX_DISPLAYED_RATINGS))
                  .replace("{total}", String(myRatings.length))}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
