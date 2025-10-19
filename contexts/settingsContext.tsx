"use client"

import type React from "react"
import { createContext, useContext } from "react"

export type Mode = "light" | "dark" | "system"

export interface Settings {
  mode: Mode
  theme: {
    styles?: {
      light: Record<string, any>
      dark: Record<string, any>
    }
  }
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Settings) => void
}

const defaultSettings: Settings = {
  mode: "light",
  theme: {
    styles: {
      light: {},
      dark: {},
    },
  },
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
})

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const updateSettings = (newSettings: Settings) => {
    console.log("[v0] Settings updated:", newSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings: defaultSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
