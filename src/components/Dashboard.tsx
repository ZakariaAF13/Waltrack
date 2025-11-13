import { useWallet } from '@/context/WalletContext';
import { StatsCard } from './StatsCard';
import { Wallet, TrendingUp, TrendingDown, Receipt } from 'lucide-react';

export const Dashboard = () => {
  const { stats } = useWallet();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Saldo"
        value={formatCurrency(stats.balance)}
        icon={Wallet}
        className="bg-gradient-to-br from-blue-500/10 to-blue-600/10"
      />
      <StatsCard
        title="Total Pemasukan"
        value={formatCurrency(stats.totalIncome)}
        icon={TrendingUp}
        className="bg-gradient-to-br from-green-500/10 to-green-600/10"
      />
      <StatsCard
        title="Total Pengeluaran"
        value={formatCurrency(stats.totalExpense)}
        icon={TrendingDown}
        className="bg-gradient-to-br from-red-500/10 to-red-600/10"
      />
      <StatsCard
        title="Transaksi"
        value={stats.transactionCount.toString()}
        icon={Receipt}
        className="bg-gradient-to-br from-purple-500/10 to-purple-600/10"
      />
    </div>
  );
};
