# Waltrack - Aplikasi Pelacak Keuangan

Aplikasi web modern untuk mengelola dan memantau keuangan pribadi Anda.

## Fitur

- 📊 **Dashboard Interaktif** - Lihat statistik keuangan Anda secara real-time
- 💰 **Manajemen Transaksi** - Tambah, lihat, dan hapus transaksi pemasukan/pengeluaran
- 📈 **Visualisasi Data** - Grafik pie dan bar chart untuk analisis keuangan
- 🏷️ **Kategori** - Organisir transaksi berdasarkan kategori (Gaji, Makanan, Transport, dll)
- 💾 **Penyimpanan Lokal** - Data tersimpan di browser menggunakan localStorage
- 🎨 **UI Modern** - Dibangun dengan React, TypeScript, TailwindCSS, dan shadcn/ui

## Teknologi

- **React 18** - Library UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Komponen UI
- **Recharts** - Visualisasi data
- **React Hook Form** - Form management
- **Zod** - Validasi schema
- **date-fns** - Manipulasi tanggal

## Cara Menjalankan

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka browser di `http://localhost:5173`

## Struktur Folder

```
src/
├── components/          # Komponen React
│   ├── ui/             # Komponen UI dari shadcn
│   ├── Navbar.tsx      # Navigasi bar
│   ├── Dashboard.tsx   # Kartu statistik
│   ├── TransactionList.tsx  # Daftar transaksi
│   ├── AddTransactionDialog.tsx  # Form tambah transaksi
│   ├── ExpenseChart.tsx  # Grafik pengeluaran
│   └── IncomeExpenseChart.tsx  # Grafik pemasukan vs pengeluaran
├── context/            # React Context
│   └── WalletContext.tsx  # State management
├── types/              # TypeScript types
│   └── index.ts        # Interface dan types
├── lib/                # Utilities
│   └── utils.ts        # Helper functions
└── App.tsx             # Komponen utama
```

## Fitur Detail

### Dashboard
- Saldo total
- Total pemasukan
- Total pengeluaran
- Jumlah transaksi

### Transaksi
- Tambah transaksi baru (pemasukan/pengeluaran)
- Pilih kategori dengan icon
- Tanggal transaksi
- Deskripsi
- Hapus transaksi dengan konfirmasi

### Kategori Default

**Pemasukan:**
- 💰 Gaji
- 💼 Freelance
- 📈 Investasi

**Pengeluaran:**
- 🍔 Makanan
- 🚗 Transport
- 🛒 Belanja
- 🎮 Hiburan
- 📱 Tagihan

### Charts
- **Pie Chart**: Distribusi pengeluaran per kategori
- **Bar Chart**: Perbandingan pemasukan vs pengeluaran (6 bulan terakhir)

## Build untuk Production

```bash
npm run build
```

File hasil build akan ada di folder `dist/`.

## License

MIT
