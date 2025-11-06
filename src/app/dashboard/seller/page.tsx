"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { SellerDashboard } from "@/components/dashboard/seller-dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Seller Dashboard Page
 * Restricted to users with SELLER role
 */
export default function SellerDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not a seller
    if (user && user.role !== "SELLER") {
      const rolePath = user.role === "LEAD_MANAGER" ? "/dashboard/lead-manager" : "/dashboard/admin";
      router.replace(rolePath);
    }
  }, [user, router]);

  if (!user || user.role !== "SELLER") {
    return null;
  }

  return <SellerDashboard />;
}
