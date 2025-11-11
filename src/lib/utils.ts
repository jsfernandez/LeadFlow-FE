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

  const domain = email.trim().split("@")[1]?.toLowerCase();
  if (!domain) {
    return false;
  }

  return !FREE_EMAIL_PROVIDERS.includes(domain);
}

/**
 * Default currency for the application
 */
export const CURRENCY_DEFAULT = "CLP";

/**
 * Formats a number as CLP currency with thousands separator (dots)
 * @param amount - The amount to format
 * @param currency - The currency code (defaults to CLP)
 * @returns Formatted currency string (e.g., "$1.250.000 CLP")
 */
export function formatCurrencyCLP(amount: number, currency: string = CURRENCY_DEFAULT): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number with thousands separator for display in input fields
 * Uses dot (.) as thousands separator for Chilean format
 * @param value - The number or string to format
 * @returns Formatted string with thousands separators (e.g., "1.234.567")
 */
export function formatThousands(value: number | string): string {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return "";
  }
  
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

/**
 * Parses a formatted string with thousands separators to a clean number
 * Removes dots (thousands separators) and converts to number
 * @param formattedValue - The formatted string (e.g., "1.234.567")
 * @returns Clean number (e.g., 1234567)
 */
export function parseThousands(formattedValue: string): number {
  if (!formattedValue || formattedValue === "") {
    return 0;
  }
  
  // Remove all dots (thousands separators)
  const cleanValue = formattedValue.replace(/\./g, "");
  const parsed = parseFloat(cleanValue);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validates if a string is a valid monetary input
 * Only allows numbers and dots (no commas, letters, or other characters)
 * @param value - The string to validate
 * @returns true if valid, false otherwise
 */
export function isValidMoneyInput(value: string): boolean {
  if (!value || value === "") {
    return true; // Empty is valid
  }
  
  // Only allow numbers and dots
  const moneyRegex = /^[0-9.]*$/;
  return moneyRegex.test(value);
}
