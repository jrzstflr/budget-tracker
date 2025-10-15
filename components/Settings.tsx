"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { settingsStorage, storage } from "@/lib/storage"

export default function Settings() {
  const [currency, setCurrency] = useState("$")
  const [email, setEmail] = useState("")
  const [theme, setTheme] = useState("light")

  // ✅ Load saved settings and apply theme on mount
  useEffect(() => {
    const savedSettings = settingsStorage.get()
    if (savedSettings.currency) setCurrency(savedSettings.currency)
    if (savedSettings.email) setEmail(savedSettings.email)
    if (savedSettings.theme) {
      setTheme(savedSettings.theme)
      document.documentElement.classList.toggle("dark", savedSettings.theme === "dark")
    }
  }, [])

  // ✅ Update theme live when user changes it
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const handleSaveSettings = () => {
    settingsStorage.save({ currency, email, theme })
    alert("Settings saved successfully!")
  }

  const handleExportData = () => {
    const allData = {
      expenses: storage.get("budget-tracker-expenses", []),
      incomes: storage.get("budget-tracker-incomes", []),
      budgets: storage.get("budget-tracker-budgets", []),
      goals: storage.get("budget-tracker-goals", []),
      investments: storage.get("budget-tracker-investments", []),
      settings: storage.get("budget-tracker-settings", {}),
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(allData, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `budget-tracker-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)

          if (data.expenses) storage.set("budget-tracker-expenses", data.expenses)
          if (data.incomes) storage.set("budget-tracker-incomes", data.incomes)
          if (data.budgets) storage.set("budget-tracker-budgets", data.budgets)
          if (data.goals) storage.set("budget-tracker-goals", data.goals)
          if (data.investments) storage.set("budget-tracker-investments", data.investments)
          if (data.settings) storage.set("budget-tracker-settings", data.settings)

          alert("Data imported successfully! Please refresh the page to see the changes.")
          window.location.reload()
        } catch (error) {
          alert("Error importing data. Please make sure the file is valid.")
          console.error("Import error:", error)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      storage.clearAll()
      alert("All data has been cleared. The page will now reload.")
      window.location.reload()
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currency" className="text-sm font-medium">
              Currency Symbol
            </label>
            <Input
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="Enter currency symbol"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email for Notifications
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="theme" className="text-sm font-medium">
              Theme
            </label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Export all your budget data as a JSON file for backup purposes.
            </p>
            <Button onClick={handleExportData} variant="outline" className="w-full bg-transparent">
              Export Data
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Import previously exported data from a JSON file.</p>
            <Button onClick={handleImportData} variant="outline" className="w-full bg-transparent">
              Import Data
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-red-600">
              Warning: This will permanently delete all your data.
            </p>
            <Button onClick={handleClearAllData} variant="destructive" className="w-full">
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
