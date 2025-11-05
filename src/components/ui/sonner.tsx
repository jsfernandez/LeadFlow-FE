"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toast notification component using Sonner
 * Styled to match the dark corporate theme
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-900 group-[.toaster]:text-slate-200 group-[.toaster]:border-slate-700 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-slate-400",
          actionButton:
            "group-[.toast]:bg-amber-400 group-[.toast]:text-slate-950",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-200",
          success: "group-[.toast]:border-green-600/50",
          error: "group-[.toast]:border-red-600/50",
          warning: "group-[.toast]:border-yellow-600/50",
          info: "group-[.toast]:border-blue-600/50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
