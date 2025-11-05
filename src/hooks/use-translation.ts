import { useLanguage } from "@/contexts/language-context";

/**
 * Convenience hook for accessing translation function
 * Alias for useLanguage().t
 */
export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
