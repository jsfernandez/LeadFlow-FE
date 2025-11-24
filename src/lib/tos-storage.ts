/**
 * TOS (Terms of Service) Storage Utilities
 * Handles storage of TOS acceptance data in localStorage for the pilot phase
 */

import { TOS_VERSION } from "./tos-content";

export interface TosAcceptanceData {
  userId: string;
  acceptedAt: string; // ISO 8601 timestamp
  ipAddress: string; // Best effort client-side IP
  tosVersion: string;
}

/**
 * Get client IP address (best effort)
 * Note: This is a client-side approximation. In production, IP should be captured server-side.
 * For the pilot phase, we record 'client-side' as the IP to avoid external dependencies.
 */
async function getClientIpAddress(): Promise<string> {
  // For pilot phase, we mark it as captured client-side
  // In production, this should be captured server-side during registration API call
  return 'captured-client-side';
}

/**
 * Store TOS acceptance data in localStorage
 * @param userId - The user identifier (email or user ID)
 */
export async function storeTosAcceptance(userId: string): Promise<void> {
  try {
    const ipAddress = await getClientIpAddress();
    
    const acceptanceData: TosAcceptanceData = {
      userId,
      acceptedAt: new Date().toISOString(),
      ipAddress,
      tosVersion: TOS_VERSION,
    };

    const storageKey = `tos_acceptance_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(acceptanceData));
  } catch (error) {
    console.error('Failed to store TOS acceptance:', error);
    // Even if storage fails, we should not block registration
    // but we should log this for monitoring
  }
}

/**
 * Check if user has accepted TOS
 * @param userId - The user identifier (email or user ID)
 */
export function hasTosAcceptance(userId: string): boolean {
  try {
    const storageKey = `tos_acceptance_${userId}`;
    const data = localStorage.getItem(storageKey);
    return data !== null;
  } catch {
    return false;
  }
}

/**
 * Get TOS acceptance data for a user
 * @param userId - The user identifier (email or user ID)
 */
export function getTosAcceptance(userId: string): TosAcceptanceData | null {
  try {
    const storageKey = `tos_acceptance_${userId}`;
    const data = localStorage.getItem(storageKey);
    if (data) {
      return JSON.parse(data) as TosAcceptanceData;
    }
    return null;
  } catch {
    return null;
  }
}
