"use client"

import { useCallback, useEffect, useState } from "react"
import { useSettings } from "@/hooks/useSettings"
import type { Mode } from "@/contexts/settingsContext"
import { ThemeToggleButton, useThemeTransition } from "@/components/ui/shadcn-io/theme-toggle-button"

export const ThemeToggle = () => {
  const { settings, updateSettings } = useSettings()
  const { startTransition } = useThemeTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = useCallback(() => {
    const newMode: Mode = settings.mode === "dark" ? "light" : "dark"

    startTransition(() => {
      const updatedSettings = {
        ...settings,
        mode: newMode,
        theme: {
          ...settings.theme,
          styles: {
            light: settings.theme.styles?.light || {},
            dark: settings.theme.styles?.dark || {},
          },
        },
      }

      updateSettings(updatedSettings)

      const root = document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(newMode)
    })
  }, [settings, updateSettings, startTransition])

  const currentTheme = settings.mode as "light" | "dark"

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full border border-input bg-background" />
  }

  return <ThemeToggleButton theme={currentTheme} onClick={handleThemeToggle} variant="circle" start="center" />
}
