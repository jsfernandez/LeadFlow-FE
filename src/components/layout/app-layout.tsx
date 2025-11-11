"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/contexts/language-context";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";

/**
 * Main application layout with header, sidebar, and content area
 * Includes responsive mobile navigation using Sheet component
 * Redirects unauthenticated users to /landing (public routes bypass this)
 * Authenticated users get the full app layout with sidebar
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Public routes that don't require authentication
  const publicRoutes = ["/landing"];
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Redirect unauthenticated users to landing page
  useEffect(() => {
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/landing");
    }
  }, [isAuthenticated, isPublicRoute, router]);

  // Skip authentication check for public routes - render children directly
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Don't render anything while redirecting
  if (!isAuthenticated) {
    return null;
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
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="p-6 pb-4">
              <SheetTitle>{t("navigation.menu")}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
