import { API_BASE_URL, getHeaders } from './authService.js';

const DOC_API_URL = 'http://localhost:3000/api/v1/documents';

export async function fetchDocuments() {
    const response = await fetch(DOC_API_URL, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch documents');
    const data = await response.json();
    return data.data;
}

export async function createDocument(documentData) {
    const response = await fetch(DOC_API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(documentData)
    });
    if (!response.ok) throw new Error('Failed to create document');
    const data = await response.json();
    return data.data;
}

export async function updateDocument(id, documentData) {
    const response = await fetch(`${DOC_API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(documentData)
    });
    if (!response.ok) throw new Error('Failed to update document');
    const data = await response.json();
    return data.data;
}

export async function deleteDocument(id) {
    const response = await fetch(`${DOC_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete document');
    return response.json();
}

export async function toggleFavoriteDocument(id) {
    const response = await fetch(`${DOC_API_URL}/${id}/favorite`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to toggle favorite');
    return response.json();
}
