"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/contexts/language-context";
import type { UserRole } from "@/types";

interface RegisterFormProps {
  onToggleToLogin: () => void;
}

/**
 * Register Form Component
 * Provides user registration with name, email, password, role selection
 * Currently uses mock registration - in production, this would call the backend API
 */
export function RegisterForm({ onToggleToLogin }: RegisterFormProps) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole | "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.register.passwordMismatch"));
      return;
    }

    // Validate role selection
    if (!formData.role) {
      setError(t("auth.register.roleRequired"));
      return;
    }

    setIsLoading(true);

    try {
      // Mock registration - in real app, this would call an API to create the user
      // For now, we'll just log them in with the selected role
      // Note: Admin role is intentionally excluded from registration for security.
      // Admin users should be created through a separate administrative process.
      login(formData.role);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch {
      setError(t("auth.register.error"));
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">{t("auth.register.title")}</h2>
        <p className="text-muted-foreground">{t("auth.register.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t("auth.register.name")}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t("auth.register.namePlaceholder")}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.register.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.register.emailPlaceholder")}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.register.password")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("auth.register.passwordPlaceholder")}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("auth.register.confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t("auth.register.confirmPasswordPlaceholder")}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">{t("auth.register.role")}</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
            disabled={isLoading}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder={t("auth.register.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SELLER">{t("auth.register.roleSeller")}</SelectItem>
              <SelectItem value="LEAD_MANAGER">{t("auth.register.roleLeadManager")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("common.loading") : t("auth.register.submit")}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">{t("auth.register.hasAccount")}</span>{" "}
        <button
          type="button"
          onClick={onToggleToLogin}
          className="text-primary hover:underline font-medium"
        >
          {t("auth.register.signIn")}
        </button>
      </div>
    </div>
  );
}
