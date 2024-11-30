"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Reports() {
  const [reportType, setReportType] = useState('weekly')
  const [reportData, setReportData] = useState([])

  const generateReport = () => {
    // In a real application, this would fetch data from an API
    // For now, we'll use mock data
    const mockData = [
      { name: 'Week 1', income: 1000, expenses: 800 },
      { name: 'Week 2', income: 1200, expenses: 900 },
      { name: 'Week 3', income: 1100, expenses: 950 },
      { name: 'Week 4', income: 1300, expenses: 1000 },
    ]
    setReportData(mockData)
  }

  const exportReport = () => {
    // In a real application, this would generate a CSV or Excel file
    // For now, we'll just log to console
    console.log('Exporting report:', reportData)
    alert('Report exported (check console)')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport}>Generate Report</Button>
        </CardContent>
      </Card>
      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#8884d8" />
                <Bar dataKey="expenses" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
            <Button onClick={exportReport} className="mt-4">Export Report</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

