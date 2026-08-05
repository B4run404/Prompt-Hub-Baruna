import { API_BASE_URL as CONFIG_API_URL } from '../config.js';
import { API_BASE_URL, getHeaders } from './authService.js';

const SNIPPET_API_URL = `${CONFIG_API_URL}/snippets`;

export async function fetchSnippets() {
    const response = await fetch(SNIPPET_API_URL, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch snippets');
    const data = await response.json();
    return data.data;
}

export async function createSnippet(snippetData) {
    const response = await fetch(SNIPPET_API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(snippetData)
    });
    if (!response.ok) throw new Error('Failed to create snippet');
    const data = await response.json();
    return data.data;
}

export async function updateSnippet(id, snippetData) {
    const response = await fetch(`${SNIPPET_API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(snippetData)
    });
    if (!response.ok) throw new Error('Failed to update snippet');
    const data = await response.json();
    return data.data;
}

export async function deleteSnippet(id) {
    const response = await fetch(`${SNIPPET_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete snippet');
    return response.json();
}

export async function toggleFavoriteSnippet(id) {
    const response = await fetch(`${SNIPPET_API_URL}/${id}/favorite`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to toggle favorite');
    return response.json();
}
