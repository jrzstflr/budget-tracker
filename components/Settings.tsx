"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Settings() {
  const [currency, setCurrency] = useState('$')
  const [email, setEmail] = useState('')
  const [theme, setTheme] = useState('light')

  const handleSaveSettings = () => {
    // In a real application, this would save settings to an API or local storage
    console.log('Saving settings:', { currency, email, theme })
    alert('Settings saved')
  }

  const handleExportData = () => {
    // In a real application, this would generate a JSON file with all user data
    console.log('Exporting data')
    alert('Data exported (check console)')
  }

  const handleImportData = () => {
    // In a real application, this would open a file picker and import data
    console.log('Importing data')
    alert('Data imported (this is a placeholder)')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currency">Currency</label>
            <Input
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="Enter currency symbol"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email">Email for Notifications</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="theme">Theme</label>
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
          <Button onClick={handleExportData}>Export Data</Button>
          <Button onClick={handleImportData}>Import Data</Button>
        </CardContent>
      </Card>
    </div>
  )
}

