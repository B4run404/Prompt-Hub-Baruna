require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const promptRoutes = require('./routes/promptRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRoutes');
const projectRoutes = require('./routes/projectRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const documentRoutes = require('./routes/documentRoutes');
const snippetRoutes = require('./routes/snippetRoutes');
const assetRoutes = require('./routes/assetRoutes');
const templateRoutes = require('./routes/templateRoutes');
const searchRoutes = require('./routes/searchRoutes');
const backupRoutes = require('./routes/backupRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Mengizinkan cookie jika diperlukan nantinya
}));
app.use(express.json());

// Global Rate Limiter (Umum)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 500, // Maksimal 500 request per IP per 15 menit
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Terlalu banyak request dari IP ini, coba lagi nanti.' }
});

// Auth Rate Limiter (Ketat untuk Brute Force Login/Register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 20, // Maksimal 20 request per IP untuk /auth
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Terlalu banyak percobaan autentikasi, coba lagi nanti.' }
});

// Terapkan global limiter ke semua /api/
app.use('/api/', globalLimiter);

// Mount Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/prompts', promptRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/snippets', snippetRoutes);
app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/backup', backupRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Centralized Error Handling (Harus berada di urutan paling bawah)
app.use(errorHandler);

// Start Server (hanya dijalankan jika tidak di lingkungan Vercel)
if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export app untuk Vercel Serverless Functions
module.exports = app;
