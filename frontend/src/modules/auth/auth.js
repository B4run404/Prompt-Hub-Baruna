/**
 * @file auth.js
 * @description Modul UI untuk menangani form login dan interaksi DOM autentikasi
 */

import { login, logout, isAuthenticated } from '../../services/authService.js';
import { loadPage } from '../../core/router.js';

export function initAuth() {
    const loginScreen = document.getElementById('login-screen');
    const appShell = document.getElementById('app-shell');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    // 1. Cek State Awal
    if (isAuthenticated()) {
        loginScreen.classList.add('hidden');
        appShell.classList.remove('hidden');
        loadPage('dashboard');
    } else {
        loginScreen.classList.remove('hidden');
        appShell.classList.add('hidden');
    }

    // 2. Handle Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            // Reset error & state
            loginError.textContent = '';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Memuat...';
            
            try {
                await login(email, password);
                // Jika sukses, reload UI (akan ditangkap oleh initAuth di atas)
                loginScreen.classList.add('hidden');
                appShell.classList.remove('hidden');
                loadPage('dashboard');
            } catch (err) {
                loginError.textContent = err.message || 'Terjadi kesalahan pada server.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        });
    }

    // 3. Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout(); // me-reload halaman
        });
    }
}
