"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

export default function UsersPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t("users.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("users.subtitle")}</p>
        </div>
        <Button className="w-full sm:w-auto">{t("common.create")} {t("users.title")}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("users.allUsers")}</CardTitle>
          <CardDescription>{t("users.listDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">User management coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
