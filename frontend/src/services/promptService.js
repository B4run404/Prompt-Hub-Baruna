import { getToken } from './authService.js';

const API_BASE_URL = 'http://localhost:3000/api/v1/prompts';

const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
};

export async function fetchPrompts() {
    const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch prompts');
    }
    return response.json();
}

// Stub function untuk Task 5 nanti
export async function createPrompt(data) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Failed to create prompt');
    }
    return response.json();
}

// Fitur Edit Prompt (Task 6)
export async function updatePrompt(id, data) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Failed to update prompt');
    }
    return response.json();
}

// Fitur Soft Delete Prompt (Task 7)
export async function deletePrompt(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to delete prompt');
    }
    return response.json();
}
