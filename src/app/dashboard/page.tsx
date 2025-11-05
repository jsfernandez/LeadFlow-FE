"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { SellerDashboard } from "@/components/dashboard/seller-dashboard";
import { LeadManagerDashboard } from "@/components/dashboard/lead-manager-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

/**
 * Main Dashboard Page
 * Routes to role-specific dashboard based on user role
 */
export default function DashboardPage() {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  if (user?.role === "SELLER") {
    return <SellerDashboard />;
  }

  if (user?.role === "LEAD_MANAGER") {
    return <LeadManagerDashboard />;
  }

  if (user?.role === "ADMIN") {
    return <AdminDashboard />;
  }

  // Fallback - shouldn't reach here if auth is working
  return null;
}
