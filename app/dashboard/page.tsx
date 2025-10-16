// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import ExpenseTracker from '@/components/ExpenseTracker';
import IncomeTracker from '@/components/IncomeTracker';
import Reports from '@/components/Reports';
import BudgetPlanner from '@/components/BudgetPlanner';
import Goals from '@/components/Goals';
import Investments from '@/components/Investments';
import Settings from '@/components/Settings';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from '@/components/UserMenu';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'income':
        return <IncomeTracker />;
      case 'reports':
        return <Reports />;
      case 'budget':
        return <BudgetPlanner />;
      case 'goals':
        return <Goals />;
      case 'investments':
        return <Investments />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0">
        {/* Top Bar with Theme Toggle & User Menu */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 lg:top-6 lg:right-6">
          <ThemeToggle />
          <UserMenu />
        </div>

        <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}