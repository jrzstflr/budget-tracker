"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Investment {
  id: number
  name: string
  amount: number
  date: string
  type: string
  returnRate: number
}

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [newInvestment, setNewInvestment] = useState<Omit<Investment, 'id'>>({
    name: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: '',
    returnRate: 0,
  })

  useEffect(() => {
    // Fetch investments from API or local storage
    // For now, we'll use mock data
    setInvestments([
      { id: 1, name: 'Stock A', amount: 1000, date: '2024-01-01', type: 'Stocks', returnRate: 7 },
      { id: 2, name: 'Real Estate Fund', amount: 5000, date: '2024-01-15', type: 'Real Estate', returnRate: 5 },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewInvestment(prev => ({ ...prev, [name]: name === 'amount' || name === 'returnRate' ? parseFloat(value) : value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewInvestment(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const investmentWithId = { ...newInvestment, id: Date.now() }
    setInvestments(prev => [...prev, investmentWithId])
    setNewInvestment({
      name: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: '',
      returnRate: 0,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Investment</CardTitle>
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
              placeholder="Amount"
              value={newInvestment.amount}
              onChange={handleInputChange}
              required
            />
            <Input
              type="date"
              name="date"
              value={newInvestment.date}
              onChange={handleInputChange}
              required
            />
            <Select name="type" onValueChange={(value) => handleSelectChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select investment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Stocks">Stocks</SelectItem>
                <SelectItem value="Bonds">Bonds</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
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
            />
            <Button type="submit">Add Investment</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Investment List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Return Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>{investment.name}</TableCell>
                  <TableCell>${investment.amount.toFixed(2)}</TableCell>
                  <TableCell>{investment.date}</TableCell>
                  <TableCell>{investment.type}</TableCell>
                  <TableCell>{investment.returnRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

