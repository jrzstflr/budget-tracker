"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  FileText,
  PiggyBank,
  Target,
  LineChart,
  Settings,
  Menu,
} from "lucide-react"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { title: "Expenses", href: "expenses", icon: Receipt },
  { title: "Income", href: "income", icon: TrendingUp },
  { title: "Reports", href: "reports", icon: FileText },
  { title: "Budget", href: "budget", icon: PiggyBank },
  { title: "Goals", href: "goals", icon: Target },
  { title: "Investments", href: "investments", icon: LineChart },
  { title: "Settings", href: "settings", icon: Settings },
]

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border shadow-xl">
        <div className="flex flex-col h-full">
          {/* Logo/Brand - CHANGE: Improved spacing and contrast */}
          <div className="flex items-center gap-4 px-6 py-8 border-b border-border bg-card">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-blue-500/20 flex-shrink-0">
              <Image
                src="https://github.com/jrzstflr/logo2/blob/main/jrz_logo_v2.png?raw=true"
                alt="Trackify Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground leading-tight">Trackify</h1>
              <p className="text-xs text-muted-foreground font-medium">Powered by Jrz | Dev</p>
            </div>
          </div>

          {/* Navigation - CHANGE: Improved spacing, contrast, and visual hierarchy */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto bg-card">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.href
              return (
                <button
                  key={item.href}
                  onClick={() => onTabChange(item.href)}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-4 rounded-lg text-base font-semibold transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <Icon
                    className={cn(
                      "w-6 h-6 relative z-10 flex-shrink-0 transition-transform duration-200",
                      isActive ? "scale-110" : "group-hover:scale-110",
                    )}
                  />
                  <span className="relative z-10 truncate">{item.title}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Footer - CHANGE: Better spacing and contrast */}
          <div className="px-6 py-6 border-t border-border bg-card">
            <p className="text-sm text-foreground font-semibold text-center">© 2025 Trackify. All rights reserved.</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header - CHANGE: Improved spacing and contrast */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-lg">
        <div className="flex items-center justify-between px-5 py-5">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
              <Image
                src="https://github.com/jrzstflr/logo2/blob/main/jrz_logo_v2.png?raw=true"
                alt="Trackify Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-lg font-bold text-foreground truncate">Trackify</h1>
          </div>

          {/* Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/60 transition-all duration-200 hover:scale-105 flex-shrink-0"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-card border-r border-border">
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="flex items-center gap-4 px-6 py-8 border-b border-border bg-card">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-blue-500/20 flex-shrink-0">
                    <Image
                      src="https://github.com/jrzstflr/logo2/blob/main/jrz_logo_v2.png?raw=true"
                      alt="Trackify Logo"
                      width={48}
                      height={48}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg font-bold text-foreground leading-tight">Trackify</h1>
                    <p className="text-xs text-muted-foreground font-medium">Powered by Jrz | Dev</p>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto bg-card">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.href
                    return (
                      <button
                        key={item.href}
                        onClick={() => onTabChange(item.href)}
                        className={cn(
                          "w-full flex items-center gap-4 px-5 py-4 rounded-lg text-base font-semibold transition-all duration-200 group relative overflow-hidden",
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                            : "text-foreground hover:bg-accent/60 hover:text-foreground",
                        )}
                      >
                        {!isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                        <Icon
                          className={cn(
                            "w-6 h-6 relative z-10 flex-shrink-0 transition-transform duration-200",
                            isActive ? "scale-110" : "group-hover:scale-110",
                          )}
                        />
                        <span className="relative z-10 truncate">{item.title}</span>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full" />
                        )}
                      </button>
                    )
                  })}
                </nav>

                {/* Mobile Footer */}
                <div className="px-6 py-6 border-t border-border bg-card">
                  <p className="text-sm text-foreground font-semibold text-center">© 2025 Trackify. All rights reserved.</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}
