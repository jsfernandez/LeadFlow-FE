"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDashboardRoute } from "@/lib/routes";

/**
 * Main Dashboard Page
 * Redirects to role-specific dashboard based on user role
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Redirect to role-specific dashboard
      const targetRoute = getDashboardRoute(user.role);
      router.replace(targetRoute);
    }
  }, [user, router]);

  // Show nothing while redirecting
  return null;
}
