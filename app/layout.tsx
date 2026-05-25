import type { Metadata } from "next";
import "reactflow/dist/style.css";
import "./globals.css";
import { ToastProvider } from "@/components/layout/toast-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { PremiumLayout } from "@/components/layout/premium-layout";

export const metadata: Metadata = {
  title: "CloudForge AI",
  description:
    "AI-powered cloud architecture generator for scalable diagrams, infrastructure templates, and deployment guidance."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PremiumLayout>
            {children}
          </PremiumLayout>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
