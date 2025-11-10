"use client";

import { useQuery } from "@tanstack/react-query";
import { dataProvider } from "@/lib/dataProvider";
import { useTranslation } from "@/hooks/use-translation";

interface LeadInfoProps {
  leadId: string;
  showFullDetails?: boolean;
}

/**
 * Component to fetch and display lead information
 * Used in dashboards to show lead details from LeadOffers
 */
export function LeadInfo({ leadId, showFullDetails = false }: LeadInfoProps) {
  const { t } = useTranslation();
  const { data: lead } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: () => dataProvider.getLeadById(leadId),
    enabled: !!leadId,
  });

  if (!lead) {
    return <span className="text-sm text-muted-foreground">{t("common.loading")}</span>;
  }

  if (showFullDetails) {
    return (
      <div>
        <p className="font-medium text-sm">{lead.fullName}</p>
        <p className="text-xs text-muted-foreground">
          {lead.email} • {lead.phone}
        </p>
      </div>
    );
  }

  return <span className="font-medium text-sm">{lead.fullName}</span>;
}
