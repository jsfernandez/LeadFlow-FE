"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

export default function UsersPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("users.title")}</h1>
          <p className="text-muted-foreground">{t("users.subtitle")}</p>
        </div>
        <Button>{t("common.create")} {t("users.title")}</Button>
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
