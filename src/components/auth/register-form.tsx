"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/contexts/language-context";
import { getDashboardRoute } from "@/lib/routes";
import { isCorporateEmail } from "@/lib/utils";
import { storeTosAcceptance } from "@/lib/tos-storage";
import { TosDialog } from "./tos-dialog";
import type { UserRole } from "@/types";

interface RegisterFormProps {
  onToggleToLogin: () => void;
}

/**
 * Get the saved role from localStorage (client-side only)
 */
function getSavedRole(): UserRole | "" {
  if (typeof window === "undefined") return "";
  const savedRole = localStorage.getItem("registration_role");
  return (savedRole === "SELLER" || savedRole === "LEAD_MANAGER") ? savedRole : "";
}

/**
 * Register Form Component
 * Provides user registration with role-based email validation
 * - SELLER: requires corporate email (rejects free providers)
 * - LEAD_MANAGER: allows any email
 * Role selection is prioritized and shown first
 */
export function RegisterForm({ onToggleToLogin }: RegisterFormProps) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [formData, setFormData] = useState(() => ({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: getSavedRole(),
  }));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [tosDialogOpen, setTosDialogOpen] = useState(false);

  // Save role to localStorage when it changes
  const handleRoleChange = (role: UserRole) => {
    setFormData({ ...formData, role });
    if (typeof window !== "undefined") {
      localStorage.setItem("registration_role", role);
    }
    // Clear email error when role changes
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate role selection
    if (!formData.role) {
      setError(t("auth.register.roleRequired"));
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.register.passwordMismatch"));
      return;
    }

    // Validate corporate email for sellers
    if (formData.role === "SELLER" && !isCorporateEmail(formData.email)) {
      setError(t("auth.register.corporateEmailRequired"));
      return;
    }

    // Validate TOS acceptance
    if (!tosAccepted) {
      setError(t("auth.register.tosRequired"));
      return;
    }

    setIsLoading(true);

    try {
      // Store TOS acceptance data before registration
      // Note: For pilot phase with mock auth, TOS storage errors are logged but don't block registration
      // In production with real backend, TOS acceptance should be stored server-side atomically with user creation
      await storeTosAcceptance(formData.email);
      
      // Mock registration - in real app, this would call an API to create the user
      // For now, we'll just log them in with the selected role
      // Note: Admin role is intentionally excluded from registration for security.
      // Admin users should be created through a separate administrative process.
      login(formData.role);
      
      // Clear saved role from localStorage after successful registration
      if (typeof window !== "undefined") {
        localStorage.removeItem("registration_role");
      }
      
      // Redirect to role-specific dashboard
      router.push(getDashboardRoute(formData.role));
    } catch {
      setError(t("auth.register.error"));
      setIsLoading(false);
    }
  };

  const isSeller = formData.role === "SELLER";

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">{t("auth.register.title")}</h2>
        <p className="text-muted-foreground">{t("auth.register.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection - Prioritized at the top */}
        <div className="space-y-2">
          <Label htmlFor="role" className="text-base font-semibold">
            {t("auth.register.role")} <span className="text-destructive" aria-label="required">*</span>
          </Label>
          <Select
            value={formData.role}
            onValueChange={handleRoleChange}
            disabled={isLoading}
            required
          >
            <SelectTrigger id="role" className="h-11" aria-required="true">
              <SelectValue placeholder={t("auth.register.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SELLER">{t("auth.register.roleSeller")}</SelectItem>
              <SelectItem value="LEAD_MANAGER">{t("auth.register.roleLeadManager")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Name Field */}
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

        {/* Email Field - Changes based on role */}
        <div className="space-y-2">
          <Label htmlFor="email">
            {isSeller ? t("auth.register.corporateEmail") : t("auth.register.email")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={
              isSeller 
                ? t("auth.register.corporateEmailPlaceholder") 
                : t("auth.register.emailPlaceholder")
            }
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
          />
          {isSeller && (
            <p className="text-xs text-muted-foreground">
              {t("auth.register.corporateEmailHint")}
            </p>
          )}
        </div>

        {/* Password Field */}
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

        {/* Confirm Password Field */}
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

        {/* Terms of Service Acceptance */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="tos"
              checked={tosAccepted}
              onCheckedChange={(checked) => setTosAccepted(checked === true)}
              disabled={isLoading}
              aria-required="true"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="tos"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {t("auth.register.tosAcceptance")}{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setTosDialogOpen(true);
                  }}
                  className="text-primary hover:underline font-semibold"
                  disabled={isLoading}
                >
                  {t("auth.register.tosLink")}
                </button>
                <span className="text-destructive" aria-label="required"> *</span>
              </label>
            </div>
          </div>
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

      {/* TOS Dialog */}
      <TosDialog open={tosDialogOpen} onOpenChange={setTosDialogOpen} />

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
