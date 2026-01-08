import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "sonner/dist/styles.css";
import { SidebarWrapper } from "@/components/sidebar-wrapper"
import { Toaster } from "@/components/ui/sonner"
import { createServerClient } from "@/lib/supabase-server"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adwelink | AI Workforce for Institutes",
  description: "Hire your first AI Employee. Automated Counseling, Teaching, and Finance management for modern educational institutes.",
  icons: {
    icon: "/branding/adwelink_icon_square.svg",
    apple: "/branding/adwelink_icon_square.svg",
  },
  openGraph: {
    images: ["/branding/adwelink_facebook_cover.svg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // CTO SHOCK ABSORBER: Wrap Auth in Try/Catch
  // This prevents the entire app from crashing (White Screen) if Supabase connection fails.
  let user = null
  try {
    const supabase = await createServerClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error("CRITICAL: Root Layout Auth Failed. Rendering Public View.", error)
    // We proceed with user = null, allowing the app to render in "Guest Mode"
    // instead of crashing completely.
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SidebarWrapper user={user}>
          {children}
        </SidebarWrapper>
        <Toaster />
      </body>
    </html>
  );
}
