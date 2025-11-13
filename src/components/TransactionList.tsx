import { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWallet } from '@/context/WalletContext';
import { Transaction } from '@/types';
import { cn } from '@/lib/utils';

export const TransactionList = () => {
  const { transactions, deleteTransaction, categories } = useWallet();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category?.icon || '💰';
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Riwayat Transaksi</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Semua
            </Button>
            <Button
              variant={filter === 'income' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('income')}
            >
              Pemasukan
            </Button>
            <Button
              variant={filter === 'expense' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('expense')}
            >
              Pengeluaran
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Belum ada transaksi</p>
              <p className="text-sm text-muted-foreground">
                Tambahkan transaksi pertama Anda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onDelete={handleDelete}
                  formatCurrency={formatCurrency}
                  getCategoryIcon={getCategoryIcon}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
  getCategoryIcon: (categoryName: string) => string;
}

const TransactionItem = ({
  transaction,
  onDelete,
  formatCurrency,
  getCategoryIcon,
}: TransactionItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full text-2xl',
            transaction.type === 'income'
              ? 'bg-green-500/10'
              : 'bg-red-500/10'
          )}
        >
          {getCategoryIcon(transaction.category)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{transaction.description}</p>
            <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
              {transaction.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: id })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p
            className={cn(
              'text-lg font-bold',
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
          <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            {transaction.type === 'income' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Transaksi akan dihapus
                secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(transaction.id)}>
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
