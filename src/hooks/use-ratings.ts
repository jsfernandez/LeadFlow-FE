import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "@/lib/dataProvider";
import type { Rating, UserReputation } from "@/types";
import { toast } from "sonner";

/**
 * Hook for fetching ratings for a specific user (ratings they received)
 */
export function useUserRatings(userId: string) {
  return useQuery({
    queryKey: ["ratings", "user", userId],
    queryFn: () => dataProvider.getRatingsByUser(userId),
    enabled: !!userId,
  });
}

/**
 * Hook for fetching ratings given by a specific user
 */
export function useRaterRatings(raterId: string) {
  return useQuery({
    queryKey: ["ratings", "rater", raterId],
    queryFn: () => dataProvider.getRatingsByRater(raterId),
    enabled: !!raterId,
  });
}

/**
 * Hook for fetching user reputation
 */
export function useUserReputation(userId: string) {
  return useQuery({
    queryKey: ["reputation", userId],
    queryFn: () => dataProvider.getUserReputation(userId),
    enabled: !!userId,
  });
}

/**
 * Hook for creating a new rating
 */
export function useCreateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Rating, "id" | "createdAt">) =>
      dataProvider.createRating(data),
    onSuccess: (newRating) => {
      toast.success("Success", {
        description: "Rating submitted successfully",
      });
      
      // Invalidate ratings queries for the rated user
      queryClient.invalidateQueries({ queryKey: ["ratings", "user", newRating.ratedUserId] });
      
      // Invalidate ratings queries for the rater
      queryClient.invalidateQueries({ queryKey: ["ratings", "rater", newRating.raterId] });
      
      // Invalidate reputation for the rated user
      queryClient.invalidateQueries({ queryKey: ["reputation", newRating.ratedUserId] });
      
      // Invalidate user data to update reputation in User object
      queryClient.invalidateQueries({ queryKey: ["users", newRating.ratedUserId] });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to submit rating. Please try again.",
      });
    },
  });
}
