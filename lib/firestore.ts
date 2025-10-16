// lib/firestore.ts
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Expense {
  id?: string;
  userId: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Income {
  id?: string;
  userId: string;
  date: Date;
  amount: number;
  source: string;
  frequency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Budget {
  id?: string;
  userId: string;
  category: string;
  amount: number;
  spent: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Goal {
  id?: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Investment {
  id?: string;
  userId: string;
  name: string;
  amount: number;
  date: Date;
  type: string;
  returnRate: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

// EXPENSES
export const expenseService = {
  async create(userId: string, expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'expenses'), {
      ...expense,
      userId,
      date: Timestamp.fromDate(expense.date),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getAll(userId: string): Promise<Expense[]> {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: convertTimestamp(doc.data().date),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Expense[];
  },

  async update(expenseId: string, expense: Partial<Expense>) {
    const docRef = doc(db, 'expenses', expenseId);
    await updateDoc(docRef, {
      ...expense,
      date: expense.date ? Timestamp.fromDate(expense.date) : undefined,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(expenseId: string) {
    await deleteDoc(doc(db, 'expenses', expenseId));
  },
};

// INCOMES
export const incomeService = {
  async create(userId: string, income: Omit<Income, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'incomes'), {
      ...income,
      userId,
      date: Timestamp.fromDate(income.date),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getAll(userId: string): Promise<Income[]> {
    const q = query(
      collection(db, 'incomes'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: convertTimestamp(doc.data().date),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Income[];
  },

  async update(incomeId: string, income: Partial<Income>) {
    const docRef = doc(db, 'incomes', incomeId);
    await updateDoc(docRef, {
      ...income,
      date: income.date ? Timestamp.fromDate(income.date) : undefined,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(incomeId: string) {
    await deleteDoc(doc(db, 'incomes', incomeId));
  },
};

// BUDGETS
export const budgetService = {
  async create(userId: string, budget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'budgets'), {
      ...budget,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getAll(userId: string): Promise<Budget[]> {
    const q = query(
      collection(db, 'budgets'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Budget[];
  },

  async update(budgetId: string, budget: Partial<Budget>) {
    const docRef = doc(db, 'budgets', budgetId);
    await updateDoc(docRef, {
      ...budget,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(budgetId: string) {
    await deleteDoc(doc(db, 'budgets', budgetId));
  },

  async updateSpent(userId: string) {
    // Get all expenses
    const expenses = await expenseService.getAll(userId);
    
    // Get all budgets
    const budgets = await this.getAll(userId);
    
    // Calculate spent per category
    const spentByCategory: { [key: string]: number } = {};
    expenses.forEach(expense => {
      spentByCategory[expense.category] = (spentByCategory[expense.category] || 0) + expense.amount;
    });
    
    // Update each budget
    for (const budget of budgets) {
      if (budget.id) {
        await this.update(budget.id, {
          spent: spentByCategory[budget.category] || 0,
        });
      }
    }
  },
};

// GOALS
export const goalService = {
  async create(userId: string, goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'goals'), {
      ...goal,
      userId,
      deadline: Timestamp.fromDate(goal.deadline),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getAll(userId: string): Promise<Goal[]> {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      deadline: convertTimestamp(doc.data().deadline),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Goal[];
  },

  async update(goalId: string, goal: Partial<Goal>) {
    const docRef = doc(db, 'goals', goalId);
    await updateDoc(docRef, {
      ...goal,
      deadline: goal.deadline ? Timestamp.fromDate(goal.deadline) : undefined,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(goalId: string) {
    await deleteDoc(doc(db, 'goals', goalId));
  },
};

// INVESTMENTS
export const investmentService = {
  async create(userId: string, investment: Omit<Investment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'investments'), {
      ...investment,
      userId,
      date: Timestamp.fromDate(investment.date),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getAll(userId: string): Promise<Investment[]> {
    const q = query(
      collection(db, 'investments'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: convertTimestamp(doc.data().date),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    })) as Investment[];
  },

  async update(investmentId: string, investment: Partial<Investment>) {
    const docRef = doc(db, 'investments', investmentId);
    await updateDoc(docRef, {
      ...investment,
      date: investment.date ? Timestamp.fromDate(investment.date) : undefined,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(investmentId: string) {
    await deleteDoc(doc(db, 'investments', investmentId));
  },
};

// USER PROFILE
export const userService = {
  async createProfile(userId: string, data: { name: string; email: string }) {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      createdAt: serverTimestamp(),
    });
  },

  async getProfile(userId: string) {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? docSnap.data() : null;
  },

  async updateSettings(userId: string, settings: { currency?: string; theme?: string }) {
    await setDoc(doc(db, 'users', userId, 'settings', 'preferences'), {
      ...settings,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async getSettings(userId: string) {
    const docSnap = await getDoc(doc(db, 'users', userId, 'settings', 'preferences'));
    return docSnap.exists() ? docSnap.data() : { currency: '$', theme: 'light' };
  },
};