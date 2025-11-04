import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AppLayout } from "@/components/layout/app-layout";

export const metadata: Metadata = {
  title: "LeadFlow - Lead Management System",
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
              <AppLayout>{children}</AppLayout>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
