export async function renderAssetGallery(container) {
    container.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%;"><i class="fa-solid fa-spinner fa-spin fa-2x color-primary"></i></div>`;
    
    try {
        const { fetchAssets } = await import('../../services/assetService.js');
        const assets = await fetchAssets();

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h1 style="font-size: 1.8rem; font-weight: 700;">Asset Manager</h1>
                <button id="btn-upload-asset" class="btn btn-primary clay-btn"><i class="fa-solid fa-upload"></i> Upload Asset</button>
            </div>
        `;

        if (!assets || assets.length === 0) {
            html += `<div class="clay-card" style="text-align: center; padding: 48px; color: var(--text-secondary);">No assets found. Upload files to keep them handy.</div>`;
        } else {
            // Asset Gallery Grid
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">`;
            assets.forEach(asset => {
                const isImage = asset.file_type.startsWith('image/');
                const displaySize = (asset.size / 1024).toFixed(1) + ' KB';
                
                html += `
                    <div class="clay-card asset-card" data-id="${asset.id}" data-url="${asset.url}" style="position: relative; overflow: hidden; display: flex; flex-direction: column; padding: 0; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="height: 140px; background: rgba(0,0,0,0.2); display: flex; justify-content: center; align-items: center;">
                            ${isImage 
                                ? `<img src="${asset.url}" alt="${asset.filename}" style="width: 100%; height: 100%; object-fit: cover;">`
                                : `<i class="fa-solid fa-file fa-3x" style="color: var(--text-secondary);"></i>`
                            }
                        </div>
                        <div style="padding: 12px; display: flex; flex-direction: column; gap: 4px;">
                            <h4 style="margin: 0; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${asset.filename}">${asset.filename}</h4>
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-secondary);">
                                <span>${displaySize}</span>
                                <span>${asset.file_type.split('/')[1] || 'file'}</span>
                            </div>
                        </div>
                        <button class="icon-btn btn-delete-asset" data-id="${asset.id}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.6); color: #ef4444; width: 28px; height: 28px;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            });
            html += `</div>`;
        }

        container.innerHTML = html;
        bindEvents(container);

    } catch (err) {
        container.innerHTML = `<div class="clay-card"><h2 class="text-danger">Failed to Load Assets</h2><p>${err.message}</p></div>`;
    }
}

function bindEvents(container) {
    // Delete Asset
    document.querySelectorAll('.btn-delete-asset').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation(); // prevent card click
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this asset?')) {
                try {
                    const { deleteAsset } = await import('../../services/assetService.js');
                    await deleteAsset(id);
                    renderAssetGallery(container);
                } catch (err) {
                    alert('Failed to delete asset: ' + err.message);
                }
            }
        });
    });

    // Preview/Click Asset (Just open URL for now)
    document.querySelectorAll('.asset-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete-asset')) return;
            const url = card.getAttribute('data-url');
            if (url && url !== '#') {
                window.open(url, '_blank');
            } else {
                alert('URL is not available (mock data).');
            }
        });
    });

    // We will implement the upload modal in Sprint 12 Task 3
    const uploadBtn = document.getElementById('btn-upload-asset');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            // Task 3 placeholder action
            alert('Upload Modal UI will be implemented in Sprint 12 Task 3');
        });
    }
}
