"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/components/providers/auth-provider";
import { useLeadOffersByManager } from "@/hooks/use-lead-offers";
import { usePayoutsByManager } from "@/hooks/use-payouts";
import { usePaymentsByLeadManager } from "@/hooks/use-payments";
import { calculatePaymentSummary } from "@/lib/payment-utils";
import { useOffers } from "@/hooks/use-offers";
import { Badge } from "@/components/ui/badge";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { RatingsList } from "@/components/ui/ratings-list";
import { useUserRatings, useUserReputation } from "@/hooks/use-ratings";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "@/hooks/use-translation";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadInfo } from "./lead-info";
import { formatCurrencyCLP } from "@/lib/utils";
// Constants
const RATINGS_PER_PAGE = 5;

/**
 * LEAD_MANAGER Dashboard Component
 * Shows assigned leads, won ratio, pending actions, and performance metrics
 */
export function LeadManagerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: myLeads = [] } = useLeadOffersByManager(user?.id || "");
  const { data: myPayouts = [] } = usePayoutsByManager(user?.id || "");
  const { data: myPayments = [] } = usePaymentsByLeadManager(user?.id || "");
  const { data: myReputation } = useUserReputation(user?.id || "");
  const { data: myRatings = [] } = useUserRatings(user?.id || "");
  const { data: allOffers = [] } = useOffers();
  
  // Calculate payment summary
  const paymentSummary = calculatePaymentSummary(myPayments);

  // State for ratings filters and pagination
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [contextFilter, setContextFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(0);

  // Create a map of offerId -> Offer for quick lookup
  const offersMap = useMemo(() => {
    const map = new Map();
    allOffers.forEach(offer => map.set(offer.id, offer));
    return map;
  }, [allOffers]);

  // Calculate metrics
  const totalLeads = myLeads.length;
  const wonLeads = myLeads.filter(l => l.status === "WON").length;
  const lostLeads = myLeads.filter(l => l.status === "LOST").length;
  const pendingLeads = myLeads.filter(l => l.status === "PENDING").length;
  const wonRatio = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";
  const totalEarnings = myPayouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = myPayouts.filter(p => p.status === "PENDING").length;

  // Filter and sort ratings
  const filteredAndSortedRatings = useMemo(() => {
    let filtered = [...myRatings];

    // Filter by score
    if (scoreFilter !== "all") {
      const score = parseInt(scoreFilter);
      filtered = filtered.filter(r => r.score === score);
    }

    // Filter by context
    if (contextFilter !== "all") {
      filtered = filtered.filter(r => r.context === contextFilter);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [myRatings, scoreFilter, contextFilter, sortOrder]);

  // Paginate ratings
  const totalPages = Math.ceil(filteredAndSortedRatings.length / RATINGS_PER_PAGE);
  
  // Auto-adjust current page if it exceeds available pages
  const validCurrentPage = Math.min(currentPage, Math.max(0, totalPages - 1));
  
  const paginatedRatings = filteredAndSortedRatings.slice(
    validCurrentPage * RATINGS_PER_PAGE,
    (validCurrentPage + 1) * RATINGS_PER_PAGE
  );

  // Reset to first page when filters change (only if needed)
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(0);
    }
  }, [currentPage, totalPages]);



  // Generate performance chart data (using translated labels)
  const performanceData = [
    { status: t("dashboard.leadManager.chartStatusWon"), count: wonLeads, fill: "rgb(34, 197, 94)" },
    { status: t("dashboard.leadManager.chartStatusLost"), count: lostLeads, fill: "rgb(239, 68, 68)" },
    { status: t("dashboard.leadManager.chartStatusPending"), count: pendingLeads, fill: "rgb(251, 191, 36)" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t("dashboard.leadManager.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
          value={formatCurrencyCLP(totalEarnings)}
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

      {/* Payments Awaiting Summary */}
      {paymentSummary.total > 0 && (
        <Card className="border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              {t("payments.paymentsAwaitingFromSellers")}
            </CardTitle>
            <CardDescription>{t("payments.owedToMe")}</CardDescription>
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
              <div>
                <p className="text-sm text-muted-foreground">{t("common.paid")}</p>
                <p className="text-2xl font-bold text-green-500">{paymentSummary.paid}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrencyCLP(paymentSummary.paidAmount)}
                </p>
              </div>
              {paymentSummary.overdue > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    {t("payments.overduePayments")}
                  </p>
                  <p className="text-2xl font-bold text-orange-500">{paymentSummary.overdue}</p>
                  <p className="text-xs text-orange-400 mt-1">{t("payments.duesSoon")}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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

        {/* Recent Offers */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.leadManager.recentOffers")}</CardTitle>
            <CardDescription>{t("dashboard.leadManager.yourLatestAssignedOffers")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myLeads.slice(0, 5).map((lead) => {
                const offer = offersMap.get(lead.offerId);
                return (
                  <div key={lead.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{offer?.title || t("common.unknownOffer")}</p>
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
                      {t(`common.${lead.status.toLowerCase()}`)}
                    </Badge>
                  </div>
                );
              })}
              {myLeads.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("dashboard.leadManager.noOffersAssignedYet")}
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
                      <LeadInfo leadId={lead.leadId} showFullDetails={true} />
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
                {formatCurrencyCLP(myPayouts.filter(p => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("dashboard.leadManager.paidPayouts")}</span>
              <span className="font-semibold text-green-500">
                {formatCurrencyCLP(myPayouts.filter(p => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0))}
              </span>
            </div>
            <div className="border-t pt-4 flex items-center justify-between">
              <span className="text-sm font-medium">{t("dashboard.leadManager.totalEarnings")}</span>
              <span className="font-bold text-primary text-lg">
                {formatCurrencyCLP(totalEarnings)}
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
            {/* Filters and Sorting */}
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t("dashboard.leadManager.filterByScore")}
                </label>
                <Select value={scoreFilter} onValueChange={setScoreFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("dashboard.leadManager.allScores")}</SelectItem>
                    <SelectItem value="5">5 {t("ratings.stars")}</SelectItem>
                    <SelectItem value="4">4 {t("ratings.stars")}</SelectItem>
                    <SelectItem value="3">3 {t("ratings.stars")}</SelectItem>
                    <SelectItem value="2">2 {t("ratings.stars")}</SelectItem>
                    <SelectItem value="1">1 {t("ratings.star")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t("dashboard.leadManager.filterByContext")}
                </label>
                <Select value={contextFilter} onValueChange={setContextFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("dashboard.leadManager.allContexts")}</SelectItem>
                    <SelectItem value="PROPOSAL_ACCEPTED">{t("ratings.contextAcceptedProposal")}</SelectItem>
                    <SelectItem value="PROPOSAL_REJECTED">{t("ratings.contextRejectedProposal")}</SelectItem>
                    <SelectItem value="LEAD_MANAGER_RATED">{t("ratings.contextLeadManagerRated")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t("dashboard.leadManager.sortBy")}
                </label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t("dashboard.leadManager.sortNewest")}</SelectItem>
                    <SelectItem value="oldest">{t("dashboard.leadManager.sortOldest")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Carousel Container */}
            {filteredAndSortedRatings.length > 0 ? (
              <>
                <div className="relative">
                  <RatingsList 
                    ratings={paginatedRatings} 
                    showRaterInfo={true}
                    showRatedInfo={false}
                  />
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={validCurrentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      {t("common.previous") || "Previous"}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`h-2 w-2 rounded-full transition-all ${
                            i === validCurrentPage 
                              ? "bg-primary w-6" 
                              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                          }`}
                          aria-label={`Go to page ${i + 1}`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={validCurrentPage === totalPages - 1}
                    >
                      {t("common.next") || "Next"}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}

                <p className="text-sm text-muted-foreground text-center mt-4">
                  {t("dashboard.leadManager.showing")} {paginatedRatings.length} {t("dashboard.leadManager.of")} {filteredAndSortedRatings.length} {t("dashboard.leadManager.ratings")}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t("ratings.noRatingsYet")}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
