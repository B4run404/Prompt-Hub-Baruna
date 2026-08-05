# PROJECT BRIEF

## Nama Proyek
PromptHub 

## Deskripsi
Saya ingin membangun sebuah aplikasi web pribadi (Personal AI Workspace) yang berfungsi sebagai pusat manajemen prompt, dokumentasi proyek, knowledge base, dan aset pengembangan AI.

Aplikasi ini akan menjadi tempat utama saya menyimpan seluruh prompt, project, dokumentasi, aset, referensi, serta riwayat pengembangan sehingga tidak lagi bergantung pada banyak folder atau aplikasi yang terpisah.

Aplikasi harus dirancang agar dapat berkembang selama bertahun-tahun tanpa perlu melakukan perubahan arsitektur yang besar.

---

## Tujuan
Membangun workspace pribadi yang mampu:
- Menyimpan Prompt AI
- Mengelola Project
- Menyimpan Dokumentasi
- Menyimpan Asset
- Mengelola Template
- Menyimpan Snippet Code
- Menyimpan Catatan
- Sinkronisasi dengan Cloud
- Pencarian yang sangat cepat

---

## Target Pengguna
- **Saat ini:** Admin (Saya sendiri)
- **Di masa depan memungkinkan:** Multi User, Team Workspace, Role Management

---

## Fitur Utama

### Authentication
- Login, Logout, Session Management

### Dashboard
Menampilkan:
- Total Prompt, Total Project, Prompt Terbaru, Project Terbaru, Storage Usage, Aktivitas Terakhir, Favorite Prompt, Favorite Project

### Prompt Manager
**Fitur:** Folder Prompt, Kategori, Tag, Search, Favorite, Version History, Markdown Preview, Copy Prompt, Duplicate Prompt, Archive, Trash.
**Jenis Prompt:** ChatGPT, Claude, Gemini, Antigravity, Cursor, Windsurf, Midjourney, Google Flow, Image Prompt, Video Prompt.

### Project Manager
**Properti:** Nama, Deskripsi, Thumbnail, Status, Progress, Framework, Bahasa, Catatan, Todo, Deadline, Version.
**Hubungan:** Satu project dapat memiliki Banyak Prompt, Asset, Catatan, Template, dan File.

### Knowledge Base
Menyimpan: Tutorial, Catatan, Dokumentasi, SOP, Best Practice, AI Rules, Workflow.

### Asset Manager
Menyimpan: Image, Icon, Logo, PDF, DOCX, ZIP, Video, Audio. 
*(Preview langsung di browser)*

### Snippet Manager
Menyimpan: HTML, CSS, JavaScript, SQL, Python, Prompt Snippet. 
*(Dengan syntax highlighting)*

### Template Library
Berisi: Landing Page, Dashboard, Form, Modal, Table, Card, Prompt Template, Email Template.

### AI Workspace
Fitur khusus untuk menyimpan prompt berdasarkan: ChatGPT, Claude, Gemini, Cursor, Windsurf, Antigravity.
Memiliki tombol: Copy, Favorite, Riwayat Penggunaan.

### Search Engine
Pencarian global dalam satu kotak untuk mencari: Prompt, Project, Asset, Snippet, Catatan.

### Backup
Backup otomatis, Manual Backup, Restore, Import, Export.

---

## Cloud Storage
- **Prioritas Awal:** Google Drive
- **Alternatif (Saran Terpilih):** Supabase Storage / Cloudflare R2

## Database
- Ringan, murah, mudah dipelihara, dan mampu berkembang.
- *(Keputusan saat ini: PostgreSQL via Supabase dengan Prisma ORM)*

## Teknologi
- **Frontend:** Vanilla HTML, Vanilla CSS, Vanilla JavaScript.
- **Backend:** Node.js (Express).

## Desain
- Modern, Minimal, **Claymorphism**, Dark Mode (Default), Light Mode, Responsive, Cepat. 
- *Aksen warna: Ungu.*

## Target Jangka Panjang
- Mudah dikembangkan selama bertahun-tahun
- Mudah dipelihara
- Modular (Clean Architecture)
- Aman & Cepat
- Tidak bergantung pada satu file besar
- Siap berkembang menjadi aplikasi enterprise bila diperlukan.
