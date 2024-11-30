"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Budget {
  id: number
  category: string
  amount: number
  spent: number
}

export default function BudgetPlanner() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [newBudget, setNewBudget] = useState<Omit<Budget, 'id' | 'spent'>>({
    category: '',
    amount: 0
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    // Fetch budgets from API or local storage
    // For now, we'll use mock data
    setBudgets([
      { id: 1, category: 'Food', amount: 500, spent: 300 },
      { id: 2, category: 'Transportation', amount: 200, spent: 150 },
      { id: 3, category: 'Entertainment', amount: 100, spent: 80 },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewBudget(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId !== null) {
      // Update existing budget
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.id === editingId
            ? { ...budget, ...newBudget, amount: Number(newBudget.amount) }
            : budget
        )
      )
      setEditingId(null)
    } else {
      // Add a new budget
      setBudgets((prev) => [
        ...prev,
        {
          id: Number(Date.now()), // Explicitly cast Date.now() to a number
          ...newBudget,
          amount: Number(newBudget.amount), // Ensure amount is converted to a number
          spent: 0,
        },
      ])
    }
    // Reset the form
    setNewBudget({ category: '', amount: 0 })
  }

  const handleDelete = (id: number) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id))
  }

  const handleEdit = (id: number) => {
    const budgetToEdit = budgets.find(budget => budget.id === id)
    if (budgetToEdit) {
      setEditingId(id)
      setNewBudget({
        category: budgetToEdit.category,
        amount: budgetToEdit.amount,
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Set Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Input
                id="category"
                type="text"
                name="category"
                placeholder="Category"
                value={newBudget.category}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                name="amount"
                placeholder="Amount"
                value={newBudget.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">
              {editingId !== null ? 'Update Budget' : 'Set Budget'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.map((budget) => (
            <div key={budget.id} className="mb-6 last:mb-0">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{budget.category}</span>
                <span className="text-muted-foreground">
                  ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </span>
              </div>
              <Progress
                value={(budget.spent / budget.amount) * 100}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(budget.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(budget.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
