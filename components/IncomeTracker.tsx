"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface Income {
  id: number;
  date: string;
  amount: number;
  source: string;
  frequency: string;
}

export default function IncomeTracker() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [newIncome, setNewIncome] = useState<Omit<Income, "id">>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    source: "",
    frequency: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to prevent hydration mismatch
    const loadInitialData = async () => {
      // Mock data
      const initialData = [
        {
          id: 1,
          date: "2024-01-01",
          amount: 3000,
          source: "Salary",
          frequency: "Monthly",
        },
        {
          id: 2,
          date: "2024-01-15",
          amount: 500,
          source: "Freelance",
          frequency: "One-time",
        },
      ];
      setIncomes(initialData);
      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIncome((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewIncome((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingIncomeIndex = incomes.findIndex(
      (income) =>
        income.date === newIncome.date &&
        income.source === newIncome.source &&
        income.frequency === newIncome.frequency
    );

    if (existingIncomeIndex !== -1) {
      setIncomes((prev) =>
        prev.map((income, index) =>
          index === existingIncomeIndex
            ? { ...income, amount: Number(newIncome.amount) }
            : income
        )
      );
    } else {
      const incomeWithId: Income = {
        id: Date.now(),
        ...newIncome,
        amount: Number(newIncome.amount),
      };
      setIncomes((prev) => [...prev, incomeWithId]);
    }

    setNewIncome({
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      source: "",
      frequency: "",
    });
  };

  const handleDelete = (id: number) => {
    setIncomes((prev) => prev.filter((income) => income.id !== id));
  };

  const handleEdit = (id: number) => {
    const incomeToEdit = incomes.find((income) => income.id === id);
    if (incomeToEdit) {
      const { id, ...rest } = incomeToEdit; // Remove `id` since `newIncome` doesn't have it
      setNewIncome(rest);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Income</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="date"
              name="date"
              value={newIncome.date}
              onChange={handleInputChange}
              required
            />
            <Input
              type="number"
              name="amount"
              placeholder="Amount"
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
            <Button type="submit">
              {incomes.some((income) =>
                income.date === newIncome.date &&
                income.source === newIncome.source
              )
                ? "Update Income"
                : "Add Income"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Income List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>{income.date}</TableCell>
                  <TableCell>${Number(income.amount).toFixed(2)}</TableCell>
                  <TableCell>{income.source}</TableCell>
                  <TableCell>{income.frequency}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(income.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(income.id)}
                      >
                        Delete
                      </Button>
                    </div>
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
