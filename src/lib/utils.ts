import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper handling of conflicts
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * List of common free email providers that should be rejected for corporate emails
 */
const FREE_EMAIL_PROVIDERS = [
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "ymail.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "mail.com",
  "zoho.com"
];

/**
 * Validates if an email is a corporate email (not a free provider)
 * @param email - Email address to validate
 * @returns true if email is corporate, false if it's a free provider
 */
export function isCorporateEmail(email: string): boolean {
  if (!email || !email.includes("@")) {
    return false;
  }

  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) {
    return false;
  }

  return !FREE_EMAIL_PROVIDERS.includes(domain);
}
