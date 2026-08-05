import { API_BASE_URL as CONFIG_API_URL } from '../config.js';
import { getToken } from './authService.js';

const API_BASE_URL = `${CONFIG_API_URL}/tags`;

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

export async function fetchTags() {
    const response = await fetch(API_BASE_URL, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
}
