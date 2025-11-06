"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserReputation } from "@/types";

interface ReputationBadgeProps {
  reputation?: UserReputation | null;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

/**
 * Reputation Badge Component
 * Displays a user's average rating with star icon and optional rating count
 */
export function ReputationBadge({ reputation, size = "md", showCount = true }: ReputationBadgeProps) {
  if (!reputation || reputation.totalRatings === 0) {
    return null;
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  // Color based on rating
  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return "bg-green-600 text-white";
    if (rating >= 3.5) return "bg-amber-600 text-white";
    if (rating >= 2.5) return "bg-orange-600 text-white";
    return "bg-red-600 text-white";
  };

  return (
    <Badge className={`${getRatingColor(reputation.averageRating)} ${sizeClasses[size]} gap-1 font-semibold`}>
      <Star size={iconSizes[size]} fill="currentColor" />
      <span>{reputation.averageRating.toFixed(1)}</span>
      {showCount && (
        <span className="opacity-80">
          ({reputation.totalRatings})
        </span>
      )}
    </Badge>
  );
}
