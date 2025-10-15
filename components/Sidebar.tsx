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
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
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
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const currentTheme =
      theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gradient-to-b from-card to-card/95 border-r border-border/50 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg ring-2 ring-blue-500/10">
              <Image
                src="https://github.com/jrzstflr/logo2/blob/main/jrz_logo_v2.png?raw=true"
                alt="Trackify Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Trackify
              </h1>
              <p className="text-xs text-muted-foreground">Smart Budget Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.href
              return (
                <button
                  key={item.href}
                  onClick={() => onTabChange(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-[1.01] hover:shadow-sm",
                  )}
                >
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <Icon
                    className={cn(
                      "w-5 h-5 relative z-10 transition-transform duration-200",
                      isActive ? "scale-110" : "group-hover:scale-110",
                    )}
                  />
                  <span className="relative z-10">{item.title}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-border/50 space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent/50 to-accent/30 hover:from-accent hover:to-accent/50 border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group"
            >
              {isDark ? (
                <Sun className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-12" />
              )}
              {isDark ? "Light Mode" : "Dark Mode"}
            </Button>
            <p className="text-xs text-muted-foreground text-center font-medium">Stay on track. Stay in control.</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://github.com/jrzstflr/logo2/blob/main/jrz_logo_v2.png?raw=true"
                alt="Trackify Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Trackify
              </h1>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-accent/50 transition-all duration-200 hover:scale-105 group"
            >
              {isDark ? (
                <Sun className="w-5 h-5 transition-transform duration-200 group-hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-200 group-hover:-rotate-12" />
              )}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/50 transition-all duration-200 hover:scale-105"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-card to-card/95 backdrop-blur-xl">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="https://github.com/jrzstflr/logo2/blob/main/jrz_logo_v2.png?raw=true"
                        alt="Trackify Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                        priority
                      />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Trackify
                      </h1>
                      <p className="text-xs text-muted-foreground">Smart Budget Dashboard</p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = activeTab === item.href
                      return (
                        <button
                          key={item.href}
                          onClick={() => onTabChange(item.href)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-sm",
                          )}
                        >
                          {!isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                          <Icon
                            className={cn(
                              "w-5 h-5 relative z-10 transition-transform duration-200",
                              isActive ? "scale-110" : "group-hover:scale-110",
                            )}
                          />
                          <span className="relative z-10">{item.title}</span>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                          )}
                        </button>
                      )
                    })}
                  </nav>

                  {/* Mobile Footer */}
                  <div className="px-6 py-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground text-center font-medium">
                      Stay on track. Stay in control.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  )
}
