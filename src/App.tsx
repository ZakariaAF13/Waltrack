import './App.css';
import { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, PlusCircle, BarChart2, User, Camera, Upload, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddTransactionDialog } from './components/AddTransactionDialog';
import { ExpenseChart } from './components/ExpenseChart';
import { IncomeExpenseChart } from './components/IncomeExpenseChart';
import { Toaster } from './components/ui/toaster';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

function WaltrackContent() {
  const { transactions, stats } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'reports' | 'profile'>('home');

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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
      {/* Top Navbar (Desktop) */}
      <header className="hidden md:flex justify-between items-center bg-white dark:bg-gray-800 shadow px-6 py-3">
        <h1 className="text-xl font-bold text-teal-600">Waltrack</h1>
        <nav className="flex gap-6 text-gray-600 dark:text-gray-300">
          <button onClick={() => setActiveView('home')} className="hover:text-teal-600 transition">
            {t[lang].saldo}
          </button>
          <button onClick={() => setActiveView('home')} className="hover:text-teal-600 transition">
            {t[lang].transaksi}
          </button>
          <button onClick={() => setActiveView('reports')} className="hover:text-teal-600 transition">
            {t[lang].laporan}
          </button>
          <button onClick={() => setActiveView('profile')} className="hover:text-teal-600 transition">
            {t[lang].profil}
          </button>
        </nav>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={toggleLang} className="gap-2">
            <Globe size={18} /> {t[lang].ubahBahasa}
          </Button>
          <Button variant="ghost" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-teal-600 hover:bg-teal-700 gap-2">
            <PlusCircle size={18} /> {t[lang].tambahTransaksi}
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        {/* Home View */}
        {activeView === 'home' && (
          <>
            <section id="dashboard" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="shadow-md rounded-2xl dark:bg-gray-800 border-0">
                <CardContent className="p-4">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t[lang].saldo}</h2>
                  <p className="text-2xl font-bold text-teal-600 mt-2">{formatCurrency(stats.balance)}</p>
                </CardContent>
              </Card>
              <Card className="shadow-md rounded-2xl dark:bg-gray-800 border-0">
                <CardContent className="p-4">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t[lang].pemasukan}</h2>
                  <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(stats.totalIncome)}</p>
                </CardContent>
              </Card>
              <Card className="shadow-md rounded-2xl dark:bg-gray-800 border-0">
                <CardContent className="p-4">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t[lang].pengeluaran}</h2>
                  <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(stats.totalExpense)}</p>
                </CardContent>
              </Card>
              <Card className="shadow-md rounded-2xl dark:bg-gray-800 border-0">
                <CardContent className="p-4">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t[lang].jumlahTransaksi}</h2>
                  <p className="text-2xl font-bold text-purple-600 mt-2">{stats.transactionCount}</p>
                </CardContent>
              </Card>
            </section>

            <section id="transactions">
              <h2 className="text-xl font-semibold mb-4">{t[lang].riwayatTransaksi}</h2>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <Card className="rounded-xl shadow-sm dark:bg-gray-800 border-0">
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">{t[lang].belumAdaTransaksi}</p>
                    </CardContent>
                  </Card>
                ) : (
                  transactions.slice(0, 10).map((tn) => (
                    <Card key={tn.id} className="rounded-xl shadow-sm hover:shadow-md dark:bg-gray-800 transition border-0">
                      <CardContent className="flex justify-between items-center p-4">
                        <div>
                          <p className="font-semibold">{tn.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
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
          <section id="reports">
            <h2 className="text-2xl font-bold mb-6">{t[lang].laporan}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <IncomeExpenseChart />
              <ExpenseChart />
            </div>
          </section>
        )}

        {/* Profile View */}
        {activeView === 'profile' && (
          <section id="profile" className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t[lang].profil}</h2>
            <Card className="shadow-md rounded-2xl dark:bg-gray-800 border-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center">
                    <User size={48} className="text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">User Waltrack</h3>
                  <p className="text-gray-500 dark:text-gray-400">user@waltrack.app</p>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium">{t[lang].ubahTema}</span>
                    <Button variant="ghost" onClick={toggleDarkMode} size="sm">
                      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">{t[lang].scan}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t[lang].uploadStruk}</p>
                <input
                  type="file"
                  accept="image/*"
                  {...({ capture: 'environment' } as any)}
                  onChange={handleFileChange}
                  className="mb-4 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-900 dark:file:text-teal-100"
                />
                {uploadedFile && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">📄 {uploadedFile.name}</p>
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
          className="md:hidden fixed bottom-24 right-6 bg-teal-600 hover:bg-teal-700 rounded-full shadow-lg p-4 h-14 w-14 z-40"
        >
          <Camera className="text-white" size={24} />
        </Button>
      </main>

      {/* Bottom Navbar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex justify-around py-2 shadow-lg z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center gap-1 ${activeView === 'home' ? 'text-teal-600' : 'text-gray-600 dark:text-gray-300'}`}
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveView('reports')}
          className={`flex flex-col items-center gap-1 ${activeView === 'reports' ? 'text-teal-600' : 'text-gray-600 dark:text-gray-300'}`}
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
          className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300"
        >
          <Upload size={20} />
          <span className="text-xs">{t[lang].scan}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveView('profile')}
          className={`flex flex-col items-center gap-1 ${activeView === 'profile' ? 'text-teal-600' : 'text-gray-600 dark:text-gray-300'}`}
        >
          <User size={20} />
          <span className="text-xs">{t[lang].profil}</span>
        </Button>
      </nav>

      <AddTransactionDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <Toaster />
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
