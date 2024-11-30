"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Expense {
  id: number;
  date: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    category: "",
    description: "",
    paymentMethod: "",
  });

  useEffect(() => {
    // Mock data
    setExpenses([
      {
        id: 1,
        date: "2024-01-01",
        amount: 50,
        category: "Food",
        description: "Groceries",
        paymentMethod: "Credit Card",
      },
      {
        id: 2,
        date: "2024-01-02",
        amount: 30,
        category: "Transportation",
        description: "Gas",
        paymentMethod: "Debit Card",
      },
    ]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const handleEdit = (id: number) => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    if (expenseToEdit) {
      setNewExpense({
        date: expenseToEdit.date,
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        description: expenseToEdit.description,
        paymentMethod: expenseToEdit.paymentMethod,
      });
      // Remove the expense temporarily for editing
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.prototype.hasOwnProperty.call(newExpense, "id")) {
      // Editing an existing expense
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === (newExpense as Expense).id ? (newExpense as Expense) : expense
        )
      );
    } else {
      // Adding a new expense
      const expenseWithId: Expense = {
        ...newExpense,
        id: Date.now(), // Ensure id is a number
      };
      setExpenses((prev) => [...prev, expenseWithId]);
    }

    // Reset the form
    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      category: "",
      description: "",
      paymentMethod: "",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="date"
              name="date"
              value={newExpense.date}
              onChange={handleInputChange}
              required
            />
            <Input
              type="number"
              name="amount"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={handleInputChange}
              required
            />
            <Select
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
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
              onValueChange={(value) =>
                handleSelectChange("paymentMethod", value)
              }
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
            <Button type="submit">Add Expense</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(expense.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
