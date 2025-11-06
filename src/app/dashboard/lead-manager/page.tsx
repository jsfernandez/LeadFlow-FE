"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { LeadManagerDashboard } from "@/components/dashboard/lead-manager-dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Lead Manager Dashboard Page
 * Restricted to users with LEAD_MANAGER role
 */
export default function LeadManagerDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not a lead manager
    if (user && user.role !== "LEAD_MANAGER") {
      const rolePath = user.role === "SELLER" ? "/dashboard/seller" : "/dashboard/admin";
      router.replace(rolePath);
    }
  }, [user, router]);

  if (!user || user.role !== "LEAD_MANAGER") {
    return null;
  }

  return <LeadManagerDashboard />;
}
