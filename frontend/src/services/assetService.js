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

export function createAssetWithProgress(file, projectId, onProgress) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        if (projectId) formData.append('project_id', projectId);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', ASSET_API_URL, true);
        
        const headers = getHeaders();
        xhr.setRequestHeader('Authorization', headers.Authorization);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                if (onProgress) onProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                resolve(response.data);
            } else {
                reject(new Error(`Failed to upload: ${xhr.statusText}`));
            }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(formData);
    });
}

export async function deleteAsset(id) {
    const response = await fetch(`${ASSET_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete asset');
    return response.json();
}
