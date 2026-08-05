# Task Breakdown (Estimasi: Maksimal 2 Jam per Task)

Berikut adalah rincian tugas-tugas kecil untuk setiap Sprint. Setiap *Task* dirancang agar dapat diselesaikan maksimal dalam waktu 2 jam.

---

### Sprint 1: Project Setup & Architecture
Task 1 (Selesai)
Inisialisasi Monorepo & Git Repo

Task 2 (Selesai)
Setup Node.js & Dependencies Backend

Task 3 (Selesai)
Setup Vanilla JS & CSS Frontend

Task 4 (Selesai)
Konfigurasi Environment Variables (.env)

---

### Sprint 2: Database & ORM Setup
Task 1 (Selesai)
Koneksi Prisma ORM ke PostgreSQL

Task 2 (Selesai)
Schema Inti (Users & Projects)

Task 3 (Selesai)
Database Migration

Task 4 (Selesai)
Seeding Data Dummy

---

### Sprint 3: Authentication
Task 1 (Selesai)
API Login & Hash Password (Bcrypt)

Task 2 (Selesai)
Pembuatan JWT Token

Task 3 (Selesai)
Auth Middleware (Proteksi Rute Backend)

Task 4 (Selesai)
UI Login Page (Claymorphism)

Task 5 (Selesai)
Integrasi Frontend Fetch Login & Simpan Token

---

### Sprint 4: App Shell & Layouting
Task 1 (Selesai)
Struktur HTML & CSS Sidebar

Task 2 (Selesai)
Struktur HTML & CSS Header (Topbar)

Task 3 (Selesai)
Implementasi Vanilla SPA Routing

Task 4 (Selesai)
Logika Toggle Dark/Light Mode

---

### Sprint 5: Prompt CRUD (Core)
Task 1 (Selesai)
Database Schema untuk Prompt

Task 2 (Selesai)
CRUD API (Backend Route & Controller)

Task 3 (Selesai)
Service Layer Logic (Validasi & Akses)

Task 4 (Selesai)
UI Table/List Prompt (Frontend)

Task 5 (Selesai)
UI Form Tambah Prompt

Task 6 (Selesai)
Fitur Edit Prompt

Task 7 (Selesai)
Fitur Soft-Delete (Trash)

Task 8 (Selesai)
Testing & Error Handling (Prompt)

---

### Sprint 6: Prompt Metadata & Versioning
Task 1 (Selesai)
Database Schema (Kategori & Tag)

Task 2 (Selesai)
API Kategori & Tag

Task 3 (Selesai)
UI Filter berdasarkan Tag

Task 4 (Selesai)
Database Schema (Prompt Versions)

Task 5 (Selesai)
Trigger Simpan Versi Baru saat Update

Task 6 (Selesai)
UI History Version Panel

Task 7 (Selesai)
Fitur Copy to Clipboard

Task 8 (Selesai)
Markdown Preview Parser (Frontend)

---

### Sprint 7: Project CRUD
Task 1 (Selesai)
Database Schema (Projects)

Task 2 (Selesai)
CRUD API (Project)

Task 3 (Selesai)
UI Project Grid/Board

Task 4 (Selesai)
UI Form Tambah Project

Task 5 (Selesai)
Fitur Edit & Delete Project

Task 6 (Selesai)
Testing (Project API)

---

### Sprint 8: Project Relations
Task 1 (Selesai)
API Relasi Project-Prompt

Task 2 (Selesai)
UI Halaman Detail Project

Task 3 (Selesai)
Komponen List Prompt di Dalam Project

Task 4 (Selesai)
Perhitungan Progress Bar (Backend/Frontend)

---

### Sprint 9: Dashboard & Favorites
Task 1 (Selesai)
API Toggle Favorite (Prompt/Project)

Task 2 (Selesai)
UI Tombol Star/Favorite

Task 3 (Selesai)
API Statistik Dashboard (Total Row)

Task 4 (Selesai)
UI Widget Dashboard (Statistik)

Task 5 (Selesai)
Menampilkan Recent Activity Table

---

### Sprint 10: Knowledge Base
Task 1 (Selesai)
Database Schema & API (Knowledge Base)

Task 2 (Selesai)
Integrasi Editor Teks/Markdown

Task 3 (Selesai)
UI Dokumen List

Task 4 (Selesai)
UI Dokumen Viewer

---

### Sprint 11: Snippet Manager
Task 1 (Selesai)
Database Schema & API (Snippets)

Task 2 (Selesai)
Integrasi Library Syntax Highlighting (misal: Prism.js)

Task 3 (Selesai)
UI Form Tambah Code Snippet

Task 4 (Selesai)
UI View Code Snippet (dengan tombol Copy)

---

### Sprint 12: Asset Manager UI & Logic
Task 1 (Selesai)
Database Schema (Assets)

Task 2 (Selesai)
UI Asset Gallery (Grid)

Task 3 (Selesai)
UI Modal Upload File

Task 4 (Selesai)
Logika Relasi Asset dengan Project

---

### Sprint 13: Cloud Storage Integration
Task 1 (Selesai)
Konfigurasi Supabase Storage API

Task 2 (Selesai)
Backend Route untuk Upload Multipart/form-data

Task 3 (Selesai)
Service Upload File & Return Public URL

Task 4 (Selesai)
Frontend Progress Bar Upload

---

### Sprint 14: Template Library
Task 1 (Selesai)
Database Schema & API (Templates)

Task 2 (Selesai)
UI Template Gallery

Task 3 (Selesai)
Fitur Duplicate Template ke Prompt

Task 4 (Selesai)
Fitur Edit Template

---

### Sprint 15: Global Search Engine
Task 1 (Selesai)
Query Pencarian Gabungan (PostgreSQL FTS)

Task 2 (Selesai)
Endpoint API /search (Multi-table)

Task 3 (Selesai)
UI Search Input & Event Listener (Debounce)

Task 4 (Selesai)
UI Search Results Overlay

---

### Sprint 16: Backup & Restore
Task 1 (Selesai)
Skrip Export Database ke JSON (Backend)

Task 2 (Selesai)
Skrip Import JSON ke Database (Backend)

Task 3 (Selesai)
UI Halaman Settings - Tombol Export

Task 4 (Selesai)
UI Modal Upload File untuk Restore

---

### Sprint 17: Security & Refactoring
Task 1 (Selesai)
Validasi Joi/Zod di semua Route POST/PUT

Task 2 (Selesai)
Implementasi CORS ketat & Rate Limiting

Task 3 (Selesai)
Pembersihan Variabel / File Tidak Terpakai

Task 4 (Selesai)
Review Log & Penanganan Catch (Error)

---

### Sprint 18: Production Deployment
Task 1 (Selesai)
Setup Variabel ENV Produksi (Supabase)

Task 2 (Selesai)
Deploy Database & Jalankan Migration di Production

Task 3 (Selesai)
Deploy Backend (Vercel Serverless)

Task 4 (Selesai)
Deploy Frontend (Vercel) & Test E2E
