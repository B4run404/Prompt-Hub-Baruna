require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5500', // Batasi hanya dari domain frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate Limiter untuk melindungi dari Brute Force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Maksimal 100 request per IP dalam 15 menit
    message: { message: 'Too many requests from this IP, please try again later.' }
});

// Routes
app.use('/api/v1/auth', authLimiter, authRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'PromptHub API is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
