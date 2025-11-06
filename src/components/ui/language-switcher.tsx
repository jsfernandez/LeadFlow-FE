"use client";

import { useLanguage } from "@/contexts/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Language Switcher Component
 * Allows users to switch between available languages (English and Spanish)
 * Syncs language preference with backend and persists in localStorage
 */
export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "es")}>
      <SelectTrigger className="w-[140px]" aria-label={t("language.select")}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span>{language === "en" ? t("language.english") : t("language.spanish")}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="es">
          <div className="flex items-center gap-2">
            <span>🇪🇸</span>
            <span>{t("language.spanish")}</span>
          </div>
        </SelectItem>
        <SelectItem value="en">
          <div className="flex items-center gap-2">
            <span>🇺🇸</span>
            <span>{t("language.english")}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
