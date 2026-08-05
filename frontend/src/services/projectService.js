import { getToken } from '../core/router.js';

const API_BASE_URL = 'http://localhost:3000/api/v1/projects';

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

export async function fetchProjects() {
    const response = await fetch(API_BASE_URL, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
}

export async function getProjectById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch project details');
    return response.json();
}

export async function createProject(data) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
}

export async function updateProject(id, data) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
}

export async function deleteProject(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return true;
}
