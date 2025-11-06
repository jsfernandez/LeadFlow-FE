"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserReputation } from "@/types";
import { cn } from "@/lib/utils";

interface ReputationBadgeProps {
  reputation?: UserReputation | null;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  variant?: "default" | "detailed";
}

/**
 * Enhanced Reputation Badge Component
 * Displays a user's average rating with beautiful star icons and optional rating count
 * Supports multiple sizes and visual variants
 */
export function ReputationBadge({ 
  reputation, 
  size = "md", 
  showCount = true,
  variant = "default"
}: ReputationBadgeProps) {
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

  // Muted gradient colors based on rating - less bright, more subtle
  const getRatingStyle = (rating: number): { gradient: string; shadow: string; text: string } => {
    if (rating >= 4.5) {
      return {
        gradient: "bg-gradient-to-r from-emerald-700 to-emerald-800",
        shadow: "shadow-md shadow-emerald-900/20",
        text: "text-emerald-100"
      };
    }
    if (rating >= 3.5) {
      return {
        gradient: "bg-gradient-to-r from-amber-600 to-amber-700",
        shadow: "shadow-md shadow-amber-900/20",
        text: "text-amber-100"
      };
    }
    if (rating >= 2.5) {
      return {
        gradient: "bg-gradient-to-r from-orange-600 to-orange-700",
        shadow: "shadow-md shadow-orange-900/20",
        text: "text-orange-100"
      };
    }
    return {
      gradient: "bg-gradient-to-r from-red-700 to-red-800",
      shadow: "shadow-md shadow-red-900/20",
      text: "text-red-100"
    };
  };

  const style = getRatingStyle(reputation.averageRating);

  if (variant === "detailed") {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
        style.gradient,
        style.shadow,
        "transition-all duration-300 hover:scale-105"
      )}>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={iconSizes[size]}
              className={cn(
                "transition-all duration-200",
                i < Math.floor(reputation.averageRating)
                  ? "fill-white text-white"
                  : i < reputation.averageRating
                  ? "fill-white/50 text-white/50"
                  : "fill-transparent text-white/30"
              )}
            />
          ))}
        </div>
        <div className="flex flex-col items-start">
          <span className={cn("font-bold", style.text)}>
            {reputation.averageRating.toFixed(1)}
          </span>
          {showCount && (
            <span className={cn("text-xs opacity-90", style.text)}>
              {reputation.totalRatings} {reputation.totalRatings === 1 ? "review" : "reviews"}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Badge className={cn(
      style.gradient,
      style.shadow,
      sizeClasses[size],
      "gap-1 font-semibold border-0 transition-all duration-300 hover:scale-105"
    )}>
      <Star 
        size={iconSizes[size]} 
        fill="currentColor" 
        className="animate-pulse-subtle"
      />
      <span className={style.text}>{reputation.averageRating.toFixed(1)}</span>
      {showCount && (
        <span className={cn("opacity-90", style.text)}>
          ({reputation.totalRatings})
        </span>
      )}
    </Badge>
  );
}
