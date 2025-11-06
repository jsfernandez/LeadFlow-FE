"use client";

import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Rating } from "@/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dataProvider } from "@/lib/dataProvider";

interface RatingsListProps {
  ratings: Rating[];
  showRaterInfo?: boolean;
  showRatedInfo?: boolean;
  className?: string;
}

/**
 * RatingsList Component
 * Displays a beautiful list of ratings with stars, feedback, and user information
 */
export function RatingsList({ 
  ratings, 
  showRaterInfo = true,
  showRatedInfo = false,
  className 
}: RatingsListProps) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-sm text-muted-foreground">No ratings yet</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {ratings.map((rating) => (
        <RatingCard 
          key={rating.id} 
          rating={rating}
          showRaterInfo={showRaterInfo}
          showRatedInfo={showRatedInfo}
        />
      ))}
    </div>
  );
}

function RatingCard({ 
  rating, 
  showRaterInfo, 
  showRatedInfo 
}: { 
  rating: Rating; 
  showRaterInfo: boolean;
  showRatedInfo: boolean;
}) {
  // Fetch user info if needed
  const { data: rater } = useQuery({
    queryKey: ["user", rating.raterId],
    queryFn: () => dataProvider.getUserById(rating.raterId),
    enabled: showRaterInfo,
  });

  const { data: ratedUser } = useQuery({
    queryKey: ["user", rating.ratedUserId],
    queryFn: () => dataProvider.getUserById(rating.ratedUserId),
    enabled: showRatedInfo,
  });

  const getScoreColor = (score: number): string => {
    if (score >= 4.5) return "text-emerald-500";
    if (score >= 3.5) return "text-amber-500";
    if (score >= 2.5) return "text-orange-500";
    return "text-red-500";
  };

  const getContextLabel = (context: string): { label: string; variant: string } => {
    switch (context) {
      case "PROPOSAL_ACCEPTED":
        return { label: "Accepted Proposal", variant: "bg-green-600 text-white" };
      case "PROPOSAL_REJECTED":
        return { label: "Rejected Proposal", variant: "bg-red-600 text-white" };
      case "LEAD_MANAGER_RATED":
        return { label: "Lead Manager Review", variant: "bg-blue-600 text-white" };
      default:
        return { label: "Review", variant: "bg-gray-600 text-white" };
    }
  };

  const contextInfo = getContextLabel(rating.context);

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary/50 hover:border-l-primary transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Rating Header */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Stars Display */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={cn(
                      "transition-all duration-200",
                      i < rating.score
                        ? cn("fill-current", getScoreColor(rating.score))
                        : "fill-transparent text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              
              {/* Score Number */}
              <span className={cn("font-bold text-lg", getScoreColor(rating.score))}>
                {rating.score.toFixed(1)}
              </span>

              {/* Context Badge */}
              <Badge className={cn(contextInfo.variant, "text-xs")}>
                {contextInfo.label}
              </Badge>
            </div>

            {/* User Info */}
            {(showRaterInfo || showRatedInfo) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User size={14} />
                {showRaterInfo && rater && (
                  <span>
                    <span className="font-medium text-foreground">{rater.name}</span> rated
                  </span>
                )}
                {showRatedInfo && ratedUser && (
                  <span>
                    <span className="font-medium text-foreground">{ratedUser.name}</span>
                  </span>
                )}
                <span className="text-xs">
                  • {new Date(rating.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}

            {/* Feedback Text */}
            {rating.feedback && (
              <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                <p className="text-sm text-foreground/90 italic leading-relaxed">
                  &ldquo;{rating.feedback}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
