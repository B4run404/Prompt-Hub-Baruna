import { API_BASE_URL as CONFIG_API_URL } from '../config.js';
import { API_BASE_URL, getHeaders } from './authService.js';
const DASHBOARD_API_URL = `${CONFIG_API_URL}/dashboard`;

export async function getDashboardStats() {
    const response = await fetch(`${DASHBOARD_API_URL}/stats`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    const data = await response.json();
    return data.data;
}
