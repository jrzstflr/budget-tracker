"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { budgetStorage, updateBudgetSpent, type Budget } from "@/lib/storage"

export default function BudgetPlanner() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [newBudget, setNewBudget] = useState<Omit<Budget, "id" | "spent">>({
    category: "",
    amount: "" as any,
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    updateBudgetSpent()
    const loadedBudgets = budgetStorage.getAll()
    setBudgets(loadedBudgets)

    // Listen for storage updates
    const handleStorageUpdate = () => {
      updateBudgetSpent()
      const updatedBudgets = budgetStorage.getAll()
      setBudgets(updatedBudgets)
    }

    window.addEventListener("storage-update", handleStorageUpdate)
    return () => window.removeEventListener("storage-update", handleStorageUpdate)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewBudget((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId !== null) {
      const existingBudget = budgets.find((b) => b.id === editingId)
      const updatedBudget: Budget = {
        id: editingId,
        ...newBudget,
        amount: Number(newBudget.amount),
        spent: existingBudget?.spent || 0,
      }
      budgetStorage.update(editingId, updatedBudget)
      setBudgets((prev) => prev.map((budget) => (budget.id === editingId ? updatedBudget : budget)))
      setEditingId(null)
    } else {
      const budgetWithId: Budget = {
        id: Date.now(),
        ...newBudget,
        amount: Number(newBudget.amount),
        spent: 0,
      }
      budgetStorage.add(budgetWithId)
      setBudgets((prev) => [...prev, budgetWithId])
    }

    // Update spent amounts
    updateBudgetSpent()

    // Reset the form
    setNewBudget({ category: "", amount: "" as any })
  }

  const handleDelete = (id: number) => {
    budgetStorage.delete(id)
    setBudgets((prev) => prev.filter((budget) => budget.id !== id))
  }

  const handleEdit = (id: number) => {
    const budgetToEdit = budgets.find((budget) => budget.id === id)
    if (budgetToEdit) {
      setEditingId(id)
      setNewBudget({
        category: budgetToEdit.category,
        amount: budgetToEdit.amount as any,
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Budget" : "Set Budget"}</CardTitle>
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
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingId !== null ? "Update Budget" : "Set Budget"}</Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setNewBudget({ category: "", amount: "" as any })
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.length > 0 ? (
            budgets.map((budget) => {
              const percentage = (budget.spent / budget.amount) * 100
              const isOverBudget = percentage > 100
              return (
                <div key={budget.id} className="mb-6 last:mb-0">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{budget.category}</span>
                    <span
                      className={`text-sm ${isOverBudget ? "text-red-600 font-semibold" : "text-muted-foreground"}`}
                    >
                      ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                      {isOverBudget && " (Over Budget!)"}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={`mb-2 ${isOverBudget ? "[&>div]:bg-red-600" : ""}`}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(budget.id)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(budget.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-muted-foreground py-8">No budgets set yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
