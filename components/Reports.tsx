"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { expenseStorage, incomeStorage } from "@/lib/storage"
import { Download } from "lucide-react"

interface ReportData {
  name: string
  income: number
  expenses: number
  balance: number
}

export default function Reports() {
  const [reportType, setReportType] = useState("monthly")
  const [reportData, setReportData] = useState<ReportData[]>([])

  const generateReport = () => {
    const expenses = expenseStorage.getAll()
    const incomes = incomeStorage.getAll()

    if (reportType === "monthly") {
      // Group by month
      const monthlyData = new Map<string, { income: number; expenses: number }>()

      incomes.forEach((income) => {
        const month = income.date.substring(0, 7) // YYYY-MM
        const current = monthlyData.get(month) || { income: 0, expenses: 0 }
        monthlyData.set(month, { ...current, income: current.income + income.amount })
      })

      expenses.forEach((expense) => {
        const month = expense.date.substring(0, 7)
        const current = monthlyData.get(month) || { income: 0, expenses: 0 }
        monthlyData.set(month, { ...current, expenses: current.expenses + expense.amount })
      })

      const data: ReportData[] = Array.from(monthlyData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, values]) => ({
          name: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          income: values.income,
          expenses: values.expenses,
          balance: values.income - values.expenses,
        }))

      setReportData(data)
    } else if (reportType === "weekly") {
      // Group by week
      const weeklyData = new Map<string, { income: number; expenses: number }>()

      const getWeekKey = (dateStr: string) => {
        const date = new Date(dateStr)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        return weekStart.toISOString().split("T")[0]
      }

      incomes.forEach((income) => {
        const week = getWeekKey(income.date)
        const current = weeklyData.get(week) || { income: 0, expenses: 0 }
        weeklyData.set(week, { ...current, income: current.income + income.amount })
      })

      expenses.forEach((expense) => {
        const week = getWeekKey(expense.date)
        const current = weeklyData.get(week) || { income: 0, expenses: 0 }
        weeklyData.set(week, { ...current, expenses: current.expenses + expense.amount })
      })

      const data: ReportData[] = Array.from(weeklyData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-8) // Last 8 weeks
        .map(([week, values]) => ({
          name: new Date(week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          income: values.income,
          expenses: values.expenses,
          balance: values.income - values.expenses,
        }))

      setReportData(data)
    } else if (reportType === "yearly") {
      // Group by year
      const yearlyData = new Map<string, { income: number; expenses: number }>()

      incomes.forEach((income) => {
        const year = income.date.substring(0, 4)
        const current = yearlyData.get(year) || { income: 0, expenses: 0 }
        yearlyData.set(year, { ...current, income: current.income + income.amount })
      })

      expenses.forEach((expense) => {
        const year = expense.date.substring(0, 4)
        const current = yearlyData.get(year) || { income: 0, expenses: 0 }
        yearlyData.set(year, { ...current, expenses: current.expenses + expense.amount })
      })

      const data: ReportData[] = Array.from(yearlyData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([year, values]) => ({
          name: year,
          income: values.income,
          expenses: values.expenses,
          balance: values.income - values.expenses,
        }))

      setReportData(data)
    }
  }

  useEffect(() => {
    generateReport()
  }, [reportType])

  const exportReport = () => {
    if (reportData.length === 0) {
      alert("No data to export. Please generate a report first.")
      return
    }

    const headers = ["Period", "Income", "Expenses", "Balance"]
    const csvContent = [
      headers.join(","),
      ...reportData.map(
        (row) => `${row.name},${row.income.toFixed(2)},${row.expenses.toFixed(2)},${row.balance.toFixed(2)}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trackify-report-${reportType}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Financial Reports</h2>
        <p className="text-muted-foreground mt-1">Analyze your income and expenses over time</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="sm:w-[200px]">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateReport} variant="outline">
              Refresh Report
            </Button>
          </div>
        </CardContent>
      </Card>
      {reportData.length > 0 ? (
        <>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(value: number) => `₱${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Balance Trend</CardTitle>
              <Button onClick={exportReport} variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(value: number) => `₱${value.toFixed(2)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} name="Balance" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No data available for the selected period. Add some income and expenses to generate reports.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
