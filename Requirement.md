# Requirement Analysis: PromptHub

Dokumen ini berisi analisis kebutuhan sistem yang mendalam untuk proyek **PromptHub**, berdasarkan `PROJECT_BRIEF.md`.

---

## 1. Functional Requirement (Kebutuhan Fungsional)
Sistem harus mampu melakukan hal-hal berikut:
- **FR1 - Authentication:** Sistem harus menyediakan fitur login, logout, dan manajemen sesi menggunakan JWT.
- **FR2 - Dashboard:** Sistem harus menampilkan analitik ringkas (Total Prompt, Project, Storage Usage, Aktivitas Terakhir).
- **FR3 - Prompt Management:** Sistem harus memungkinkan pengguna membuat, membaca, memperbarui, menghapus (soft-delete ke Trash), menduplikasi, dan mengarsipkan prompt. Sistem juga harus melacak riwayat versi (Version History).
- **FR4 - Project Management:** Sistem harus memungkinkan pengguna membuat proyek, melacak progress, mengatur *deadline*, dan menautkan *Asset*, *Prompt*, dan *Catatan* ke dalam proyek tersebut.
- **FR5 - Knowledge Base:** Sistem harus menyediakan editor teks (Markdown) untuk menyimpan SOP, tutorial, dan aturan AI.
- **FR6 - Asset Management:** Sistem harus memungkinkan pengguna mengunggah file gambar, video, dan dokumen, serta mempratinjau (*preview*) secara langsung di browser.
- **FR7 - Snippet Management:** Sistem harus menyediakan penyimpanan potongan kode dengan dukungan *Syntax Highlighting* sesuai bahasa pemrograman.
- **FR8 - Global Search:** Sistem harus memiliki kotak pencarian global yang mencari *keyword* di seluruh modul (Prompt, Project, Asset, Snippet, dll) dalam satu waktu.
- **FR9 - Backup & Restore:** Sistem harus menyediakan fitur ekspor (backup) seluruh database ke format JSON dan fitur impor (restore).

---

## 2. Non-Functional Requirement (Kebutuhan Non-Fungsional)
- **NFR1 - Performance:** Pencarian global harus sangat cepat (waktu respons < 300ms).
- **NFR2 - Usability:** Antarmuka harus menggunakan desain **Claymorphism** modern, memiliki *Dark/Light Mode*, dan sepenuhnya responsif di perangkat desktop maupun tablet.
- **NFR3 - Maintainability:** Kode *frontend* harus menggunakan **Vanilla JS** namun dipecah secara modular (Component-based approach) agar mudah dipelihara bertahun-tahun.
- **NFR4 - Scalability:** Meskipun saat ini dirancang untuk *single-admin*, skema *database* harus siap untuk diubah menjadi *multi-tenant* atau *multi-user* tanpa merombak total struktur tabel.

---

## 3. User Story
- **US1:** Sebagai Admin, saya ingin menyimpan prompt panjang dengan rapi berdasarkan folder dan kategori, sehingga saya tidak kesulitan mencarinya saat dibutuhkan.
- **US2:** Sebagai Admin, saya ingin mencari sebuah kata kunci di "Global Search", sehingga saya bisa langsung menemukan apakah itu ada di *Snippet*, *Prompt*, atau *Catatan* tanpa membuka menunya satu per satu.
- **US3:** Sebagai Admin, saya ingin setiap perubahan pada *Prompt* disimpan riwayatnya (*Version History*), sehingga saya bisa mengembalikan *prompt* ke versi yang lebih baik jika modifikasi terbaru kurang memuaskan.
- **US4:** Sebagai Admin, saya ingin melampirkan gambar referensi ke dalam sebuah *Project*, sehingga semua aset pengembangan UI terpusat dan tidak tercecer di *file explorer* komputer saya.

---

## 4. Use Case
- **UC1: Manajemen Sesi** -> *Actor: Admin* -> Login, Logout.
- **UC2: Manajemen Prompt** -> *Actor: Admin* -> Create Prompt, Edit Prompt, View History, Copy to Clipboard.
- **UC3: Manajemen Proyek** -> *Actor: Admin* -> Create Project, Update Progress, Link Assets.
- **UC4: Pencarian Global** -> *Actor: Admin* -> Ketik *keyword* -> Sistem menampilkan hasil dari berbagai entitas.

---

## 5. User Flow (Contoh: Menambah Prompt Baru)
1. Pengguna berhasil **Login** dan diarahkan ke **Dashboard**.
2. Pengguna mengklik menu **"Prompts"** pada *Sidebar*.
3. Pengguna mengklik tombol **"Add New Prompt"**.
4. Muncul form (*modal/page*). Pengguna mengisi **Judul**, memilih **AI Provider** (misal: Claude), mengisi **Konten Prompt**, dan menambahkan **Tag**.
5. Pengguna mengklik **"Save"**.
6. Sistem menyimpan data ke *database*, membuat rekaman versi pertama (*Version 1*), dan mengarahkan pengguna ke halaman *Preview Prompt*.

---

## 6. Business Rule
- **BR1 - Otorisasi:** Tidak ada halaman atau rute API yang dapat diakses tanpa token JWT yang valid, kecuali rute *login*.
- **BR2 - Integritas Data:** Sebuah *Project* yang dihapus, tidak akan langsung menghapus *Prompt* atau *Asset* yang berafiliasi dengannya, melainkan hanya melepaskan tautannya (*unlink*).
- **BR3 - Soft Delete:** Menghapus *Prompt* akan mengubah statusnya menjadi `is_trashed = true`. Data benar-benar terhapus dari sistem jika pengguna memilih opsi "Empty Trash".

---

## 7. Future Expansion (Rencana Ekspansi)
- **Multi-User & RBAC:** Menambahkan peran (Owner, Editor, Viewer) untuk bekerja dalam tim (Team Workspace).
- **AI Integration API:** Menambahkan fitur agar pengguna bisa langsung mengetes *prompt* dengan memanggil API OpenAI/Anthropic/Gemini langsung dari dalam aplikasi PromptHub.
- **Chrome Extension:** Membuat ekstensi browser agar pengguna bisa men- *save* prompt dari web ChatGPT/Claude langsung ke PromptHub.

---

## 8. Technical Constraint (Batasan Teknis)
- **Frontend Stack:** Tidak boleh menggunakan *framework* besar seperti React, Vue, atau Angular. Wajib menggunakan **Vanilla HTML, CSS, JS**.
- **Backend Stack:** Node.js (Express) harus dipecah dengan *Clean Architecture* (Routes, Controllers, Services).
- **Storage:** Aset tidak disimpan di *local disk* server untuk menghindari pembengkakan ukuran server, melainkan harus menggunakan **Supabase Storage** (via API).

---

## 9. Security Requirement (Kebutuhan Keamanan)
- **SEC1 - Password Hashing:** *Password* administrator harus di-*hash* menggunakan *bcrypt* dengan *salt rounds* minimal 10.
- **SEC2 - API Protection:** Seluruh endpoint API yang bersifat mengubah data (POST, PUT, DELETE) wajib dilindungi *middleware* JWT.
- **SEC3 - ORM Protection:** Mencegah *SQL Injection* dengan memandatkan penggunaan Prisma ORM untuk seluruh interaksi *database*.
- **SEC4 - CORS Policy:** Konfigurasi CORS pada backend harus diatur dengan ketat agar hanya menerima *request* dari domain *frontend* yang diizinkan (atau `localhost` selama fase *development*).
