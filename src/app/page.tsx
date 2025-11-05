"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          {t("home.title")} <span className="text-primary">{t("header.title")}</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("home.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("home.offerManagement.title")}</CardTitle>
            <CardDescription>{t("home.offerManagement.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("home.offerManagement.details")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("home.leadTracking.title")}</CardTitle>
            <CardDescription>{t("home.leadTracking.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("home.leadTracking.details")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("home.payoutSystem.title")}</CardTitle>
            <CardDescription>{t("home.payoutSystem.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("home.payoutSystem.details")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle>{t("home.coreWorkflow.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">{t("home.coreWorkflow.offerCreation")}</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">{t("home.coreWorkflow.proposalSubmission")}</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">{t("home.coreWorkflow.acceptance")}</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">{t("home.coreWorkflow.leadAssignment")}</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">{t("home.coreWorkflow.qualification")}</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">{t("home.coreWorkflow.payout")}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
