import { API_BASE_URL as CONFIG_API_URL } from '../config.js';
import { getToken } from './authService.js';

const API_BASE_URL = `${CONFIG_API_URL}/projects`;

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
    const response = await fetch(`${CONFIG_API_URL}/${id}`, { headers: getHeaders() });
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
    const response = await fetch(`${CONFIG_API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
}

export async function deleteProject(id) {
    const response = await fetch(`${CONFIG_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return true;
}

export async function addPrompt(projectId, promptId) {
    const response = await fetch(`${CONFIG_API_URL}/${projectId}/prompts/${promptId}`, {
        method: 'POST',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to add prompt to project');
    return response.json();
}

export async function removePrompt(projectId, promptId) {
    const response = await fetch(`${CONFIG_API_URL}/${projectId}/prompts/${promptId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to remove prompt from project');
    return response.json();
}

export async function toggleFavoriteProject(id) {
    const response = await fetch(`${CONFIG_API_URL}/${id}/favorite`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to toggle favorite project');
    return response.json();
}
