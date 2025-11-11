"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { useLeadOffersByManager } from "@/hooks/use-lead-offers";
import { useAuth } from "@/components/providers/auth-provider";
import type { LeadStatus } from "@/types";
import { dataProvider } from "@/lib/dataProvider";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";

export default function ProposalsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: proposals, isLoading: proposalsLoading, error } = useLeadOffersByManager(user?.id || "");

  const getStatusBadge = (status: LeadStatus) => {
    const variants: Record<LeadStatus, string> = {
      PENDING: "bg-yellow-600 text-white",
      WON: "bg-green-600 text-white",
      LOST: "bg-red-600 text-white",
    };

    const statusTranslationKey = status.toLowerCase();
    return <Badge className={variants[status]}>{t(`common.${statusTranslationKey}`)}</Badge>;
  };

  // Component to display offer with seller reputation
  // NOTE: This creates an N+1 query pattern. For optimization in production,
  // consider prefetching offer and seller data at the parent level or implementing
  // data aggregation in the API.
  const OfferCell = ({ offerId }: { offerId: string }) => {
    const { data: offer } = useQuery({
      queryKey: ["offer", offerId],
      queryFn: () => dataProvider.getOfferById(offerId),
      enabled: !!offerId,
    });

    const { data: seller } = useQuery({
      queryKey: ["user", offer?.sellerId],
      queryFn: () => offer?.sellerId ? dataProvider.getUserById(offer.sellerId) : null,
      enabled: !!offer?.sellerId,
    });

    if (!offer) {
      return <span className="text-sm text-muted-foreground">{t("proposals.loading")}</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{offer.title}</span>
        {seller?.reputation && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{seller.name}</span>
            <ReputationBadge reputation={seller.reputation} size="sm" />
          </div>
        )}
      </div>
    );
  };

  // Helper component to fetch and display lead data
  const LeadCell = ({ leadId }: { leadId: string }) => {
    const { data: lead } = useQuery({
      queryKey: ["lead", leadId],
      queryFn: () => dataProvider.getLeadById(leadId),
      enabled: !!leadId,
    });

    if (!lead) {
      return <span className="text-sm text-muted-foreground">{t("proposals.loading")}</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{lead.fullName}</span>
        <span className="text-xs text-muted-foreground">{lead.companyName}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t("proposals.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("proposals.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("proposals.yourProposals")}</CardTitle>
          <CardDescription>{t("proposals.allSubmitted")}</CardDescription>
        </CardHeader>
        <CardContent>
          {proposalsLoading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">{t("proposals.failedToLoad")}</p>
            </div>
          ) : proposals && proposals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">{t("proposals.lead")}</TableHead>
                    <TableHead className="min-w-[150px]">{t("proposals.offerCompany")}</TableHead>
                    <TableHead className="min-w-[100px]">{t("proposals.status")}</TableHead>
                    <TableHead className="min-w-[120px]">{t("proposals.submitted")}</TableHead>
                    <TableHead className="min-w-[120px]">{t("proposals.qualified")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell>
                        <LeadCell leadId={proposal.leadId} />
                      </TableCell>
                      <TableCell>
                        <OfferCell offerId={proposal.offerId} />
                      </TableCell>
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(proposal.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {proposal.qualifiedAt
                          ? new Date(proposal.qualifiedAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Clipboard}
              title={t("proposals.noProposalsYet")}
              description={t("proposals.noneSubmitted")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
