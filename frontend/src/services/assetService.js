import { API_BASE_URL, getHeaders } from './authService.js';

const ASSET_API_URL = 'http://localhost:3000/api/v1/assets';

export async function fetchAssets() {
    const response = await fetch(ASSET_API_URL, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch assets');
    const data = await response.json();
    return data.data;
}

export async function createAsset(assetData) {
    const response = await fetch(ASSET_API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(assetData)
    });
    if (!response.ok) throw new Error('Failed to create asset');
    const data = await response.json();
    return data.data;
}

export async function deleteAsset(id) {
    const response = await fetch(`${ASSET_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete asset');
    return response.json();
}
