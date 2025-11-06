import type { UserRole } from "@/types";

/**
 * Role-based dashboard routes
 * Maps each user role to its corresponding dashboard path
 */
export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  SELLER: "/dashboard/seller",
  LEAD_MANAGER: "/dashboard/lead-manager",
  ADMIN: "/dashboard/admin",
};

/**
 * Get the dashboard route for a given user role
 * @param role - The user role
 * @returns The dashboard path for the role
 */
export function getDashboardRoute(role: UserRole): string {
  return ROLE_DASHBOARD_ROUTES[role];
}
