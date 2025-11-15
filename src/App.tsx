import './App.css';
import { useState, useEffect, lazy, Suspense } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, PlusCircle, BarChart2, User, Camera, Upload, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddTransactionDialog } from './components/AddTransactionDialog';
import { Toaster } from './components/ui/toaster';
import { Sidebar } from './components/Sidebar';
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
  const [activeView, setActiveView] = useState<'home' | 'reports' | 'profile'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
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
        <header className="bg-background border-b border-border px-4 md:px-6 pt-[env(safe-area-inset-top)] py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              {activeView === 'home' && t[lang].saldo}
              {activeView === 'reports' && t[lang].laporan}
              {activeView === 'profile' && t[lang].profil}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleLang} className="hidden md:flex">
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
        </header>

        <main className="flex-1 px-4 md:px-6 py-4 md:py-6 pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pb-8 overflow-auto">
          <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Home View */}
        {activeView === 'home' && (
          <>
            <section id="dashboard" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-md rounded-2xl bg-card border-0">
                <CardContent className="p-4">
                  <h2 className="text-sm font-medium text-muted-foreground">{t[lang].saldo}</h2>
                  <p className="text-2xl font-bold text-teal-600 mt-2">{formatCurrency(stats.balance)}</p>
                </CardContent>
              </Card>
              <Card className="shadow-md rounded-2xl bg-card border-0">
                <CardContent className="p-4">
                  <h2 className="text-sm font-medium text-muted-foreground">{t[lang].pemasukan}</h2>
                  <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(stats.totalIncome)}</p>
                </CardContent>
              </Card>
              <Card className="shadow-md rounded-2xl bg-card border-0">
                <CardContent className="p-4">
                  <h2 className="text-sm font-medium text-muted-foreground">{t[lang].pengeluaran}</h2>
                  <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(stats.totalExpense)}</p>
                </CardContent>
              </Card>
              <Card className="shadow-md rounded-2xl bg-card border-0">
                <CardContent className="p-4">
                  <h2 className="text-sm font-medium text-muted-foreground">{t[lang].jumlahTransaksi}</h2>
                  <p className="text-2xl font-bold text-purple-600 mt-2">{stats.transactionCount}</p>
                </CardContent>
              </Card>
            </section>

            <section id="transactions" className="mt-4">
              <h2 className="text-xl font-semibold mb-4">{t[lang].riwayatTransaksi}</h2>
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

        {/* Profile View */}
        {activeView === 'profile' && (
          <section id="profile" className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t[lang].profil}</h2>
            <Card className="shadow-md rounded-2xl bg-card border-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center">
                    <User size={48} className="text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">User Waltrack</h3>
                  <p className="text-muted-foreground">user@waltrack.app</p>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                    <span className="font-medium">{t[lang].ubahTema}</span>
                    <Button variant="ghost" onClick={toggleDarkMode} size="sm">
                      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                    <span className="font-medium">{lang === 'id' ? 'Bahasa' : 'Language'}</span>
                    <Button variant="ghost" onClick={toggleLang} size="sm" className="gap-2">
                      <Globe size={18} /> {t[lang].ubahBahasa}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <Upload size={20} />
          <span className="text-xs">{t[lang].scan}</span>
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
