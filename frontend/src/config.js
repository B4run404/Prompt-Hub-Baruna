/**
 * @file config.js
 * @description Konfigurasi dinamis untuk URL API (Otomatis mendeteksi Local vs Production)
 */

const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Nanti ganti 'https://prompthub-backend.vercel.app' dengan URL Vercel/Render backend Anda yang sebenarnya.
export const API_BASE_URL = IS_LOCAL 
    ? 'http://localhost:3000/api/v1' 
    : 'https://prompthub-backend.vercel.app/api/v1';
