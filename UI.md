# UI Planning & Design System: PromptHub

Dokumen ini merangkum rancangan antarmuka pengguna (User Interface) dan *Design System* untuk PromptHub, memastikan konsistensi visual, navigasi yang intuitif, dan pengalaman pengguna yang luar biasa.

---

## 1. Sitemap (Peta Situs)
Struktur hierarki halaman aplikasi:
- **Login / Auth** (`/login`)
- **App Shell** (Memiliki Layout Global)
  - **Dashboard** (`/`)
  - **Prompts** (`/prompts`)
    - Prompt List & Search
    - Create / Edit Prompt Modal
    - Prompt Details / Version History
  - **Projects** (`/projects`)
    - Project Board / List
    - Project Details
  - **Knowledge Base** (`/knowledge-base`)
    - Document List
    - Markdown Editor / Viewer
  - **Assets** (`/assets`)
    - Gallery View / List View
    - File Preview
  - **Snippets** (`/snippets`)
    - Code Editor View
  - **Templates** (`/templates`)
  - **Settings** (`/settings`)

---

## 2. Navigation (Navigasi)
- **Primary Navigation (Sidebar):** Terletak di sebelah kiri layar. Menampung semua tautan utama ke modul (Dashboard, Prompts, Projects, dst.). Memiliki status `active` untuk menunjukkan posisi pengguna saat ini.
- **Secondary Navigation (Topbar/Header):** Terletak di bagian atas. Menampung:
  - Kotak **Global Search** (Pencarian cepat antar modul).
  - Tombol **Toggle Theme** (Dark / Light).
  - **User Avatar / Profile Menu** (Logout, Settings).
- **Breadcrumbs:** Digunakan di dalam halaman detail (misal: `Projects > Project A > Detail`) untuk memudahkan navigasi mundur.

---

## 3. Layout (App Shell)
Aplikasi menggunakan tata letak *Fixed Layout* (App Shell) bergaya modern:
- **Sidebar (Kiri):** Lebar tetap (sekitar 260px). Tetap statis saat konten digulirkan.
- **Header (Atas):** Tinggi tetap (sekitar 80px). Membentang di sisa lebar layar sebelah kanan Sidebar.
- **Main Content (Kanan Bawah):** Area dinamis tempat halaman dimuat. Memiliki *scrollbar* kustom (*custom scrollbar*) tersendiri jika konten melebihi layar, menjaga Sidebar dan Header tetap diam.

---

## 4. Dashboard
Halaman pertama setelah login. Dirancang untuk memberikan analitik cepat:
- **Hero Widgets (Kartu Atas):** 4 Kartu menampilkan angka ringkas (Total Prompt, Total Project, Penggunaan Storage, dan Prompt Favorit).
- **Recent Activity:** Daftar tabel/list vertikal menunjukkan aktivitas terakhir (misal: "Anda membuat prompt X", "Anda mengunggah aset Y").
- **Quick Actions:** Tombol akses cepat (misal: "Tambah Prompt Baru", "Unggah Aset").

---

## 5. Halaman Utama (Pages)
- **Halaman Modul (Prompts, Projects, dll):**
  - Menggunakan pola **List-Detail**. Sebelah kiri bisa berupa daftar/grid item, dan ketika diklik, modal atau panel samping akan terbuka untuk menampilkan detail tanpa berpindah halaman.
  - Memiliki *toolbar* khusus di atas konten (Filter, Urutkan, Tambah Baru).
- **Halaman Editor (Markdown/Code):**
  - Area kerja dimaksimalkan (*full-width* dalam *main content*).
  - Terdapat tombol *Copy to Clipboard* yang jelas.

---

## 6. Komponen (Reusable UI)
Dibangun menggunakan utilitas CSS agar dapat digunakan ulang:
- **ClayCard:** Kartu dengan efek *Claymorphism* (lembut, menonjol).
- **ClayInput:** *Textfield* dan *Textarea* dengan bayangan *inset* (terlihat melesak ke dalam).
- **ClayButton:** Tombol aksi utama (tampak timbul) yang bereaksi turun saat diklik (`:active`).
- **Modal / Dialog:** Untuk form "Tambah Baru" atau konfirmasi penghapusan (menggunakan tag `<dialog>` HTML5).
- **Toast Notifications:** Pop-up kecil di pojok kanan bawah untuk pesan sukses/error (misal: "Prompt disalin!").

---

## 7. Design System (Claymorphism)
Berbeda dengan *Glassmorphism* yang menonjolkan transparansi, **Claymorphism** menonjolkan efek 3D seperti tanah liat yang lembut (fluffy).
- **Atribut Kunci:**
  - Latar belakang *matte* / *solid color* (bukan transparan).
  - Dua macam *drop-shadow* luar (satu gelap, satu terang) untuk efek 3D timbul.
  - *Inner shadow* (inset) ganda untuk memberikan kesan volume/cembung.
  - Sudut yang sangat bulat (Border Radius besar, misal `16px` hingga `24px`).

---

## 8. Warna (Color Palette)
- **Warna Merek (Brand):**
  - **Primary:** Ungu Neon (`#8b5cf6`)
  - **Primary Hover:** Ungu Terang (`#a78bfa`)
- **Skema Dark Mode (Default):**
  - **Background Layar:** Sangat gelap (`#12121a`)
  - **Surface/Card:** Gelap sedikit kebiruan (`#1a1a24`)
  - **Text Primary:** Putih bersih (`#f8fafc`)
  - **Text Secondary:** Abu-abu terang (`#94a3b8`)
- **Status Colors:**
  - **Success:** Hijau (`#10b981`)
  - **Danger:** Merah (`#f87171` atau `#ef4444`)
  - **Warning:** Kuning (`#f59e0b`)

---

## 9. Typography
- **Font Utama:** **Inter** (dari Google Fonts). Sangat bersih dan terbaca jelas di layar resolusi tinggi.
- **Font-Weights:**
  - `300` (Light) - Untuk teks sekunder.
  - `400` (Regular) - Untuk paragraf dan konten utama.
  - `500` (Medium) - Untuk label tombol dan input.
  - `600` (Semi-Bold) - Untuk sub-judul.
  - `700` (Bold) - Untuk Judul Utama (H1/H2).

---

## 10. Iconography (Ikon)
- **Library:** **FontAwesome 6** (Free Solid).
- **Penerapan:**
  - Digunakan di navigasi *Sidebar* untuk setiap nama modul.
  - Digunakan di dalam tombol aksi (misal: Ikon 'Salin', 'Tong Sampah', 'Edit').
  - Ikon diberi ruang napas (margin) agar tidak menempel rapat dengan teks.
