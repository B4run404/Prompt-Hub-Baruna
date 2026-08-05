import { API_BASE_URL as CONFIG_API_URL } from '../config.js';
import { getToken } from './authService.js';

const API_BASE_URL = `${CONFIG_API_URL}/prompts`;

const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
};

export async function fetchPrompts() {
    const response = await fetch(API_BASE_URL, { headers: getHeaders() });
    if (!response.ok) {
        throw new Error('Failed to fetch prompts');
    }
    return response.json();
}

export async function getPromptById(id) {
    const response = await fetch(`${CONFIG_API_URL}/${id}`, { headers: getHeaders() });
    if (!response.ok) {
        throw new Error('Failed to fetch prompt details');
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
    const response = await fetch(`${CONFIG_API_URL}/${id}`, {
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
    const response = await fetch(`${CONFIG_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to delete prompt');
    }
    return response.json();
}

export async function hardDeletePrompt(id) {
    const response = await fetch(`${CONFIG_API_URL}/${id}/hard`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to hard delete prompt');
    return response.json();
}

export async function toggleFavoritePrompt(id) {
    const response = await fetch(`${CONFIG_API_URL}/${id}/favorite`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to toggle favorite');
    return response.json();
}
