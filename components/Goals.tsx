"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Goal {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState<Goal | Omit<Goal, "id">>({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
  })

  useEffect(() => {
    // Fetch goals from API or local storage
    setGoals([
      { id: 1, name: "Emergency Fund", targetAmount: 10000, currentAmount: 5000, deadline: "2024-12-31" },
      { id: 2, name: "Vacation", targetAmount: 5000, currentAmount: 2000, deadline: "2024-06-30" },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewGoal((prev) => ({
      ...prev,
      [name]: name.includes("Amount") ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if ("id" in newGoal) {
      // If editing, update the existing goal
      setGoals((prev) =>
        prev.map((goal) => (goal.id === newGoal.id ? (newGoal as Goal) : goal))
      )
    } else {
      // Adding a new goal
      const newGoalWithId = { ...newGoal, id: Date.now() } as Goal
      setGoals((prev) => [...prev, newGoalWithId])
    }

    // Reset the form
    setNewGoal({
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: "",
    })
  }

  const handleDelete = (id: number) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  const handleEdit = (id: number) => {
    const goalToEdit = goals.find((goal) => goal.id === id)
    if (goalToEdit) {
      setNewGoal(goalToEdit)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Goal</CardTitle>
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
            />
            <Input
              type="number"
              name="currentAmount"
              placeholder="Current Amount"
              value={newGoal.currentAmount}
              onChange={handleInputChange}
              required
            />
            <Input
              type="date"
              name="deadline"
              placeholder="Deadline"
              value={newGoal.deadline}
              onChange={handleInputChange}
              required
            />
            <Button type="submit">{'id' in newGoal ? "Update Goal" : "Add Goal"}</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Financial Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.map((goal) => (
            <div key={goal.id} className="mb-4">
              <div className="flex justify-between mb-2">
                <span>{goal.name}</span>
                <span>
                  ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                </span>
              </div>
              <Progress value={(goal.currentAmount / goal.targetAmount) * 100} />
              <div className="text-sm text-gray-500 mt-1">Deadline: {goal.deadline}</div>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(goal.id)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(goal.id)}
                  className="ml-2"
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
