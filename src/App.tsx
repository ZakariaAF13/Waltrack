import './App.css';
import { useState, useEffect, lazy, Suspense } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, PlusCircle, BarChart2, User, Camera, Sun, Moon, Globe, History, Wallet, ArrowDownCircle, ArrowUpCircle, ListOrdered, Search, Download, ChevronRight, TrendingDown, Calendar, Lock, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddTransactionDialog } from './components/AddTransactionDialog';
import { ProfileEditDialog } from './components/ProfileEditDialog';
import { ExpenseAnalysisDialog } from './components/ExpenseAnalysisDialog';
import { BudgetPlanDialog } from './components/BudgetPlanDialog';
import { ChangePinDialog } from './components/ChangePinDialog';
import { Toaster } from './components/ui/toaster';
import { Sidebar } from './components/Sidebar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './components/ui/alert-dialog';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const LazyIncomeExpenseChart = lazy(() =>
  import('./components/IncomeExpenseChart').then((m) => ({ default: m.IncomeExpenseChart }))
);
const LazyExpenseChart = lazy(() =>
  import('./components/ExpenseChart').then((m) => ({ default: m.ExpenseChart }))
);

function WaltrackContent() {
  const { transactions, stats } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'reports' | 'profile' | 'history'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [historyQuery, setHistoryQuery] = useState('');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Profile state
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User Waltrack');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || 'user@waltrack.app');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showExpenseAnalysis, setShowExpenseAnalysis] = useState(false);
  const [showBudgetPlan, setShowBudgetPlan] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const isWithinPreset = (date: Date) => {
    const now = new Date();
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (datePreset === 'all') return true;
    if (datePreset === 'today') return d.getTime() === today.getTime();
    if (datePreset === 'week') {
      const day = today.getDay(); // 0-6
      const diffToMonday = (day + 6) % 7; // Monday as start
      const monday = new Date(today);
      monday.setDate(today.getDate() - diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return d >= monday && d <= sunday;
    }
    if (datePreset === 'month') {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return d >= first && d <= last;
    }
    // custom
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000);
      const ds = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const de = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      return d >= ds && d <= de;
    }
    return true;
  };

  const filteredHistory = transactions
    .filter((tn) => (historyFilter === 'all' ? true : tn.type === historyFilter))
    .filter((tn) => {
      if (!historyQuery.trim()) return true;
      const q = historyQuery.toLowerCase();
      return tn.description.toLowerCase().includes(q) || tn.category.toLowerCase().includes(q);
    })
    .filter((tn) => isWithinPreset(new Date(tn.date)));

  const grouped = (() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = todayStart.getDay();
    const diffToMonday = (day + 6) % 7;
    const monday = new Date(todayStart);
    monday.setDate(todayStart.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const firstOfMonth = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

    const sections: Record<'today' | 'week' | 'month' | 'earlier', typeof filteredHistory> = {
      today: [],
      week: [],
      month: [],
      earlier: [],
    };
    filteredHistory.forEach((tn) => {
      const d = new Date(tn.date);
      const only = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (only.getTime() === todayStart.getTime()) sections.today.push(tn);
      else if (only >= monday && only <= sunday) sections.week.push(tn);
      else if (only >= firstOfMonth) sections.month.push(tn);
      else sections.earlier.push(tn);
    });
    return sections;
  })();

  const exportCSV = () => {
    const rows = [
      ['Date', 'Type', 'Category', 'Description', 'Amount'],
      ...filteredHistory.map((tn) => [
        format(new Date(tn.date), 'yyyy-MM-dd'),
        tn.type,
        tn.category,
        tn.description.replace(/\n|\r/g, ' '),
        String(tn.amount),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'waltrack-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProcessReceipt = () => {
    alert('🔧 Placeholder: Integrasi Gemini API akan dilakukan di sini untuk memproses struk.');
    setShowModal(false);
    setUploadedFile(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleLang = () => {
    setLang(lang === 'id' ? 'en' : 'id');
  };

  const goToHistory = () => setActiveView('history');

  const handleProfileSave = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPin');
    localStorage.removeItem('monthlyBudget');
    localStorage.removeItem('savingsGoal');
    
    // Reset to defaults
    setUserName('User Waltrack');
    setUserEmail('user@waltrack.app');
    setActiveView('home');
    setShowLogoutConfirm(false);
    
    // In real app, would redirect to login page
    alert(lang === 'id' ? 'Anda telah keluar' : 'You have been logged out');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const t = {
    id: {
      title: 'Waltrack - Aplikasi Keuangan Modern',
      desc: 'Catat, pantau, dan kelola keuangan Anda dengan mudah.',
      saldo: 'Saldo',
      pemasukan: 'Pemasukan',
      pengeluaran: 'Pengeluaran',
      transaksi: 'Transaksi',
      laporan: 'Laporan',
      profil: 'Profil',
      scan: 'Scan Struk',
      proses: 'Proses Struk',
      batal: 'Batal',
      ubahTema: 'Ubah Tema',
      ubahBahasa: 'ID',
      jumlahTransaksi: 'Jumlah Transaksi',
      riwayatTransaksi: 'Riwayat Transaksi',
      semua: 'Semua',
      pemasukanShort: 'Pemasukan',
      pengeluaranShort: 'Pengeluaran',
      cariTransaksi: 'Cari transaksi...',
      hariIni: 'Hari ini',
      mingguIni: 'Minggu ini',
      bulanIni: 'Bulan ini',
      sebelumnya: 'Sebelumnya',
      rentangTanggal: 'Rentang tanggal',
      eksporCsv: 'Ekspor CSV',
      belumAdaTransaksi: 'Belum ada transaksi',
      tambahTransaksi: 'Tambah Transaksi',
      uploadStruk: 'Upload struk untuk diproses'
    },
    en: {
      title: 'Waltrack - Modern Finance App',
      desc: 'Track, monitor, and manage your finances easily.',
      saldo: 'Balance',
      pemasukan: 'Income',
      pengeluaran: 'Expenses',
      transaksi: 'Transactions',
      laporan: 'Reports',
      profil: 'Profile',
      scan: 'Scan Receipt',
      proses: 'Process Receipt',
      batal: 'Cancel',
      ubahTema: 'Toggle Theme',
      ubahBahasa: 'EN',
      jumlahTransaksi: 'Total Transactions',
      riwayatTransaksi: 'Transaction History',
      semua: 'All',
      pemasukanShort: 'Income',
      pengeluaranShort: 'Expenses',
      cariTransaksi: 'Search transactions...',
      hariIni: 'Today',
      mingguIni: 'This Week',
      bulanIni: 'This Month',
      sebelumnya: 'Earlier',
      rentangTanggal: 'Date range',
      eksporCsv: 'Export CSV',
      belumAdaTransaksi: 'No transactions yet',
      tambahTransaksi: 'Add Transaction',
      uploadStruk: 'Upload receipt to process'
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeView={activeView}
        onNavigate={setActiveView}
        lang={lang}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar (Mobile & Desktop) */}
        <header className="bg-background border-b border-border pt-[env(safe-area-inset-top)] py-3 sticky top-0 z-30">
          <div className="w-full max-w-3xl mx-auto px-3 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Brand on mobile */}
              <div className="flex items-center gap-2 md:hidden">
                <Wallet className="h-5 w-5 text-teal-600" />
                <span className="font-bold text-teal-600">Waltrack</span>
              </div>
              {/* Section title on md+ */}
              <h2 className="hidden md:block text-lg sm:text-xl lg:text-2xl font-semibold">
                {activeView === 'home' && t[lang].saldo}
                {activeView === 'reports' && t[lang].laporan}
                {activeView === 'history' && (lang === 'id' ? 'Riwayat Transaksi' : 'Transaction History')}
                {activeView === 'profile' && t[lang].profil}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleLang}>
                <Globe size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="hidden md:flex bg-teal-600 hover:bg-teal-700 gap-2"
                size="sm"
              >
                <PlusCircle size={16} />
                <span className="hidden lg:inline">{t[lang].tambahTransaksi}</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 py-4 md:py-6 pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pb-8 overflow-auto">
          <div className="w-full max-w-3xl mx-auto px-3 md:px-6 space-y-8">
        {/* Home View */}
        {activeView === 'home' && (
          <>
            <section id="dashboard" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-md rounded-2xl bg-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                      <Wallet size={20} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <h2 className="text-sm font-medium text-muted-foreground">{t[lang].saldo}</h2>
                  </div>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-2">{formatCurrency(stats.balance)}</p>
                </CardContent>
              </Card>
              <Card className="shadow-md rounded-2xl bg-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                      <ArrowDownCircle size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-sm font-medium text-muted-foreground">{t[lang].pemasukan}</h2>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{formatCurrency(stats.totalIncome)}</p>
                </CardContent>
              </Card>
              <Card className="shadow-md rounded-2xl bg-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                      <ArrowUpCircle size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-sm font-medium text-muted-foreground">{t[lang].pengeluaran}</h2>
                  </div>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{formatCurrency(stats.totalExpense)}</p>
                </CardContent>
              </Card>
              <Card className="shadow-md rounded-2xl bg-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                      <ListOrdered size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-sm font-medium text-muted-foreground">{t[lang].jumlahTransaksi}</h2>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">{stats.transactionCount}</p>
                </CardContent>
              </Card>
            </section>

            <section id="transactions" className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{t[lang].riwayatTransaksi}</h2>
                <Button variant="ghost" size="sm" className="text-teal-600 px-2" onClick={goToHistory}>
                  {lang === 'id' ? 'lihat semua' : 'view all'}
                </Button>
              </div>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <Card className="rounded-xl shadow-sm bg-card border-0">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">{t[lang].belumAdaTransaksi}</p>
                    </CardContent>
                  </Card>
                ) : (
                  transactions.slice(0, 10).map((tn) => (
                    <Card key={tn.id} className="rounded-xl shadow-sm hover:shadow-md bg-card transition border-0">
                      <CardContent className="flex justify-between items-center p-4">
                        <div>
                          <p className="font-semibold">{tn.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {tn.category} • {format(new Date(tn.date), 'dd MMM yyyy', { locale: idLocale })}
                          </p>
                        </div>
                        <p className={`font-bold ${tn.type === 'expense' ? 'text-red-500' : 'text-green-600'}`}>
                          {tn.type === 'expense' ? '-' : '+'}
                          {formatCurrency(tn.amount)}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {/* Reports View */}
        {activeView === 'reports' && (
          <section id="reports" className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">{t[lang].laporan}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Suspense
                fallback={
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-6 w-48" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                  </Card>
                }
              >
                <LazyIncomeExpenseChart />
              </Suspense>
              <Suspense
                fallback={
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-6 w-48" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                  </Card>
                }
              >
                <LazyExpenseChart />
              </Suspense>
            </div>
          </section>
        )}

        {/* History View */}
        {activeView === 'history' && (
          <section id="history" className="space-y-6">
            <h2 className="text-2xl font-bold">{lang === 'id' ? 'Riwayat Transaksi' : 'Transaction History'}</h2>
            
            {/* Controls */}
            <div className="space-y-3">
              {/* Search */}
              <div className="relative w-full">
                <input
                  className="w-full h-10 rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder={t[lang].cariTransaksi}
                  value={historyQuery}
                  onChange={(e) => setHistoryQuery(e.target.value)}
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              
              {/* Type Filter */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <Button variant={historyFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setHistoryFilter('all')}>
                  {t[lang].semua}
                </Button>
                <Button variant={historyFilter === 'income' ? 'default' : 'outline'} size="sm" onClick={() => setHistoryFilter('income')}>
                  {t[lang].pemasukanShort}
                </Button>
                <Button variant={historyFilter === 'expense' ? 'default' : 'outline'} size="sm" onClick={() => setHistoryFilter('expense')}>
                  {t[lang].pengeluaranShort}
                </Button>
              </div>
              
              {/* Date & Export */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  className="h-10 rounded-md border border-input bg-transparent px-2 text-sm flex-1"
                  value={datePreset}
                  onChange={(e) => setDatePreset(e.target.value as any)}
                >
                  <option value="all">{t[lang].semua}</option>
                  <option value="today">{t[lang].hariIni}</option>
                  <option value="week">{t[lang].mingguIni}</option>
                  <option value="month">{t[lang].bulanIni}</option>
                  <option value="custom">{t[lang].rentangTanggal}</option>
                </select>
                <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap" onClick={exportCSV}>
                  <Download size={16} /> {t[lang].eksporCsv}
                </Button>
              </div>
              
              {/* Custom Date Range */}
              {datePreset === 'custom' && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input type="date" className="h-10 rounded-md border border-input bg-transparent px-2 text-sm flex-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <span className="text-center sm:px-2">—</span>
                  <input type="date" className="h-10 rounded-md border border-input bg-transparent px-2 text-sm flex-1" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              )}
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredHistory.length === 0 ? (
                <Card className="rounded-xl shadow-sm bg-card border-0">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">{t[lang].belumAdaTransaksi}</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {(['today','week','month','earlier'] as const).map((key) => (
                    grouped[key].length > 0 && (
                      <div key={key} className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          {key === 'today' && t[lang].hariIni}
                          {key === 'week' && t[lang].mingguIni}
                          {key === 'month' && t[lang].bulanIni}
                          {key === 'earlier' && t[lang].sebelumnya}
                        </h3>
                        {grouped[key].map((tn) => (
                          <Card key={tn.id} className="rounded-xl shadow-sm hover:shadow-md bg-card transition border-0">
                            <CardContent className="flex justify-between items-center p-4">
                              <div className="flex items-center gap-3">
                                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${tn.type === 'expense' ? 'bg-red-100 dark:bg-red-900/40' : 'bg-green-100 dark:bg-green-900/40'}`}>
                                  {tn.type === 'expense' ? (
                                    <ArrowUpCircle size={18} className="text-red-600 dark:text-red-400" />
                                  ) : (
                                    <ArrowDownCircle size={18} className="text-green-600 dark:text-green-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">{tn.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(tn.date), 'dd MMM yyyy', { locale: idLocale })}
                                  </p>
                                  <div className="mt-1">
                                    <Badge variant="secondary" className="text-xs">{tn.category}</Badge>
                                  </div>
                                </div>
                              </div>
                              <p className={`${tn.type === 'expense' ? 'text-red-500' : 'text-green-600'} font-bold`}>
                                {tn.type === 'expense' ? '-' : '+'}
                                {formatCurrency(tn.amount)}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )
                  ))}
                </>
              )}
            </div>
          </section>
        )}

        {/* Profile View */}
        {activeView === 'profile' && (
          <section id="profile" className="space-y-6">
            {/* User Card */}
            <Card className="shadow-md rounded-2xl bg-card border-0 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowProfileEdit(true)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">{userName}</h3>
                      <p className="text-sm text-muted-foreground">{userEmail}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Menu List */}
            <div className="space-y-0 bg-card rounded-2xl shadow-md overflow-hidden">
              <button 
                onClick={() => setShowExpenseAnalysis(true)}
                className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors border-b border-border"
              >
                <TrendingDown size={20} className="text-muted-foreground" />
                <span className="font-medium">{lang === 'id' ? 'Analisa pengeluaran' : 'Expense Analysis'}</span>
              </button>
              <button 
                onClick={() => setShowBudgetPlan(true)}
                className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors border-b border-border"
              >
                <Calendar size={20} className="text-muted-foreground" />
                <span className="font-medium">{lang === 'id' ? 'rencanakan' : 'Planning'}</span>
              </button>
              <button 
                onClick={() => setShowChangePin(true)}
                className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors border-b border-border"
              >
                <Lock size={20} className="text-muted-foreground" />
                <span className="font-medium">{lang === 'id' ? 'ubah pin' : 'Change PIN'}</span>
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors"
              >
                <LogOut size={20} className="text-red-600" />
                <span className="font-medium text-red-600">{lang === 'id' ? 'akhiri sesi' : 'Logout'}</span>
              </button>
            </div>
          </section>
        )}

        {/* Modal Upload/Scan */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                className="bg-card rounded-2xl p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">{t[lang].scan}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t[lang].uploadStruk}</p>
                <input
                  type="file"
                  accept="image/*"
                  {...({ capture: 'environment' } as any)}
                  onChange={handleFileChange}
                  className="mb-4 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-900 dark:file:text-teal-100"
                />
                {uploadedFile && (
                  <p className="text-sm text-muted-foreground mb-4">📄 {uploadedFile.name}</p>
                )}
                <Button
                  onClick={handleProcessReceipt}
                  disabled={!uploadedFile}
                  className="w-full bg-teal-600 hover:bg-teal-700 mb-2"
                >
                  {t[lang].proses}
                </Button>
                <Button onClick={() => setShowModal(false)} variant="outline" className="w-full">
                  {t[lang].batal}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button (Mobile) */}
        <Button
          onClick={() => setShowModal(true)}
          className="md:hidden fixed right-5 sm:right-10 bottom-[calc(env(safe-area-inset-bottom)+4.5rem)] sm:bottom-[calc(env(safe-area-inset-bottom)+3.5rem)] bg-teal-600 hover:bg-teal-700 rounded-full shadow-lg p-4 h-14 w-14 z-50"
        >
          <Camera className="text-white" size={24} />
        </Button>
        </div>
      </main>

        {/* Bottom Navbar (Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 w-full bg-background border-t border-border flex justify-around items-center h-16 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] shadow-lg z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center gap-1 ${activeView === 'home' ? 'text-teal-600' : 'text-muted-foreground'}`}
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveView('reports')}
          className={`flex flex-col items-center gap-1 ${activeView === 'reports' ? 'text-teal-600' : 'text-muted-foreground'}`}
        >
          <BarChart2 size={20} />
          <span className="text-xs">{t[lang].laporan}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowAddDialog(true)}
          className="flex flex-col items-center text-teal-600 -mt-2"
        >
          <div className="bg-teal-600 rounded-full p-3">
            <PlusCircle size={28} className="text-white" />
          </div>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToHistory}
          className={`flex flex-col items-center gap-1 ${activeView === 'history' ? 'text-teal-600' : 'text-muted-foreground'}`}
        >
          <History size={20} />
          <span className="text-xs">History</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveView('profile')}
          className={`flex flex-col items-center gap-1 ${activeView === 'profile' ? 'text-teal-600' : 'text-muted-foreground'}`}
        >
          <User size={20} />
          <span className="text-xs">{t[lang].profil}</span>
        </Button>
        </nav>

        <AddTransactionDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
        <ProfileEditDialog 
          open={showProfileEdit} 
          onOpenChange={setShowProfileEdit}
          currentName={userName}
          currentEmail={userEmail}
          onSave={handleProfileSave}
        />
        <ExpenseAnalysisDialog 
          open={showExpenseAnalysis} 
          onOpenChange={setShowExpenseAnalysis}
          lang={lang}
        />
        <BudgetPlanDialog 
          open={showBudgetPlan} 
          onOpenChange={setShowBudgetPlan}
          lang={lang}
        />
        <ChangePinDialog 
          open={showChangePin} 
          onOpenChange={setShowChangePin}
          lang={lang}
        />
        <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{lang === 'id' ? 'Keluar dari Akun?' : 'Logout from Account?'}</AlertDialogTitle>
              <AlertDialogDescription>
                {lang === 'id' 
                  ? 'Anda akan keluar dari akun ini. Data lokal akan dihapus.' 
                  : 'You will be logged out from this account. Local data will be cleared.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{lang === 'id' ? 'Batal' : 'Cancel'}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                {lang === 'id' ? 'Keluar' : 'Logout'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Toaster />
      </div>
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <WaltrackContent />
    </WalletProvider>
  );
}

export default App;
