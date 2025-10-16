"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { expenseService, budgetService, type Expense } from "@/lib/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2 } from "lucide-react"
import { FloatingActionButton } from "@/components/FloatingActionButton"

export default function ExpenseTracker() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    category: "",
    description: "",
    paymentMethod: "",
  })

  // Load expenses
  useEffect(() => {
    if (!user) return

    const loadExpenses = async () => {
      try {
        setLoading(true)
        const data = await expenseService.getAll(user.uid)
        setExpenses(data)
      } catch (error) {
        console.error("[v0] Error loading expenses:", error)
        toast({
          title: "Failed to load expenses",
          description: "Please create the required Firebase index.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadExpenses()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Expense form submitted")

    if (!user) {
      toast({
        title: "You must be logged in",
        description: "Please log in to add expenses.",
        variant: "destructive",
      })
      return
    }

    if (!newExpense.amount || !newExpense.category || !newExpense.description || !newExpense.paymentMethod) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      if (editingId) {
        // Update existing expense
        await expenseService.update(editingId, {
          date: new Date(newExpense.date),
          amount: Number.parseFloat(newExpense.amount),
          category: newExpense.category,
          description: newExpense.description,
          paymentMethod: newExpense.paymentMethod,
        })
        toast({
          title: "Expense updated",
          description: "Expense updated successfully!",
        })
      } else {
        // Create new expense
        await expenseService.create(user.uid, {
          date: new Date(newExpense.date),
          amount: Number.parseFloat(newExpense.amount),
          category: newExpense.category,
          description: newExpense.description,
          paymentMethod: newExpense.paymentMethod,
        })
        toast({
          title: "Expense added",
          description: "Expense added successfully!",
        })
      }

      // Update budget spent amounts
      await budgetService.updateSpent(user.uid)

      // Reload expenses
      const data = await expenseService.getAll(user.uid)
      setExpenses(data)

      // Reset form
      setNewExpense({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        category: "",
        description: "",
        paymentMethod: "",
      })
      setEditingId(null)
      setShowForm(false)
    } catch (error) {
      console.error("[v0] Error saving expense:", error)
      toast({
        title: "Failed to save expense",
        description: "Please check the console for details.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (expense: Expense) => {
    console.log("[v0] Editing expense:", expense.id)
    setNewExpense({
      date: expense.date.toISOString().split("T")[0],
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      paymentMethod: expense.paymentMethod,
    })
    setEditingId(expense.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    console.log("[v0] Deleting expense:", id)

    if (!user) return
    if (!confirm("Are you sure you want to delete this expense?")) return

    try {
      await expenseService.delete(id)

      // Update budget spent amounts
      await budgetService.updateSpent(user.uid)

      // Reload expenses
      const data = await expenseService.getAll(user.uid)
      setExpenses(data)

      toast({
        title: "Expense deleted",
        description: "Expense deleted successfully!",
      })
    } catch (error) {
      console.error("[v0] Error deleting expense:", error)
      toast({
        title: "Failed to delete expense",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      category: "",
      description: "",
      paymentMethod: "",
    })
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {(showForm || expenses.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Expense" : "Add New Expense"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Amount (₱)"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                required
                min="0"
                step="0.01"
              />
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                required
              />
              <Select
                value={newExpense.paymentMethod}
                onValueChange={(value) => setNewExpense({ ...newExpense, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Update Expense" : "Add Expense"}
                </Button>
                {(editingId || showForm) && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.date.toISOString().split("T")[0]}</TableCell>
                        <TableCell>₱{expense.amount.toFixed(2)}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(expense)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(expense.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {expenses.map((expense) => (
                  <Card key={expense.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-lg">₱{expense.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{expense.date.toISOString().split("T")[0]}</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                          {expense.category}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{expense.description}</p>
                      <p className="text-xs text-muted-foreground mb-3">{expense.paymentMethod}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(expense)} className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No expenses recorded yet. Click the + button to add your first expense!
            </p>
          )}
        </CardContent>
      </Card>

      {!showForm && expenses.length > 0 && (
        <FloatingActionButton
          onClick={() => {
            console.log("[v0] FAB clicked - showing expense form")
            setShowForm(true)
          }}
        />
      )}
    </div>
  )
}
