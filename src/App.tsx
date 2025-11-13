import './App.css';
import { WalletProvider } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { AddTransactionDialog } from './components/AddTransactionDialog';
import { TransactionList } from './components/TransactionList';
import { ExpenseChart } from './components/ExpenseChart';
import { IncomeExpenseChart } from './components/IncomeExpenseChart';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                  Kelola dan pantau keuangan Anda dengan mudah
                </p>
              </div>
              <AddTransactionDialog />
            </div>

            {/* Stats Cards */}
            <Dashboard />

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <IncomeExpenseChart />
              <ExpenseChart />
            </div>

            {/* Transaction List */}
            <TransactionList />
          </div>
        </main>
        <Toaster />
      </div>
    </WalletProvider>
  );
}

export default App;
