"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useOffers, useOffersBySeller } from "@/hooks/use-offers";
import { useLeadOffersByManager } from "@/hooks/use-lead-offers";
import { usePayoutsByManager } from "@/hooks/use-payouts";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: allOffers } = useOffers();
  const { data: myOffers } = useOffersBySeller(user?.id || "");
  const { data: myProposals } = useLeadOffersByManager(user?.id || "");
  const { data: myPayouts } = usePayoutsByManager(user?.id || "");

  const isSeller = user?.role === "SELLER";
  const isLeadManager = user?.role === "LEAD_MANAGER";
  const isAdmin = user?.role === "ADMIN";

  // Calculate statistics
  const totalOffers = isSeller ? myOffers?.length || 0 : allOffers?.length || 0;
  const activeProposals = myProposals?.filter((p) => p.status === "PENDING").length || 0;
  const wonLeads = myProposals?.filter((p) => p.status === "WON").length || 0;
  const totalPayouts = myPayouts?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const pendingPayouts = myPayouts?.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="text-foreground font-medium">{user?.name}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Offers Card - Seller shows "My Offers", others show "Total Offers" */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSeller ? "My Offers" : "Total Offers"}
            </CardTitle>
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
              className="text-muted-foreground"
            >
              <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              <rect width="20" height="14" x="2" y="6" rx="2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOffers}</div>
            <p className="text-xs text-muted-foreground">
              {isSeller ? "Created by you" : "Available in system"}
            </p>
          </CardContent>
        </Card>

        {/* Proposals Card - For Lead Managers */}
        {(isLeadManager || isAdmin) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
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
                className="text-muted-foreground"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProposals}</div>
              <p className="text-xs text-muted-foreground">Pending qualification</p>
            </CardContent>
          </Card>
        )}

        {/* Won Leads Card - For Lead Managers */}
        {(isLeadManager || isAdmin) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Leads</CardTitle>
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
                className="text-muted-foreground"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{wonLeads}</div>
              <p className="text-xs text-muted-foreground">Successfully qualified</p>
            </CardContent>
          </Card>
        )}

        {/* Total Payouts Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
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
              className="text-muted-foreground"
            >
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalPayouts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${pendingPayouts.toFixed(2)} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* For Sellers - Recent Offers */}
        {isSeller && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Offers</CardTitle>
              <CardDescription>Your latest created offers</CardDescription>
            </CardHeader>
            <CardContent>
              {myOffers && myOffers.length > 0 ? (
                <div className="space-y-4">
                  {myOffers.slice(0, 3).map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{offer.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary text-sm">
                          ${offer.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">{offer.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No offers created yet</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* For Lead Managers - Recent Proposals */}
        {(isLeadManager || isAdmin) && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Proposals</CardTitle>
              <CardDescription>Your latest submitted proposals</CardDescription>
            </CardHeader>
            <CardContent>
              {myProposals && myProposals.length > 0 ? (
                <div className="space-y-4">
                  {myProposals.slice(0, 3).map((proposal) => (
                    <div key={proposal.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{proposal.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            proposal.status === "WON"
                              ? "bg-green-600 text-white"
                              : proposal.status === "LOST"
                                ? "bg-red-600 text-white"
                                : "bg-yellow-600 text-white"
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No proposals submitted yet</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payouts Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Summary</CardTitle>
            <CardDescription>Your earnings breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {myPayouts && myPayouts.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending Payouts</span>
                  <span className="font-semibold text-yellow-500">
                    ${pendingPayouts.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paid Payouts</span>
                  <span className="font-semibold text-green-500">
                    ${(totalPayouts - pendingPayouts).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Total Earnings</span>
                  <span className="font-bold text-primary text-lg">
                    ${totalPayouts.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No payouts yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
