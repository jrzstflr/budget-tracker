"use client"

import type React from "react"
import { useState } from "react"
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
  X,
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
  const [open, setOpen] = useState(false)

  const handleNavClick = (href: string) => {
    onTabChange(href)
    setOpen(false) // Close mobile menu on navigation
  }

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg ring-2 ring-primary/10">
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
          <h1 className="text-xl font-bold text-foreground">Trackify</h1>
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
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span>{item.title}</span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center font-medium">
          Stay on track. Stay in control.
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
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
            <h1 className="text-lg font-bold text-foreground">Trackify</h1>
          </div>

          {/* Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/50 transition-all duration-200"
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-card">
              <NavContent mobile />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}