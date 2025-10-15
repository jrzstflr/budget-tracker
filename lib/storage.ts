// Interfaces
export interface Expense {
  id: number
  date: string
  amount: number
  category: string
  description: string
  paymentMethod: string
}

export interface Income {
  id: number
  date: string
  amount: number
  source: string
  frequency: string
}

export interface Budget {
  id: number
  category: string
  amount: number
  spent: number
}

export interface Goal {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

export interface Investment {
  id: number
  name: string
  amount: number
  date: string
  type: string
  returnRate: number
}

export interface Settings {
  currency: string
  email: string
  theme: string
}

// Storage keys
const STORAGE_KEYS = {
  EXPENSES: "budget-tracker-expenses",
  INCOMES: "budget-tracker-incomes",
  BUDGETS: "budget-tracker-budgets",
  GOALS: "budget-tracker-goals",
  INVESTMENTS: "budget-tracker-investments",
  SETTINGS: "budget-tracker-settings",
}

// Generic storage functions
export const storage = {
  // Get data from localStorage
  get: (<T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  }),

  // Set data to localStorage
  set: (<T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('storage-update', { detail: { key } }))
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
    }
  }),

  // Remove data from localStorage
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(key)
      window.dispatchEvent(new CustomEvent('storage-update', { detail: { key } }))
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  },

  // Clear all app data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => storage.remove(key))
  },
}

// Specific data access functions
export const expenseStorage = {
  getAll: (): Expense[] => storage.get(STORAGE_KEYS.EXPENSES, []),
  save: (expenses: Expense[]): void => storage.set(STORAGE_KEYS.EXPENSES, expenses),
  add: (expense: Expense): void => {
    const expenses = expenseStorage.getAll()
    expenseStorage.save([...expenses, expense])
  },
  update: (id: number, updatedExpense: Expense): void => {
    const expenses = expenseStorage.getAll()
    expenseStorage.save(expenses.map((e) => (e.id === id ? updatedExpense : e)))
  },
  delete: (id: number): void => {
    const expenses = expenseStorage.getAll()
    expenseStorage.save(expenses.filter((e) => e.id !== id))
  },
}

export const incomeStorage = {
  getAll: (): Income[] => storage.get(STORAGE_KEYS.INCOMES, []),
  save: (incomes: Income[]): void => storage.set(STORAGE_KEYS.INCOMES, incomes),
  add: (income: Income): void => {
    const incomes = incomeStorage.getAll()
    incomeStorage.save([...incomes, income])
  },
  update: (id: number, updatedIncome: Income): void => {
    const incomes = incomeStorage.getAll()
    incomeStorage.save(incomes.map((i) => (i.id === id ? updatedIncome : i)))
  },
  delete: (id: number): void => {
    const incomes = incomeStorage.getAll()
    incomeStorage.save(incomes.filter((i) => i.id !== id))
  },
}

export const budgetStorage = {
  getAll: (): Budget[] => storage.get(STORAGE_KEYS.BUDGETS, []),
  save: (budgets: Budget[]): void => storage.set(STORAGE_KEYS.BUDGETS, budgets),
  add: (budget: Budget): void => {
    const budgets = budgetStorage.getAll()
    budgetStorage.save([...budgets, budget])
  },
  update: (id: number, updatedBudget: Budget): void => {
    const budgets = budgetStorage.getAll()
    budgetStorage.save(budgets.map((b) => (b.id === id ? updatedBudget : b)))
  },
  delete: (id: number): void => {
    const budgets = budgetStorage.getAll()
    budgetStorage.save(budgets.filter((b) => b.id !== id))
  },
}

export const goalStorage = {
  getAll: (): Goal[] => storage.get(STORAGE_KEYS.GOALS, []),
  save: (goals: Goal[]): void => storage.set(STORAGE_KEYS.GOALS, goals),
  add: (goal: Goal): void => {
    const goals = goalStorage.getAll()
    goalStorage.save([...goals, goal])
  },
  update: (id: number, updatedGoal: Goal): void => {
    const goals = goalStorage.getAll()
    goalStorage.save(goals.map((g) => (g.id === id ? updatedGoal : g)))
  },
  delete: (id: number): void => {
    const goals = goalStorage.getAll()
    goalStorage.save(goals.filter((g) => g.id !== id))
  },
}

export const investmentStorage = {
  getAll: (): Investment[] => storage.get(STORAGE_KEYS.INVESTMENTS, []),
  save: (investments: Investment[]): void => storage.set(STORAGE_KEYS.INVESTMENTS, investments),
  add: (investment: Investment): void => {
    const investments = investmentStorage.getAll()
    investmentStorage.save([...investments, investment])
  },
  update: (id: number, updatedInvestment: Investment): void => {
    const investments = investmentStorage.getAll()
    investmentStorage.save(investments.map((i) => (i.id === id ? updatedInvestment : i)))
  },
  delete: (id: number): void => {
    const investments = investmentStorage.getAll()
    investmentStorage.save(investments.filter((i) => i.id !== id))
  },
}

export const settingsStorage = {
  get: (): Settings =>
    storage.get(STORAGE_KEYS.SETTINGS, { currency: '$', email: '', theme: 'light' }),
  save: (settings: Settings): void => storage.set(STORAGE_KEYS.SETTINGS, settings),
}

// Helper function to calculate budget spent amounts based on expenses
export const updateBudgetSpent = (): void => {
  const expenses = expenseStorage.getAll()
  const budgets = budgetStorage.getAll()

  const updatedBudgets = budgets.map((budget) => {
    const categoryExpenses = expenses.filter((e) => e.category === budget.category)
    const spent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
    return { ...budget, spent }
  })

  budgetStorage.save(updatedBudgets)
}
