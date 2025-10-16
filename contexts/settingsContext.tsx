'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Mode = 'light' | 'dark' | 'system'

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
  mode: 'light',
  theme: {
    styles: {
      light: {},
      dark: {}
    }
  }
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {}
})

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('app-settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings)
    localStorage.setItem('app-settings', JSON.stringify(newSettings))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}