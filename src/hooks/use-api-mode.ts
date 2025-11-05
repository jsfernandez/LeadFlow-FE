/**
 * API Mode Hook
 * 
 * Reads NEXT_PUBLIC_API_MODE to determine whether to use mock or real data provider.
 * Defaults to "mock" mode for local testing without backend.
 */

export type ApiMode = "mock" | "real";

/**
 * Get the current API mode from environment variable
 * @returns "mock" or "real" based on NEXT_PUBLIC_API_MODE
 */
export function useApiMode(): ApiMode {
  const mode = process.env.NEXT_PUBLIC_API_MODE as ApiMode;
  
  // Default to mock mode if not specified or invalid
  if (mode !== "mock" && mode !== "real") {
    return "mock";
  }
  
  return mode;
}

/**
 * Check if currently in mock mode
 */
export function useMockMode(): boolean {
  return useApiMode() === "mock";
}

/**
 * Check if currently in real mode
 */
export function useRealMode(): boolean {
  return useApiMode() === "real";
}
