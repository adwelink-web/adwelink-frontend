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
  let institute = null
  try {
    const supabase = await createServerClient()
    const { data } = await supabase.auth.getUser()
    user = data.user

    if (user) {
      // Fetch basic institute context for the sidebar
      // CTO NOTE: Using any cast for table name to avoid schema strictness if table is missing from types
      const { data: profile } = await (supabase
        .from("staff_members" as any)
        .select("institute_id")
        .eq("id", user.id)
        .single() as any)

      if (profile?.institute_id) {
        const { data: instData } = await supabase
          .from("institutes")
          .select("id, name, current_plan, subscription_status, created_at")
          .eq("id", profile.institute_id)
          .single()
        institute = instData
      }
    }
  } catch (error) {
    console.error("CRITICAL: Root Layout Auth/Context Failed. Rendering Public View.", error)
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SidebarWrapper user={user} institute={institute}>
          {children}
        </SidebarWrapper>
        <Toaster />
      </body>
    </html>
  );
}
