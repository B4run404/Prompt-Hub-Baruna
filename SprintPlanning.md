# Sprint Planning: PromptHub

Seluruh proyek telah dipecah menjadi *sprints* berukuran kecil (estimasi 1–2 hari kerja per *sprint*). Urutan di bawah ini disusun berdasarkan prioritas dari fitur yang paling krusial (inti) hingga fitur pelengkap (ekspansi).

---

### Sprint 1
**Project Setup & Architecture**
- Inisialisasi monorepo (Frontend & Backend).
- Setup Node.js, Express, dan pustaka pendukung.
- Pembuatan struktur folder standar.

### Sprint 2
**Database & ORM Setup**
- Inisialisasi Prisma ORM dan koneksi ke PostgreSQL.
- Pembuatan tabel inti (Users, Prompts, Projects).
- *Database migration*.

### Sprint 3
**Authentication**
- Pembuatan API Login (Bcrypt & JWT).
- Implementasi Auth Middleware di backend.
- Pembuatan halaman UI Login dengan Claymorphism.

### Sprint 4
**App Shell & Layouting**
- Pembuatan komponen Sidebar dan Header.
- Implementasi *routing* Vanilla JS (SPA).
- Fitur ganti tema (Dark/Light mode).

### Sprint 5
**Prompt CRUD (Core)**
- Pembuatan API untuk Create, Read, Update, Delete Prompt.
- Pembuatan halaman UI List Prompt.
- Pembuatan UI Form (Modal/Page) penambahan Prompt.

### Sprint 6
**Prompt Metadata & Versioning**
- Fitur Kategori dan Tag pada Prompt.
- API dan UI untuk melacak riwayat revisi (*Version History*).
- Fitur *Copy to Clipboard* dan Markdown Preview.

### Sprint 7
**Project CRUD**
- Pembuatan API CRUD untuk Project.
- Halaman UI Project Board / List.
- Halaman UI Detail Project.

### Sprint 8
**Project Relations**
- Menautkan Prompt ke dalam Project tertentu.
- UI untuk melihat daftar Prompt di dalam sebuah Project.
- *Progress bar* dan status Project.

### Sprint 9
**Dashboard & Favorites**
- Logika penyimpanan status Favorite (bintang) pada Prompt/Project.
- Menghitung total statistik (Total Prompt, Project) dari *database*.
- Menampilkan data pada *Widget* Dashboard.

### Sprint 10
**Knowledge Base**
- API CRUD untuk dokumen Knowledge Base.
- Integrasi *Markdown Editor* di frontend.
- Fitur untuk melihat SOP dan Aturan AI.

### Sprint 11
**Snippet Manager**
- API CRUD untuk potongan kode (Snippets).
- UI Editor kode dengan *Syntax Highlighting*.

### Sprint 12
**Asset Manager UI & Logic**
- Pembuatan antarmuka galeri Aset (Gambar, PDF).
- Form untuk mengunggah file.
- Logika menghubungkan Aset ke sebuah Project.

### Sprint 13
**Cloud Storage Integration**
- Menyambungkan backend dengan API Supabase Storage (atau Cloudflare R2).
- Proses *upload* dan *retrieve* URL file statis secara *real-time*.

### Sprint 14
**Template Library**
- API dan UI untuk menyimpan kerangka (Template) UI atau Email.
- Fitur menduplikasi template menjadi Snippet atau Project.

### Sprint 15
**Global Search Engine**
- Pembuatan API pencarian gabungan (Prompts, Projects, Snippets, Notes).
- Pembuatan UI *Search Overlay* (aktif saat *search bar* di-klik atau via *shortcut*).

### Sprint 16
**Backup & Restore**
- API untuk mengekspor seluruh tabel *database* menjadi satu file `.json`.
- Fitur untuk mengimpor (Restore) data dari `.json` ke database.

### Sprint 17
**Security & Refactoring**
- Validasi input di sisi server (mencegah *payload* kosong atau XSS).
- Pembersihan kode mati (*dead code*) dan perbaikan *bugs* (QA).

### Sprint 18
**Production Deployment**
- Setup variabel *environment* produksi.
- *Deploy* Frontend ke Vercel.
- *Deploy* Backend dan Database ke Server/Supabase.
