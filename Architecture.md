# Software Architecture: PromptHub

Dokumen ini memaparkan rancangan arsitektur perangkat lunak untuk aplikasi **PromptHub**. Setiap keputusan diambil berdasarkan prinsip **Skalabilitas, Modularitas, dan Kemudahan Pemeliharaan Jangka Panjang** sesuai yang tercantum pada `PROJECT_BRIEF.md`.

---

## 1. Clean Architecture
Kita mengadopsi prinsip **Clean Architecture**, di mana logika bisnis harus independen dari UI, kerangka kerja (framework), dan database.
- **Frontend Layering:** 
  `UI (DOM/Event)` ↔ `State/Store` ↔ `Service (API Fetch)` ↔ `Backend`
- **Backend Layering:** 
  `Routes (Express)` ↔ `Controllers (Req/Res)` ↔ `Services (Business Logic)` ↔ `Repositories (Prisma ORM)`
- **Alasan:** Pemisahan ini (*Separation of Concerns*) menjamin bahwa jika di masa depan Anda ingin mengganti *database* atau merombak UI (misal: beralih dari Vanilla JS ke React), inti logika bisnis tidak perlu ditulis ulang.

---

## 2. Folder Structure
Struktur *monorepo* yang memisahkan klien dan server dengan sangat jelas.

```text
prompthub/
├── frontend/
│   ├── public/              # Aset statis (Favicon, Logo)
│   └── src/
│       ├── components/      # UI Element modular (Card, Modal, Sidebar)
│       ├── css/             # Stylesheet (Variables, Claymorphism)
│       ├── modules/         # Fitur utama (Auth, Prompts, Projects)
│       ├── services/        # Fetch wrappers & API calls
│       ├── store/           # State Management (Pub/Sub)
│       ├── utils/           # Fungsi helper murni
│       └── app.js           # Entry point & Router
│
└── backend/
    ├── prisma/              # Skema Database ORM
    └── src/
        ├── config/          # Environment & Setup
        ├── controllers/     # Menangani HTTP Request
        ├── middlewares/     # JWT Auth, Error Handler, Validator
        ├── routes/          # Definisi Endpoint API
        ├── services/        # Logika Bisnis Inti
        └── utils/           # Helper backend
```
- **Alasan:** Struktur ini sangat terprediksi. Jika seorang *developer* baru bergabung 3 tahun dari sekarang, ia akan langsung tahu di mana harus mencari kode tanpa perlu dokumentasi rumit.

---

## 3. Module Structure
Alih-alih mengelompokkan kode berdasarkan tipe file, kita akan mengelompokkan kode *frontend* berdasarkan **Fitur (Feature-Based Modules)** di dalam folder `src/modules/`.
Contoh:
- `modules/prompts/` (Berisi: `promptList.js`, `promptForm.js`, `promptView.js`)
- `modules/projects/`
- **Alasan:** Mengisolasi fitur. Jika ada kerusakan pada fitur *Knowledge Base*, hal itu tidak akan merambat ke fitur *Prompt Manager*.

---

## 4. Component Structure
Karena Anda meminta **Vanilla JS**, komponen akan dibuat menggunakan pendekatan **Class-Based** atau **Factory Functions** yang mengembalikan *HTML Strings* atau *DOM Elements*, bukan satu file HTML raksasa.
- Contoh: `new PromptCard(promptData).render()`
- **Alasan:** Menghindari file HTML/JS berukuran ribuan baris. Setiap komponen bisa dipanggil berulang kali, sehingga memenuhi syarat "Tidak bergantung pada satu file besar".

---

## 5. Routing
- **Frontend (Client-Side Routing):** Menggunakan *Hash-based Routing* (misal: `/#/prompts/123`) atau *History API* Vanilla JS.
- **Backend (API Routing):** Menggunakan pola RESTful dengan *versioning* (misal: `/api/v1/prompts`).
- **Alasan:** Routing pada *frontend* memungkinkan aplikasi berjalan seperti SPA (*Single Page Application*) yang sangat cepat tanpa *loading screen* per halaman. *Versioning* pada backend menjaga kompabilitas API ke depannya.

---

## 6. State Management
Tanpa framework seperti Redux, kita akan membuat sistem manajemen *state* ringan menggunakan pola **Pub/Sub (Publisher/Subscriber)** bawaan JS (`EventTarget`).
- **Alasan:** Sangat ringan dan *native* di browser. Misalnya, saat *Prompt* baru disimpan, aplikasi memancarkan event `PROMPT_ADDED`. Komponen *Dashboard* dan *Prompt List* yang mendengarkan event tersebut akan otomatis meng-*update* angka tanpa perlu di-*refresh*.

---

## 7. Storage Strategy
- **Relational Data (Teks, Relasi):** PostgreSQL via Supabase.
- **File & Assets (Gambar, Dokumen):** Supabase Storage (dikirim via API *multipart/form-data*).
- **Client Cache:** `localStorage` (untuk menyimpan JWT Token dan preferensi Dark/Light mode). `sessionStorage` untuk state *search* sementara.
- **Alasan:** Memisahkan beban *database* relasional dengan penyimpanan file (Blob/S3) memastikan performa database tetap optimal seiring bertambahnya aset.

---

## 8. API Layer
Di *frontend*, seluruh pemanggilan `fetch()` tidak dilakukan langsung dari komponen UI, melainkan dibungkus dalam satu *API Layer* sentral (misal: `apiClient.js`).
- **Alasan:** Memastikan bahwa **JWT Bearer Token** disuntikkan secara otomatis ke setiap *request*. Jika token *expired*, lapisan ini bisa secara otomatis me- *redirect* pengguna ke halaman Login, tanpa harus menulis ulang kode *error handling* di 50 tempat yang berbeda.

---

## 9. Service Layer
Pada *backend*, **Controller** hanya bertugas membaca *request* dan membalas *response*. Semua proses berpikir diletakkan di **Service Layer**.
- **Contoh Kasus:** Ketika *Project* dihapus, *Controller* akan memanggil `projectService.deleteProject(id)`. *Service* ini yang bertugas melepaskan kaitan (*unlink*) semua *Prompt* yang ada di proyek tersebut sebelum menghapusnya.
- **Alasan:** Memudahkan *Unit Testing* pada logika bisnis inti dan memastikan *Controller* tetap "kurus" dan bersih.

---

## 10. Utility Layer
Baik *frontend* maupun *backend* memiliki folder `utils/` yang berisi **Pure Functions** (Fungsi murni yang tidak bergantung pada *state* luar).
- **Contoh Frontend:** `formatDate(isoString)`, `parseMarkdown(text)`, `debounceSearch(func, delay)`.
- **Contoh Backend:** `hashPassword(plain)`, `generateSlug(title)`.
- **Alasan:** Fungsi utilitas bisa digunakan lintas modul tanpa menciptakan ketergantungan antar fitur (*spaghetti code*).
