"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { expenseStorage, incomeStorage } from "@/lib/storage"

export default function Dashboard() {
  const [totalIncome, setTotalIncome] = useState<number>(0)
  const [totalExpenses, setTotalExpenses] = useState<number>(0)
  const [balance, setBalance] = useState<number>(0)
  const [expensesByCategory, setExpensesByCategory] = useState<Array<{ name: string; value: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = () => {
    const expenses = expenseStorage.getAll()
    const incomes = incomeStorage.getAll()

    const totalExp = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const totalInc = incomes.reduce((sum, inc) => sum + inc.amount, 0)

    setTotalExpenses(totalExp)
    setTotalIncome(totalInc)
    setBalance(totalInc - totalExp)

    // Calculate expenses by category
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
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()

    // Listen for storage updates from other components
    const handleStorageUpdate = () => {
      loadData()
    }

    window.addEventListener("storage-update", handleStorageUpdate)
    return () => window.removeEventListener("storage-update", handleStorageUpdate)
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B9D", "#C084FC", "#34D399"]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">₱{totalIncome.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">₱{totalExpenses.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₱{balance.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
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
                  outerRadius={80}
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
            <p className="text-center text-muted-foreground py-8">No expenses recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
