import { useQuery } from "@tanstack/react-query";

/**
 * Example hook for fetching offers
 * This will be replaced with actual API calls
 */
export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      // Placeholder - will be replaced with actual API call
      return [];
    },
  });
}
