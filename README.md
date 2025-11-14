# Waltrack - Aplikasi Pelacak Keuangan

Aplikasi web modern untuk mengelola dan memantau keuangan pribadi Anda dengan fitur lengkap dan UI yang responsif.

## 📸 Screenshots

### Desktop View
![Desktop Dashboard](./screenshots/desktop-dashboard.png)
*Dashboard dengan sidebar dan statistik keuangan*

![Desktop Reports](./screenshots/desktop-reports.png)
*Halaman laporan dengan grafik visualisasi*

### Mobile View
![Mobile Home](./screenshots/mobile-home.png)
*Tampilan mobile dengan bottom navigation*

![Mobile Dark Mode](./screenshots/mobile-dark.png)
*Dark mode di tampilan mobile*

### Features
![Add Transaction](./screenshots/add-transaction.png)
*Dialog tambah transaksi dengan form validasi*

![Scan Receipt](./screenshots/scan-receipt.png)
*Modal scan receipt untuk upload struk*

---

## ✨ Fitur Utama

- 📊 **Dashboard Interaktif** - Lihat statistik keuangan Anda secara real-time
- 💰 **Manajemen Transaksi** - Tambah, lihat, dan hapus transaksi pemasukan/pengeluaran
- 📈 **Visualisasi Data** - Grafik pie dan bar chart untuk analisis keuangan
- 🏷️ **Kategori** - Organisir transaksi berdasarkan kategori (Gaji, Makanan, Transport, dll)
- 💾 **Penyimpanan Lokal** - Data tersimpan di browser menggunakan localStorage
- 🎨 **UI Modern** - Dibangun dengan React, TypeScript, TailwindCSS, dan shadcn/ui
- 🌓 **Dark Mode** - Toggle antara tema terang dan gelap
- 🌍 **Multi-Bahasa** - Dukungan Bahasa Indonesia dan English
- 📱 **Responsive Design** - Tampilan optimal di desktop dan mobile
- 📸 **Scan Receipt** - Upload dan proses struk belanja (placeholder untuk integrasi AI)
- 🎯 **Bottom Navigation** - Navigasi mobile-friendly dengan floating action button

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
- **Framer Motion** - Animasi dan transisi
- **Lucide React** - Icon library

## Cara Menjalankan

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka browser di `http://localhost:5173` (atau port yang ditampilkan di terminal)

## Navigasi Aplikasi

### Desktop
- **Sidebar** - Menu navigasi di sebelah kiri yang bisa dibuka/tutup
  - Toggle dengan tombol hamburger untuk expand/collapse
  - Menu: Dashboard, Laporan, Profil
- **Top Bar** - Header dengan judul halaman dan action buttons
  - Tombol Dark Mode (Sun/Moon icon)
  - Tombol Bahasa (Globe icon)
  - Tombol Tambah Transaksi

### Mobile
- **Top Bar** - Header sederhana dengan judul dan action buttons
- **Bottom Navigation** - 5 menu utama:
  - 🏠 **Home** - Dashboard dan daftar transaksi
  - 📊 **Reports** - Grafik dan analisis
  - ➕ **Add** - Tambah transaksi (tombol tengah menonjol)
  - 📤 **Scan** - Upload struk belanja
  - 👤 **Profile** - Pengaturan tema dan bahasa
- **Floating Action Button** - Scan struk (tombol kamera di kanan bawah)
- **No Sidebar** - Sidebar disembunyikan di mobile untuk pengalaman yang lebih clean

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
