import { getToken } from '../core/router.js';

const API_BASE_URL = 'http://localhost:3000/api/v1/templates';

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

export async function fetchTemplates() {
    const response = await fetch(API_BASE_URL, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch templates');
    const data = await response.json();
    return data.data;
}

export async function getTemplateById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch template details');
    const data = await response.json();
    return data.data;
}

export async function createTemplate(data) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create template');
    const resData = await response.json();
    return resData.data;
}

export async function updateTemplate(id, data) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update template');
    const resData = await response.json();
    return resData.data;
}

export async function deleteTemplate(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete template');
    return true;
}
