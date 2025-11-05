"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/contexts/language-context";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { UserRole } from "@/types";

/**
 * Main application layout with header, sidebar, and content area
 * Includes responsive mobile navigation using Sheet component
 * Shows login screen when user is not authenticated
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r border-border min-h-[calc(100vh-4rem)] sticky top-16">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="p-6 pb-4">
              <SheetTitle>{t("navigation.menu")}</SheetTitle>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

/**
 * Login screen component for selecting user role
 * Allows switching between SELLER, LEAD_MANAGER, and ADMIN roles
 */
function LoginScreen() {
  const { login } = useAuth();
  const { t } = useLanguage();

  const roles: { role: UserRole; title: string; description: string; color: string }[] = [
    {
      role: "SELLER",
      title: t("login.roles.seller.title"),
      description: t("login.roles.seller.description"),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      role: "LEAD_MANAGER",
      title: t("login.roles.leadManager.title"),
      description: t("login.roles.leadManager.description"),
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      role: "ADMIN",
      title: t("login.roles.admin.title"),
      description: t("login.roles.admin.description"),
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-primary-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold">
            Lead<span className="text-primary">Flow</span>
          </h1>
          <p className="mt-2 text-muted-foreground">{t("login.selectRole")}</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          {roles.map((roleItem) => (
            <button
              key={roleItem.role}
              onClick={() => login(roleItem.role)}
              className="w-full rounded-lg border border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{roleItem.title}</h3>
                  <p className="text-sm text-muted-foreground">{roleItem.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${roleItem.color}`}>
                  {roleItem.role.replace("_", " ")}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {t("login.mockAuthInfo")}
          </p>
        </div>
      </div>
    </div>
  );
}
