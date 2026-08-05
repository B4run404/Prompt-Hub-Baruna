# Code Review Report: PromptHub (Tahap Awal)

Laporan ini berisi tinjauan kode *(code review)* komprehensif terhadap implementasi saat ini (Frontend dan Backend), berdasarkan standar kualitas, keamanan, dan arsitektur yang disepakati.

---

## 1. Bug (Celah Logika)
- **Frontend ID vs Email:** Di `frontend/src/app.js`, *input* dari *form* login diambil menggunakan `document.getElementById('email').value`. Namun, logika *mocking* memeriksa kecocokan dengan ID `Baruna404`. Secara teknis ini berfungsi, tetapi secara semantik salah karena pengguna memasukkan *Username/ID*, bukan format *Email*.
- **Routing Caching:** Fungsi `loadPage()` di `app.js` me- *replace* `innerHTML` tanpa menyimpan status sebelumnya. Jika pengguna mengetik sesuatu di sebuah halaman dan pindah ke halaman lain lalu kembali, pekerjaannya akan hilang.

## 2. Security (Keamanan)
- **Hardcoded Fallback Secret:** Pada `backend/src/services/authService.js`, pembuatan token memiliki *fallback*: `process.env.JWT_SECRET || 'fallback_secret_key'`. Jika `.env` tidak sengaja terhapus, aplikasi tetap berjalan dengan kunci rahasia yang sangat mudah ditebak (risiko *hijacking* sesi).
- **CORS Terbuka Bebas:** Di `server.js`, `app.use(cors())` diterapkan tanpa opsi. Ini berarti API akan menerima *request* dari domain mana pun di seluruh dunia. Seharusnya dibatasi hanya untuk domain frontend (misal: `localhost:5500` atau URL Vercel).
- **Rate Limiting:** Rute `/login` belum memiliki *Rate Limiter*. Ini membuka peluang serangan *Brute Force* atau *Credential Stuffing*.

## 3. Performance (Kinerja)
- **Pemuatan Skrip Sinkron:** File `app.js` dimuat. Meski ukurannya masih kecil, seiring bertambah besarnya *frontend*, semua modul akan berada di satu tempat yang memicu pemuatan awal lambat. Seharusnya menerapkan *Lazy Loading* (ES Modules) untuk setiap fitur.
- **Query Database:** Pada `userRepo.js`, `findByEmail` cukup cepat karena mencari berdasarkan *Primary Key / Unique Index*. Namun, jika tidak ada indeks khusus pada kolom `email` (selain UNIQUE constraint), ini harus dipastikan di `schema.prisma`.

## 4. Code Smell (Praktik Penulisan Kode yang Kurang Baik)
- **Frontend Monolitik:** File `app.js` (135 baris) saat ini menangani *UI rendering*, navigasi, *event listeners*, pengelolaan tema, dan logika autentikasi. Ini bertentangan dengan desain di `ProjectStructure.md` yang mengamanatkan *Separation of Concerns* (pemecahan ke folder `modules/` dan `core/`).
- **Hardcoded Mocking:** Adanya *mocking* langsung menggunakan `if (email === 'Baruna404' && password === 'bagusbae123')` di *frontend* adalah *code smell*. Idealnya, *mocking* diletakkan pada kelas `authService` terpisah agar `app.js` tetap bersih.

## 5. Duplicate (Duplikasi Kode)
- **DOM Queries:** `document.documentElement.setAttribute('data-theme', ...)` dipanggil di beberapa tempat. Sebaiknya dibungkus menjadi satu *pure function* di `utils/themeManager.js`.
- **Tidak ada duplikasi ekstrem:** Arsitektur backend (*Controller -> Service -> Repository*) sangat berhasil mencegah terjadinya duplikasi pada penanganan *request* HTTP.

## 6. Memory Leak (Kebocoran Memori)
- **Event Listeners:** Di `app.js`, *event listener* dipasang menggunakan `.addEventListener()`. Pada implementasi *Single Page Application* (SPA) sederhana ini tidak menjadi masalah karena elemen (seperti tombol Login) tidak dihancurkan dari DOM. Namun, jika nanti elemen di-*re-render* secara dinamis, *listener* yang tidak dibersihkan (`removeEventListener`) akan menyebabkan *Memory Leak*.

## 7. Import Error (Kesalahan Impor)
- **Backend Clean:** Semua impor dependensi di backend (`require('../repositories/userRepo')`, `require('bcrypt')`) tersambung dengan baik dan tidak ada *circular dependency*.
- **Frontend Tidak Menggunakan Modul:** Frontend saat ini hanya mengandalkan *Global Scope* dari pemuatan tag `<script>`. Tidak ada `import/export` (ES6 Modules) yang digunakan, sehingga risiko tabrakan variabel antar file sangat tinggi di masa depan.

## 8. Unused Code (Kode Tidak Terpakai)
- **Komentar Blok API:** Di bagian bawah fungsi login pada `app.js`, terdapat blok `fetch()` sungguhan yang di- *comment* (baris 91-108). Kode *zombie* seperti ini sebaiknya dihapus dari *production branch* atau digantikan secara utuh saat API sudah siap.
- **Route Health Check:** Rute `GET /health` di `server.js` ada, tetapi tidak pernah dipanggil/dimonitor oleh *frontend* maupun *system dashboard*.

## 9. Responsive (Dukungan Resolusi Layar)
- **CSS Claymorphism:** Konfigurasi CSS sebelumnya sudah menyertakan `flex-wrap` dan unit relatif. Namun, Sidebar selebar `260px` pada layar *mobile* (di bawah 768px) akan memakan seluruh layar. *Media query* untuk menyembunyikan/mengecilkan sidebar di perangkat *mobile* perlu ditambahkan ke dalam `style.css`.

---

### Kesimpulan & Rekomendasi
Implementasi Backend (Sprint 3 Task 1) **sangat baik** dan sudah sepenuhnya mematuhi *Clean Architecture*. Namun, sisi Frontend belum sejalan dengan arsitektur modular yang direncanakan. 

**Rekomendasi untuk Sprint selanjutnya:**
1. Refaktor `app.js` menjadi struktur ES6 Modules (`import/export`).
2. Terapkan CORS *whitelist* pada `server.js`.
3. Gunakan `express-rate-limit` pada rute *Auth*.
