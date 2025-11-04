"use client";

import { createContext, useContext, type ReactNode } from "react";

type Theme = "dark";

const ThemeContext = createContext<Theme>("dark");

/**
 * Theme Provider component
 * Provides the dark corporate theme context to the application
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}

/**
 * Hook to access the current theme
 * @returns The current theme value
 */
export function useTheme() {
  const theme = useContext(ThemeContext);
  return theme;
}
