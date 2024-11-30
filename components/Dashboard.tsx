"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

export default function Dashboard() {
  const [totalIncome, setTotalIncome] = useState<number | null>(null)
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [expensesByCategory, setExpensesByCategory] = useState<Array<{ name: string; value: number }>>([])

  useEffect(() => {
    // Move all data initialization into useEffect to avoid hydration mismatch
    setTotalIncome(5000)
    setTotalExpenses(3500)
    setBalance(1500)
    setExpensesByCategory([
      { name: 'Food', value: 1000 },
      { name: 'Transportation', value: 500 },
      { name: 'Utilities', value: 800 },
      { name: 'Entertainment', value: 700 },
      { name: 'Other', value: 500 },
    ])
  }, [])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (totalIncome === null || totalExpenses === null || balance === null) {
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
          <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

