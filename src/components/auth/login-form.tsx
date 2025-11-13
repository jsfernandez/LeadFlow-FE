"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/contexts/language-context";
import { getDashboardRoute } from "@/lib/routes";
import type { UserRole } from "@/types";

interface LoginFormProps {
  onToggleToRegister: () => void;
}

/**
 * Login Form Component
 * Provides email/password authentication
 * Currently uses mock authentication with predefined users
 */
export function LoginForm({ onToggleToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Mock authentication - map emails to roles
      const emailToRole: Record<string, UserRole> = {
        "seller@leadmanager.com": "SELLER",
        "manager@leadmanager.com": "LEAD_MANAGER",
      };

      const role = emailToRole[email.toLowerCase()];
      
      if (!role || !password.trim()) {
        setError(t("auth.login.error"));
        setIsLoading(false);
        return;
      }

      // Mock login - in real app, this would call an API
      login(role);
      
      // Redirect to role-specific dashboard
      router.push(getDashboardRoute(role));
    } catch {
      setError(t("auth.login.error"));
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">{t("auth.login.title")}</h2>
        <p className="text-muted-foreground">{t("auth.login.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.login.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.login.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.login.password")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("auth.login.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("common.loading") : t("auth.login.submit")}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">{t("auth.login.noAccount")}</span>{" "}
        <button
          type="button"
          onClick={onToggleToRegister}
          className="text-primary hover:underline font-medium"
        >
          {t("auth.login.signUp")}
        </button>
      </div>

      {/* Development hint */}
      <div className="mt-8 p-4 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <p className="font-semibold mb-2">Development Mode:</p>
        <p className="mb-1">Seller: seller@leadmanager.com</p>
        <p className="mb-1">Manager: manager@leadmanager.com</p>
        <p>Admin: admin@leadmanager.com</p>
        <p className="mt-2 italic">Any password will work</p>
      </div>
    </div>
  );
}
