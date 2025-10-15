"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Dashboard from '@/components/Dashboard'
import ExpenseTracker from '@/components/ExpenseTracker'
import IncomeTracker from '@/components/IncomeTracker'
import Reports from '@/components/Reports'
import BudgetPlanner from '@/components/BudgetPlanner'
import Goals from '@/components/Goals'
import Investments from '@/components/Investments'
import Settings from '@/components/Settings'

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Jrz Budget Tracker Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard"><Dashboard /></TabsContent>
        <TabsContent value="expenses"><ExpenseTracker /></TabsContent>
        <TabsContent value="income"><IncomeTracker /></TabsContent>
        <TabsContent value="reports"><Reports /></TabsContent>
        <TabsContent value="budget"><BudgetPlanner /></TabsContent>
        <TabsContent value="goals"><Goals /></TabsContent>
        <TabsContent value="investments"><Investments /></TabsContent>
        <TabsContent value="settings"><Settings /></TabsContent>
      </Tabs>
    </main>
  )
}
