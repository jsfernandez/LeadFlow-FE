import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "LeadManager - Lead Management System",
  description: "Manage offers, proposals, lead assignments, and payouts in a streamlined workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <LanguageProvider>
                <AppLayout>{children}</AppLayout>
                <Toaster />
              </LanguageProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
