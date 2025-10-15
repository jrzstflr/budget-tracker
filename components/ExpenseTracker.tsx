"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { expenseStorage, updateBudgetSpent, type Expense } from "@/lib/storage"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { Search, Edit, Trash2 } from "lucide-react"

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    date: new Date().toISOString().split("T")[0],
    amount: "" as any,
    category: "",
    description: "",
    paymentMethod: "",
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Format numbers as Philippine Peso
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount)

  useEffect(() => {
    const loadedExpenses = expenseStorage.getAll()
    setExpenses(loadedExpenses)
    setFilteredExpenses(loadedExpenses)
  }, [])

  useEffect(() => {
    const filtered = expenses.filter(
      (expense) =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredExpenses(filtered)
  }, [searchTerm, expenses])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewExpense((prev) => ({
      ...prev,
      [name]: name === "amount" ? value : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewExpense((prev) => ({ ...prev, [name]: value }))
  }

  const handleDelete = (id: number) => {
    expenseStorage.delete(id)
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    updateBudgetSpent()
  }

  const handleEdit = (id: number) => {
    const expenseToEdit = expenses.find((expense) => expense.id === id)
    if (expenseToEdit) {
      setNewExpense({
        date: expenseToEdit.date,
        amount: expenseToEdit.amount as any,
        category: expenseToEdit.category,
        description: expenseToEdit.description,
        paymentMethod: expenseToEdit.paymentMethod,
      })
      setEditingId(id)
      setShowForm(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId !== null) {
      const updatedExpense: Expense = {
        id: editingId,
        ...newExpense,
        amount: Number(newExpense.amount),
      }
      expenseStorage.update(editingId, updatedExpense)
      setExpenses((prev) => prev.map((expense) => (expense.id === editingId ? updatedExpense : expense)))
      setEditingId(null)
    } else {
      const expenseWithId: Expense = {
        ...newExpense,
        id: Date.now(),
        amount: Number(newExpense.amount),
      }
      expenseStorage.add(expenseWithId)
      setExpenses((prev) => [...prev, expenseWithId])
    }

    updateBudgetSpent()

    // Reset form
    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      amount: "" as any,
      category: "",
      description: "",
      paymentMethod: "",
    })
    setShowForm(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      amount: "" as any,
      category: "",
      description: "",
      paymentMethod: "",
    })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      {(showForm || !expenses.length) && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Expense" : "Add New Expense"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="date" name="date" value={newExpense.date} onChange={handleInputChange} required />
              <Input
                type="number"
                name="amount"
                placeholder="Amount (₱)"
                value={newExpense.amount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
              <Select value={newExpense.category} onValueChange={(value) => handleSelectChange("category", value)}>
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
                name="description"
                placeholder="Description"
                value={newExpense.description}
                onChange={handleInputChange}
                required
              />
              <Select
                value={newExpense.paymentMethod}
                onValueChange={(value) => handleSelectChange("paymentMethod", value)}
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
                <Button type="submit" className="flex-1">
                  {editingId ? "Update Expense" : "Add Expense"}
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

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Expense List</CardTitle>
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length > 0 ? (
            <>
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
                    {filteredExpenses
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell>{formatCurrency(expense.amount)}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>{expense.paymentMethod}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(expense.id)}>
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

              <div className="md:hidden space-y-3">
                {filteredExpenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense) => (
                    <Card key={expense.id} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-lg">{formatCurrency(expense.amount)}</p>
                            <p className="text-sm text-muted-foreground">{expense.date}</p>
                          </div>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {expense.category}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{expense.description}</p>
                        <p className="text-xs text-muted-foreground mb-3">{expense.paymentMethod}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(expense.id)} className="flex-1">
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
              {searchTerm ? "No expenses match your search" : "No expenses recorded yet"}
            </p>
          )}
        </CardContent>
      </Card>

      {!showForm && expenses.length > 0 && <FloatingActionButton onClick={() => setShowForm(true)} />}
    </div>
  )
}
