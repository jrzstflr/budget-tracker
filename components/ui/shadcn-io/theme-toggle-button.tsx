"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleButtonProps {
  theme: "light" | "dark"
  onClick: () => void
  variant?: "circle" | "circle-blur" | "polygon" | "gif"
  start?: "center" | "top-right" | "top-left" | "bottom-right" | "bottom-left"
  url?: string
  className?: string
}

export const ThemeToggleButton = React.forwardRef<HTMLButtonElement, ThemeToggleButtonProps>(
  ({ theme, onClick, variant = "circle", start = "center", url, className }, ref) => {
    const [isAnimating, setIsAnimating] = React.useState(false)

    const handleClick = React.useCallback(() => {
      console.log("[v0] Theme toggle button clicked, current theme:", theme)
      setIsAnimating(true)
      onClick()
      setTimeout(() => setIsAnimating(false), 600)
    }, [onClick, theme])

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-input bg-background text-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          isAnimating && "scale-95",
          className,
        )}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        <Sun className={cn("h-5 w-5 rotate-0 scale-100 transition-all", theme === "dark" && "-rotate-90 scale-0")} />
        <Moon
          className={cn("absolute h-5 w-5 rotate-90 scale-0 transition-all", theme === "dark" && "rotate-0 scale-100")}
        />
      </button>
    )
  },
)

ThemeToggleButton.displayName = "ThemeToggleButton"

export const useThemeTransition = () => {
  const startTransition = React.useCallback((callback: () => void) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        callback()
      })
    } else {
      callback()
    }
  }, [])

  return { startTransition }
}
