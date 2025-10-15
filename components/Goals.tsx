"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { goalStorage, type Goal } from "@/lib/storage"

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id">>({
    name: "",
    targetAmount: "" as any,
    currentAmount: "" as any,
    deadline: "",
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    const loadedGoals = goalStorage.getAll()
    setGoals(loadedGoals)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewGoal((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId !== null) {
      const updatedGoal: Goal = {
        id: editingId,
        ...newGoal,
        targetAmount: Number(newGoal.targetAmount),
        currentAmount: Number(newGoal.currentAmount),
      }
      goalStorage.update(editingId, updatedGoal)
      setGoals((prev) => prev.map((goal) => (goal.id === editingId ? updatedGoal : goal)))
      setEditingId(null)
    } else {
      const newGoalWithId: Goal = {
        ...newGoal,
        id: Date.now(),
        targetAmount: Number(newGoal.targetAmount),
        currentAmount: Number(newGoal.currentAmount),
      }
      goalStorage.add(newGoalWithId)
      setGoals((prev) => [...prev, newGoalWithId])
    }

    // Reset the form
    setNewGoal({
      name: "",
      targetAmount: "" as any,
      currentAmount: "" as any,
      deadline: "",
    })
  }

  const handleDelete = (id: number) => {
    goalStorage.delete(id)
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  const handleEdit = (id: number) => {
    const goalToEdit = goals.find((goal) => goal.id === id)
    if (goalToEdit) {
      setNewGoal({
        name: goalToEdit.name,
        targetAmount: goalToEdit.targetAmount as any,
        currentAmount: goalToEdit.currentAmount as any,
        deadline: goalToEdit.deadline,
      })
      setEditingId(id)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Goal" : "Add New Goal"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Goal Name"
              value={newGoal.name}
              onChange={handleInputChange}
              required
            />
            <Input
              type="number"
              name="targetAmount"
              placeholder="Target Amount"
              value={newGoal.targetAmount}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
            <Input
              type="number"
              name="currentAmount"
              placeholder="Current Amount"
              value={newGoal.currentAmount}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
            <Input
              type="date"
              name="deadline"
              placeholder="Deadline"
              value={newGoal.deadline}
              onChange={handleInputChange}
              required
            />
            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Update Goal" : "Add Goal"}</Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setNewGoal({
                      name: "",
                      targetAmount: "" as any,
                      currentAmount: "" as any,
                      deadline: "",
                    })
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
          <CardTitle>Financial Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length > 0 ? (
            goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )
              return (
                <div key={goal.id} className="mb-6 last:mb-0 p-4 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-lg">{goal.name}</span>
                    <span className="text-sm font-medium">
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground mb-3">
                    <span>{percentage.toFixed(1)}% Complete</span>
                    <span>
                      Deadline: {goal.deadline}
                      {daysLeft > 0 ? ` (${daysLeft} days left)` : " (Overdue)"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(goal.id)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(goal.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-muted-foreground py-8">No goals set yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
