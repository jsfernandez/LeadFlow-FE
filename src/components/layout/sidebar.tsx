"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface NavItem {
  titleKey: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    titleKey: "navigation.dashboard",
    href: "/dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
    roles: ["SELLER", "LEAD_MANAGER", "ADMIN"],
  },
  {
    titleKey: "navigation.offers",
    href: "/offers",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </svg>
    ),
    roles: ["SELLER", "LEAD_MANAGER", "ADMIN"],
  },
  {
    titleKey: "navigation.myOffers",
    href: "/my-offers",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
    ),
    roles: ["SELLER"],
  },
  {
    titleKey: "navigation.proposals",
    href: "/proposals",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
    ),
    roles: ["LEAD_MANAGER", "ADMIN"],
  },
  {
    titleKey: "navigation.assignments",
    href: "/assignments",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" x2="19" y1="8" y2="14" />
        <line x1="22" x2="16" y1="11" y2="11" />
      </svg>
    ),
    roles: ["LEAD_MANAGER", "ADMIN"],
  },
  {
    titleKey: "navigation.payouts",
    href: "/payouts",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    roles: ["LEAD_MANAGER", "SELLER", "ADMIN"],
  },
  {
    titleKey: "navigation.users",
    href: "/users",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    roles: ["ADMIN"],
  },
];

/**
 * Sidebar navigation component with role-based menu items
 * Filters navigation items based on the current user's role
 */
export function Sidebar({ className }: { className?: string }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const { t } = useTranslation();

  if (!user) return null;

  // Filter nav items based on user role
  const allowedNavItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside className={cn("flex flex-col gap-4 pb-12", className)}>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{t("navigation.title")}</h2>
        <Separator className="mb-4" />
        <div className="space-y-1">
          {allowedNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon}
                {t(item.titleKey)}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-3 py-2 mt-auto">
        <Separator className="mb-4" />
        <div className="px-4 py-2">
          <p className="text-xs text-muted-foreground">
            {t("navigation.loggedInAs")} <span className="font-medium text-foreground">{user.role.replace("_", " ")}</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
