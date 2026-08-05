import { getToken } from '../core/router.js';

const API_BASE_URL = 'http://localhost:3000/api/v1/tags';

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
