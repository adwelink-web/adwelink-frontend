"use client" // Changed to client component to support Sidebar state

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  // Don't show sidebar on login page
  const isLoginPage = pathname?.startsWith("/login")

  useEffect(() => {
    if (open) setOpen(false)
  }, [pathname, open])

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {isLoginPage ? (
          children
        ) : (
          <div className="flex h-screen overflow-hidden relative">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-64 flex-col bg-sidebar border-r border-border shrink-0">
              <AppSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden h-full">

              {/* Mobile Header */}
              <header className="flex h-16 items-center border-b border-border bg-background/50 backdrop-blur-md px-4 md:hidden shrink-0">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-4 text-foreground/80">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 border-r border-white/10 w-72 bg-[#0B0F19]">
                    <AppSidebar />
                  </SheetContent>
                </Sheet>
                <div className="font-semibold text-lg text-foreground">Adwelink AMS</div>
              </header>

              {/* Scrollable Page Content */}
              <main className="flex-1 overflow-y-auto bg-background relative p-0">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <div className="relative z-10 w-full h-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
