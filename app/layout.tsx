import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Header, Sidebar } from "@/components/layout";
import { ThemeProvider } from "@/components/theme";

import "./globals.css";
import styles from "./layout.module.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Server Dashboard",
    template: "%s | Server Dashboard",
  },
  description:
    "Real-time monitoring dashboard for distributed servers — geographic view, status, and platform breakdowns.",
  applicationName: "Server Dashboard",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1d" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={styles.body}>
        <ThemeProvider>
          <div className={styles.shell}>
            <Sidebar />
            <div className={styles.column}>
              <Header />
              <main className={styles.main}>{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
