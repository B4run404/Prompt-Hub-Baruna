# Project Structure: PromptHub

Dokumen ini memaparkan hierarki folder (struktur proyek) final untuk aplikasi PromptHub. Struktur ini dirancang dengan prinsip **Skalabilitas** dan **Pemisahan Peran (Separation of Concerns)**, baik di sisi klien (*Frontend*) maupun server (*Backend*).

---

## 1. Struktur Root (Monorepo)
Proyek ini mengadopsi pola *monorepo* sederhana agar semua komponen berada di satu tempat, namun tetap terisolasi.

```text
prompthub/
├── frontend/               # Kode sumber antarmuka pengguna (Vanilla JS)
├── backend/                # Kode sumber server API (Node.js/Express)
├── .gitignore              # Daftar file yang diabaikan oleh Git
├── Architecture.md         # Dokumentasi arsitektur
├── Database.md             # Dokumentasi skema database
├── PROJECT_BRIEF.md        # Spesifikasi awal
├── Requirement.md          # Analisis kebutuhan
└── UI.md                   # Dokumentasi sistem desain
```

---

## 2. Struktur Frontend (Vanilla JS)
Dirancang untuk mencegah *spaghetti code*. Alih-alih memasukkan semua fungsi ke dalam satu `app.js` besar, kode dipecah berdasarkan fitur (*Domain-Driven*).

```text
frontend/
├── public/                 # File statis yang diakses langsung oleh browser
│   ├── favicon.ico
│   └── logo.svg
│
├── src/
│   ├── core/               # Inti aplikasi (Router, Event Bus/Pub-Sub)
│   │   ├── router.js       # Mengatur navigasi SPA (Hash/History API)
│   │   └── eventBus.js     # State management ringan (Global Event Listener)
│   │
│   ├── css/                # Gaya visual aplikasi
│   │   ├── variables.css   # Warna, ukuran, transisi (Dark/Light mode)
│   │   ├── utilities.css   # Kelas pembantu (margin, padding, text-align)
│   │   ├── components.css  # Claymorphism (ClayCard, ClayInput, dll)
│   │   └── style.css       # Main stylesheet yang meng-import CSS lain
│   │
│   ├── components/         # Komponen UI Reusable (Global)
│   │   ├── sidebar.js      # Navigasi kiri
│   │   ├── topbar.js       # Header dan kotak pencarian
│   │   └── modal.js        # Dialog box standar
│   │
│   ├── modules/            # Logika dan UI yang dikelompokkan berdasarkan fitur
│   │   ├── auth/           # Fitur Login, Logout, Cek Sesi
│   │   ├── dashboard/      # Tampilan analitik awal
│   │   ├── prompts/        # CRUD Prompts, Markdown Preview
│   │   ├── projects/       # Manajemen Proyek
│   │   └── knowledge/      # Fitur Knowledge Base
│   │
│   ├── services/           # Komunikasi dengan API Backend
│   │   ├── apiClient.js    # Fetch wrapper (Otomatis injeksi JWT Token)
│   │   └── promptApi.js    # Endpoint khusus untuk manipulasi prompt
│   │
│   ├── utils/              # Fungsi murni (Pure Functions) tanpa efek samping
│   │   ├── formatter.js    # Format tanggal, angka, string
│   │   └── validator.js    # Validasi input email, panjang karakter
│   │
│   └── app.js              # Entry point utama (Inisialisasi aplikasi)
│
└── index.html              # App Shell (Layout kerangka utama HTML)
```

---

## 3. Struktur Backend (Node.js + Express)
Menggunakan pendekatan **Clean Architecture** (Layered). Logika bisnis dipisahkan secara tegas dari logika *Routing* dan *Database*.

```text
backend/
├── prisma/                 # Pengaturan Database
│   ├── schema.prisma       # Definisi ERD, Tabel, dan Relasi (Prisma ORM)
│   └── migrations/         # Riwayat perubahan skema database
│
├── src/
│   ├── config/             # Pengaturan aplikasi & pihak ketiga
│   │   └── env.js          # Memuat variabel .env
│   │
│   ├── middlewares/        # Penengah sebelum request mencapai controller
│   │   ├── auth.js         # Memverifikasi JWT Token
│   │   ├── errorHandler.js # Menangkap error secara global (Try/Catch wrapper)
│   │   └── validator.js    # Memvalidasi body/params request
│   │
│   ├── routes/             # Definisi URL API (Mengarahkan URL ke Controller)
│   │   ├── v1/             # API Versioning
│   │   │   ├── auth.js     # /api/v1/auth
│   │   │   └── prompts.js  # /api/v1/prompts
│   │
│   ├── controllers/        # Mengelola Input (Request) dan Output (Response)
│   │   ├── authCtrl.js     # Mengambil req.body, memanggil Service, mengirim res.json
│   │   └── promptCtrl.js   # Menjamin format response standar
│   │
│   ├── services/           # Core Business Logic (Logika Aplikasi)
│   │   ├── authService.js  # Aturan login, perbandingan hash, pembuatan token
│   │   └── promptService.js# Aturan saat menyimpan prompt (misal: cek kepemilikan)
│   │
│   ├── repositories/       # Data Access Layer (Akses ke Database)
│   │   ├── userRepo.js     # Menjalankan query Prisma (findUnique, create)
│   │   └── promptRepo.js   # Memisahkan Prisma ORM dari Business Logic
│   │
│   ├── utils/              # Helper murni backend
│   │   ├── hash.js         # Pembungkus fungsi bcrypt
│   │   └── logger.js       # Pencatatan log (Winston/Morgan)
│   │
│   └── server.js           # Inisialisasi Express app dan mendengarkan Port
│
├── .env                    # Kredensial rahasia (Database URL, JWT Secret)
└── package.json            # Daftar pustaka NPM
```

---

## 4. Alasan Mengapa Ini Sangat Scalable
1. **Frontend Modules:** Jika di masa depan PromptHub memiliki 50 fitur baru, folder `src/modules/` hanya akan bertambah ke samping, tanpa membuat folder komponen atau CSS meledak menjadi ribuan baris.
2. **Backend Repositories:** Dengan memisahkan `repositories` dari `services`, jika kelak Anda ingin pindah dari Prisma ORM ke Drizzle ORM atau SQL biasa, Anda **hanya perlu mengubah folder repositories**. Logika bisnis di `services` tidak akan tersentuh sama sekali.
3. **API Versioning:** Menggunakan folder `v1/` pada `routes` memungkinkan pembuatan versi `v2/` di masa depan (jika terjadi perubahan arsitektur besar) tanpa merusak aplikasi versi lama.
