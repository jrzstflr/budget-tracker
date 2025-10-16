"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { incomeService, type Income } from "@/lib/firestore"
import { useAuth } from "@/contexts/AuthContext"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function IncomeTracker() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [newIncome, setNewIncome] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    source: "",
    frequency: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadIncomes()
    }
  }, [user])

  const loadIncomes = async () => {
    if (!user) return
    try {
      const loadedIncomes = await incomeService.getAll(user.uid)
      setIncomes(loadedIncomes)
    } catch (error) {
      console.error("Error loading incomes:", error)
      toast({
        title: "Error",
        description: "Failed to load incomes",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewIncome((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewIncome((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add income",
        variant: "destructive",
      })
      return
    }

    if (!newIncome.amount || !newIncome.source || !newIncome.frequency) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const incomeData = {
        date: new Date(newIncome.date),
        amount: Number(newIncome.amount),
        source: newIncome.source,
        frequency: newIncome.frequency,
      }

      if (editingId) {
        await incomeService.update(editingId, incomeData)
        toast({
          title: "Success",
          description: "Income updated successfully!",
        })
      } else {
        await incomeService.create(user.uid, incomeData)
        toast({
          title: "Success",
          description: "Income added successfully!",
        })
      }

      await loadIncomes()
      setNewIncome({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        source: "",
        frequency: "",
      })
      setEditingId(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error saving income:", error)
      toast({
        title: "Error",
        description: "Failed to save income",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income?")) return

    setLoading(true)

    try {
      await incomeService.delete(id)
      await loadIncomes()
      toast({
        title: "Success",
        description: "Income deleted successfully!",
      })
    } catch (error) {
      console.error("Error deleting income:", error)
      toast({
        title: "Error",
        description: "Failed to delete income",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    const incomeToEdit = incomes.find((income) => income.id === id)
    if (incomeToEdit) {
      setNewIncome({
        date: incomeToEdit.date.toISOString().split("T")[0],
        amount: incomeToEdit.amount.toString(),
        source: incomeToEdit.source,
        frequency: incomeToEdit.frequency,
      })
      setEditingId(id)
      setShowForm(true)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewIncome({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      source: "",
      frequency: "",
    })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      {(showForm || !incomes.length) && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Income" : "Add New Income"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="date" name="date" value={newIncome.date} onChange={handleInputChange} required />
              <Input
                type="number"
                name="amount"
                placeholder="Amount (PHP)"
                value={newIncome.amount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
              <Input
                type="text"
                name="source"
                placeholder="Source"
                value={newIncome.source}
                onChange={handleInputChange}
                required
              />
              <Select
                name="frequency"
                value={newIncome.frequency}
                onValueChange={(value) => handleSelectChange("frequency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One-time">One-time</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Saving..." : editingId ? "Update Income" : "Add Income"}
                </Button>
                {(editingId || showForm) && (
                  <Button type="button" variant="outline" onClick={cancelEdit} disabled={loading}>
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
          <CardTitle>Income List</CardTitle>
        </CardHeader>
        <CardContent>
          {incomes.length > 0 ? (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount (PHP)</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomes
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((income) => (
                        <TableRow key={income.id}>
                          <TableCell>{new Date(income.date).toISOString().split("T")[0]}</TableCell>
                          <TableCell>₱{Number(income.amount).toFixed(2)}</TableCell>
                          <TableCell>{income.source}</TableCell>
                          <TableCell>{income.frequency}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(income.id!)}
                                disabled={loading}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(income.id!)}
                                disabled={loading}
                              >
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
                {incomes
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((income) => (
                    <Card key={income.id} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-lg">₱{Number(income.amount).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(income.date).toISOString().split("T")[0]}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded-full">
                            {income.frequency}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{income.source}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(income.id!)}
                            className="flex-1"
                            disabled={loading}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(income.id!)}
                            className="flex-1"
                            disabled={loading}
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
            <p className="text-center text-muted-foreground py-8">No income recorded yet</p>
          )}
        </CardContent>
      </Card>

      {!showForm && incomes.length > 0 && (
        <FloatingActionButton
          onClick={() => {
            setShowForm(true)
          }}
        />
      )}
    </div>
  )
}
