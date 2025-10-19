"use client"

import { useCallback, useEffect, useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { ThemeToggleButton } from "@/components/ui/shadcn-io/theme-toggle-button"

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }, [theme, setTheme])

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full border border-input bg-background" />
  }

  const currentTheme =
    theme === "system"
      ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : (theme as "light" | "dark")

  return <ThemeToggleButton theme={currentTheme} onClick={handleThemeToggle} variant="circle" start="center" />
}
