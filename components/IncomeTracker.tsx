"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { incomeStorage, type Income } from "@/lib/storage"

export default function IncomeTracker() {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [newIncome, setNewIncome] = useState<Omit<Income, "id">>({
    date: new Date().toISOString().split("T")[0],
    amount: "" as any,
    source: "",
    frequency: "",
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    const loadedIncomes = incomeStorage.getAll()
    setIncomes(loadedIncomes)
  }, [])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId !== null) {
      const updatedIncome: Income = {
        id: editingId,
        ...newIncome,
        amount: Number(newIncome.amount),
      }
      incomeStorage.update(editingId, updatedIncome)
      setIncomes((prev) => prev.map((income) => (income.id === editingId ? updatedIncome : income)))
      setEditingId(null)
    } else {
      const incomeWithId: Income = {
        id: Date.now(),
        ...newIncome,
        amount: Number(newIncome.amount),
      }
      incomeStorage.add(incomeWithId)
      setIncomes((prev) => [...prev, incomeWithId])
    }

    setNewIncome({
      date: new Date().toISOString().split("T")[0],
      amount: "" as any,
      source: "",
      frequency: "",
    })
  }

  const handleDelete = (id: number) => {
    incomeStorage.delete(id)
    setIncomes((prev) => prev.filter((income) => income.id !== id))
  }

  const handleEdit = (id: number) => {
    const incomeToEdit = incomes.find((income) => income.id === id)
    if (incomeToEdit) {
      setNewIncome({
        date: incomeToEdit.date,
        amount: incomeToEdit.amount as any,
        source: incomeToEdit.source,
        frequency: incomeToEdit.frequency,
      })
      setEditingId(id)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
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
              <Button type="submit">{editingId ? "Update Income" : "Add Income"}</Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setNewIncome({
                      date: new Date().toISOString().split("T")[0],
                      amount: "" as any,
                      source: "",
                      frequency: "",
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
          <CardTitle>Income List</CardTitle>
        </CardHeader>
        <CardContent>
          {incomes.length > 0 ? (
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
                      <TableCell>{income.date}</TableCell>
                      <TableCell>₱{Number(income.amount).toFixed(2)}</TableCell>
                      <TableCell>{income.source}</TableCell>
                      <TableCell>{income.frequency}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(income.id)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(income.id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No income recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
