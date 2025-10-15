"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { investmentStorage, type Investment } from "@/lib/storage"

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [newInvestment, setNewInvestment] = useState<Omit<Investment, "id">>({
    name: "",
    amount: "" as any,
    date: new Date().toISOString().split("T")[0],
    type: "",
    returnRate: "" as any,
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    const loadedInvestments = investmentStorage.getAll()
    setInvestments(loadedInvestments)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewInvestment((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewInvestment((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId !== null) {
      const updatedInvestment: Investment = {
        id: editingId,
        ...newInvestment,
        amount: Number(newInvestment.amount),
        returnRate: Number(newInvestment.returnRate),
      }
      investmentStorage.update(editingId, updatedInvestment)
      setInvestments((prev) => prev.map((inv) => (inv.id === editingId ? updatedInvestment : inv)))
      setEditingId(null)
    } else {
      const investmentWithId: Investment = {
        ...newInvestment,
        id: Date.now(),
        amount: Number(newInvestment.amount),
        returnRate: Number(newInvestment.returnRate),
      }
      investmentStorage.add(investmentWithId)
      setInvestments((prev) => [...prev, investmentWithId])
    }

    setNewInvestment({
      name: "",
      amount: "" as any,
      date: new Date().toISOString().split("T")[0],
      type: "",
      returnRate: "" as any,
    })
  }

  const handleDelete = (id: number) => {
    investmentStorage.delete(id)
    setInvestments((prev) => prev.filter((inv) => inv.id !== id))
  }

  const handleEdit = (id: number) => {
    const investmentToEdit = investments.find((inv) => inv.id === id)
    if (investmentToEdit) {
      setNewInvestment({
        name: investmentToEdit.name,
        amount: investmentToEdit.amount as any,
        date: investmentToEdit.date,
        type: investmentToEdit.type,
        returnRate: investmentToEdit.returnRate as any,
      })
      setEditingId(id)
    }
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Investment" : "Add New Investment"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Investment Name"
              value={newInvestment.name}
              onChange={handleInputChange}
              required
            />
            <Input
              type="number"
              name="amount"
              placeholder="Amount (PHP)"
              value={newInvestment.amount}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
            <Input type="date" name="date" value={newInvestment.date} onChange={handleInputChange} required />
            <Select name="type" value={newInvestment.type} onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select investment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Stocks">Stocks</SelectItem>
                <SelectItem value="Bonds">Bonds</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                <SelectItem value="Mutual Funds">Mutual Funds</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              name="returnRate"
              placeholder="Expected Return Rate (%)"
              value={newInvestment.returnRate}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Update Investment" : "Add Investment"}</Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setNewInvestment({
                      name: "",
                      amount: "" as any,
                      date: new Date().toISOString().split("T")[0],
                      type: "",
                      returnRate: "" as any,
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
          <CardTitle>Investment Portfolio</CardTitle>
          <p className="text-sm text-muted-foreground">Total Invested: ₱{totalInvested.toFixed(2)}</p>
        </CardHeader>
        <CardContent>
          {investments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount (PHP)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Return Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell>{investment.name}</TableCell>
                      <TableCell>₱{investment.amount.toFixed(2)}</TableCell>
                      <TableCell>{investment.date}</TableCell>
                      <TableCell>{investment.type}</TableCell>
                      <TableCell>{investment.returnRate}%</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(investment.id)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(investment.id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No investments recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
