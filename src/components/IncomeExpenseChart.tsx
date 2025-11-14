import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/context/WalletContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { analyzeTransactions } from '@/utils/analyticsClient';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';

export const IncomeExpenseChart = () => {
  const { transactions } = useWallet();
  const [chartData, setChartData] = useState<Array<{ month: string; Pemasukan: number; Pengeluaran: number }>>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const tx = transactions.map((t) => ({
          ...t,
          date: t.date instanceof Date ? t.date.toISOString() : (t.date as any),
        }));
        const res = await analyzeTransactions(tx as any, 6);
        const rows = res.monthlySeries.map((m) => {
          const [year, month] = m.monthKey.split('-').map(Number);
          const d = new Date(year, (month || 1) - 1, 1);
          return {
            month: format(d, 'MMM yyyy', { locale: id }),
            Pemasukan: m.income,
            Pengeluaran: m.expense,
          };
        });
        setChartData(rows);
      } catch (_) {
        const now = new Date();
        const sixMonthsAgo = subMonths(now, 5);
        const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });
        const rows = months.map((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const monthTransactions = transactions.filter((t) => {
            const tDate = new Date(t.date);
            return tDate >= monthStart && tDate <= monthEnd;
          });
          const income = monthTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          const expense = monthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
          return {
            month: format(month, 'MMM yyyy', { locale: id }),
            Pemasukan: income,
            Pengeluaran: expense,
          };
        });
        setChartData(rows);
      }
    };
    run();
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemasukan vs Pengeluaran (6 Bulan Terakhir)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Bar dataKey="Pemasukan" fill="#10b981" />
            <Bar dataKey="Pengeluaran" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
