"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { expenseService, incomeService } from "@/lib/firestore"
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react"

export default function Dashboard() {
  const { user } = useAuth()
  const [totalIncome, setTotalIncome] = useState<number>(0)
  const [totalExpenses, setTotalExpenses] = useState<number>(0)
  const [balance, setBalance] = useState<number>(0)
  const [expensesByCategory, setExpensesByCategory] = useState<Array<{ name: string; value: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [weeklyComparison, setWeeklyComparison] = useState({ current: 0, previous: 0, change: 0 })
  const [monthlyComparison, setMonthlyComparison] = useState({ current: 0, previous: 0, change: 0 })

  const loadData = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Loading dashboard data from Firebase for user:", user.uid)

      // Fetch expenses and incomes from Firebase
      const expenses = await expenseService.getAll(user.uid)
      const incomes = await incomeService.getAll(user.uid)

      console.log("[v0] Loaded expenses:", expenses.length, "incomes:", incomes.length)

      const totalExp = expenses.reduce((sum, exp) => sum + exp.amount, 0)
      const totalInc = incomes.reduce((sum, inc) => sum + inc.amount, 0)

      setTotalExpenses(totalExp)
      setTotalIncome(totalInc)
      setBalance(totalInc - totalExp)

      const categoryMap = new Map<string, number>()
      expenses.forEach((expense) => {
        const current = categoryMap.get(expense.category) || 0
        categoryMap.set(expense.category, current + expense.amount)
      })

      const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value,
      }))

      setExpensesByCategory(categoryData)

      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

      const currentWeekExpenses = expenses
        .filter((e) => new Date(e.date) >= weekAgo)
        .reduce((sum, e) => sum + e.amount, 0)
      const previousWeekExpenses = expenses
        .filter((e) => new Date(e.date) >= twoWeeksAgo && new Date(e.date) < weekAgo)
        .reduce((sum, e) => sum + e.amount, 0)

      const weeklyChange =
        previousWeekExpenses > 0 ? ((currentWeekExpenses - previousWeekExpenses) / previousWeekExpenses) * 100 : 0

      setWeeklyComparison({
        current: currentWeekExpenses,
        previous: previousWeekExpenses,
        change: weeklyChange,
      })

      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

      const currentMonthExpenses = expenses
        .filter((e) => {
          const date = new Date(e.date)
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        })
        .reduce((sum, e) => sum + e.amount, 0)

      const previousMonthExpenses = expenses
        .filter((e) => {
          const date = new Date(e.date)
          return date.getMonth() === previousMonth && date.getFullYear() === previousYear
        })
        .reduce((sum, e) => sum + e.amount, 0)

      const monthlyChange =
        previousMonthExpenses > 0 ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 : 0

      setMonthlyComparison({
        current: currentMonthExpenses,
        previous: previousMonthExpenses,
        change: monthlyChange,
      })

      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-effect animate-pulse">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Please log in to view your dashboard</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground mt-1">Track your financial health at a glance</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Income Card */}
        <Card className="glass-effect transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 border-l-4 border-l-green-500 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">₱{totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              All time earnings
            </p>
          </CardContent>
        </Card>

        {/* Total Expenses Card */}
        <Card className="glass-effect transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 border-l-4 border-l-red-500 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-110 transition-transform duration-300">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">₱{totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3" />
              All time spending
            </p>
          </CardContent>
        </Card>

        {/* Net Balance Card */}
        <Card
          className={`glass-effect transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 border-l-4 overflow-hidden relative group ${
            balance >= 0 ? "border-l-blue-500" : "border-l-orange-500"
          }`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              balance >= 0 ? "from-blue-500/5" : "from-orange-500/5"
            } to-transparent`}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                balance >= 0
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25"
                  : "bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/25"
              }`}
            >
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div
              className={`text-3xl font-bold ${
                balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
              }`}
            >
              ₱{balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {balance >= 0 ? "Positive balance" : "Negative balance"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-effect hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Weekly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">₱{weeklyComparison.current.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">this week</span>
              </div>
              {weeklyComparison.previous > 0 && (
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    weeklyComparison.change > 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {weeklyComparison.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(weeklyComparison.change).toFixed(1)}%</span>
                  <span className="text-muted-foreground font-normal">vs last week</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">₱{monthlyComparison.current.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">this month</span>
              </div>
              {monthlyComparison.previous > 0 && (
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    monthlyComparison.change > 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {monthlyComparison.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(monthlyComparison.change).toFixed(1)}%</span>
                  <span className="text-muted-foreground font-normal">vs last month</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-effect hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₱${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-center text-muted-foreground">No expenses recorded yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <div className="w-3 h-3 bg-white" style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
              </div>
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expensesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(value: number) => `₱${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-center text-muted-foreground">No expenses recorded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
