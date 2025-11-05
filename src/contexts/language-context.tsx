"use client";

import React, { createContext, useContext, useState } from "react";
import enTranslations from "@/i18n/en.json";
import esTranslations from "@/i18n/es.json";

type Language = "en" | "es";

type TranslationKey = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: enTranslations,
  es: esTranslations,
};

/**
 * Language Provider Component
 * Manages language state and provides translation functionality
 * Persists language choice in localStorage
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize language from localStorage (client-side only)
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("leadflow-language") as Language;
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
        return savedLanguage;
      }
    }
    return "es"; // Default to Spanish
  });

  // Set language and persist to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("leadflow-language", lang);
    }
  };

  // Translation function with nested key support (e.g., "common.logout")
  const t = (key: TranslationKey): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value = translations.en as any;
        for (const fk of keys) {
          if (value && typeof value === "object" && fk in value) {
            value = value[fk];
          } else {
            return key; // Return key if not found in fallback
          }
        }
        break;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 * Provides current language, setLanguage function, and translation function
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
