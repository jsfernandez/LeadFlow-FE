"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Admin Dashboard Page
 * Restricted to users with ADMIN role
 * Note: Admin role is not exposed in public registration UI for security reasons
 */
export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not an admin
    if (user && user.role !== "ADMIN") {
      const rolePath = user.role === "SELLER" ? "/dashboard/seller" : "/dashboard/lead-manager";
      router.replace(rolePath);
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return <AdminDashboard />;
}
