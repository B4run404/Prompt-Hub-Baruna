import { API_BASE_URL as CONFIG_API_URL } from '../config.js';
/**
 * @file authService.js
 * @description Modul layanan untuk menangani pemanggilan API Autentikasi
 */

const API_BASE_URL = CONFIG_API_URL;
const TOKEN_KEY = 'prompthub_token';

export async function login(email, password) {
    try {
        const response = await fetch(`${CONFIG_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Simpan token ke localStorage
        localStorage.setItem(TOKEN_KEY, data.token);
        return data.user;
    } catch (error) {
        throw error;
    }
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload();
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
    return !!getToken();
}
