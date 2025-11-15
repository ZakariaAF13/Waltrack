import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useWallet } from '@/context/WalletContext';
import { TrendingDown, DollarSign } from 'lucide-react';

interface ExpenseAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: 'id' | 'en';
}

export function ExpenseAnalysisDialog({ open, onOpenChange, lang }: ExpenseAnalysisDialogProps) {
  const { transactions, stats } = useWallet();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate category breakdown
  const categoryBreakdown = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const avgExpense = stats.transactionCount > 0 
    ? stats.totalExpense / transactions.filter(t => t.type === 'expense').length 
    : 0;

  const t = {
    id: {
      title: 'Analisa Pengeluaran',
      totalExpense: 'Total Pengeluaran',
      avgExpense: 'Rata-rata Pengeluaran',
      topCategories: 'Kategori Teratas',
      noData: 'Belum ada data pengeluaran',
    },
    en: {
      title: 'Expense Analysis',
      totalExpense: 'Total Expenses',
      avgExpense: 'Average Expense',
      topCategories: 'Top Categories',
      noData: 'No expense data yet',
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t[lang].title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={18} className="text-red-600" />
                  <span className="text-xs text-muted-foreground">{t[lang].totalExpense}</span>
                </div>
                <p className="text-lg font-bold text-red-600">{formatCurrency(stats.totalExpense)}</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={18} className="text-blue-600" />
                  <span className="text-xs text-muted-foreground">{t[lang].avgExpense}</span>
                </div>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(avgExpense)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="font-semibold mb-3">{t[lang].topCategories}</h3>
            {sortedCategories.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t[lang].noData}</p>
            ) : (
              <div className="space-y-2">
                {sortedCategories.map(([category, amount]) => {
                  const percentage = (amount / stats.totalExpense) * 100;
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{category}</span>
                        <span className="text-muted-foreground">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-2 bg-accent rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
