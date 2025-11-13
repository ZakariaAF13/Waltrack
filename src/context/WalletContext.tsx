import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, WalletStats, Category } from '@/types';

interface WalletContextType {
  transactions: Transaction[];
  categories: Category[];
  stats: WalletStats;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: '1', name: 'Gaji', type: 'income', icon: '💰', color: '#10b981' },
  { id: '2', name: 'Freelance', type: 'income', icon: '💼', color: '#3b82f6' },
  { id: '3', name: 'Investasi', type: 'income', icon: '📈', color: '#8b5cf6' },
  { id: '4', name: 'Makanan', type: 'expense', icon: '🍔', color: '#ef4444' },
  { id: '5', name: 'Transport', type: 'expense', icon: '🚗', color: '#f59e0b' },
  { id: '6', name: 'Belanja', type: 'expense', icon: '🛒', color: '#ec4899' },
  { id: '7', name: 'Hiburan', type: 'expense', icon: '🎮', color: '#6366f1' },
  { id: '8', name: 'Tagihan', type: 'expense', icon: '📱', color: '#14b8a6' },
];

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('waltrack-transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    localStorage.setItem('waltrack-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const stats: WalletStats = React.useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (id: string, updatedData: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    );
  };

  return (
    <WalletContext.Provider
      value={{
        transactions,
        categories,
        stats,
        addTransaction,
        deleteTransaction,
        updateTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
