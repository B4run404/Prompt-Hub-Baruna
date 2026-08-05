export async function renderAssetGallery(container) {
    container.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%;"><i class="fa-solid fa-spinner fa-spin fa-2x color-primary"></i></div>`;
    
    try {
        const { fetchAssets } = await import('../../services/assetService.js');
        const { fetchProjects } = await import('../../services/projectService.js');
        
        const [assets, projects] = await Promise.all([
            fetchAssets(),
            fetchProjects()
        ]);
        
        // Store projects globally for the modal
        window.currentProjects = projects || [];

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
                const projectPill = asset.project ? `<span style="font-size: 0.7rem; background: rgba(139, 92, 246, 0.2); color: #8b5cf6; padding: 2px 6px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; display: inline-block;">${asset.project.name}</span>` : '';
                
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
                                ${projectPill}
                            </div>
                        </div>
                        <button class="icon-btn btn-delete-asset" data-id="${asset.id}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.6); color: #ef4444; width: 28px; height: 28px;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            });
            html += `</div>`;
        }

        // Generate options for projects
        let projectOptions = '<option value="">-- No Project (Standalone) --</option>';
        if (window.currentProjects) {
            window.currentProjects.forEach(p => {
                projectOptions += `<option value="${p.id}">${p.name}</option>`;
            });
        }

        // Upload Modal UI
        html += `
            <div id="upload-asset-modal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                <div class="clay-card" style="width: 90%; max-width: 500px; background: var(--surface);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h2 style="margin: 0; font-size: 1.5rem;">Upload Asset</h2>
                        <button id="close-upload-modal" class="icon-btn"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <form id="upload-asset-form">
                        <div class="form-group" style="border: 2px dashed var(--glass-border); border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 16px; position: relative; cursor: pointer;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--glass-border)'">
                            <i class="fa-solid fa-cloud-arrow-up fa-3x" style="color: var(--primary); margin-bottom: 12px;"></i>
                            <p style="margin: 0; color: var(--text-secondary);">Click or drag file to this area to upload</p>
                            <input type="file" id="asset-file-input" required style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                        </div>
                        <div id="selected-file-name" style="margin-bottom: 16px; font-size: 0.9rem; color: var(--primary); font-weight: 600; text-align: center; min-height: 20px;"></div>
                        
                        <div class="form-group" style="margin-bottom: 24px;">
                            <label>Link to Project (Optional)</label>
                            <select id="asset-project-select" class="clay-input" style="background: var(--surface); color: var(--text-primary); border: 1px solid var(--glass-border);">
                                ${projectOptions}
                            </select>
                        </div>

                        <div style="display: flex; justify-content: flex-end; gap: 12px;">
                            <button type="button" id="cancel-upload-btn" class="btn" style="background: transparent; border: 1px solid var(--glass-border); color: var(--text-primary);">Cancel</button>
                            <button type="submit" id="submit-upload-btn" class="btn btn-primary clay-btn" disabled>Upload File</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

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

    // Modal Elements
    const uploadModal = document.getElementById('upload-asset-modal');
    const closeUploadModal = document.getElementById('close-upload-modal');
    const cancelUploadBtn = document.getElementById('cancel-upload-btn');
    const uploadForm = document.getElementById('upload-asset-form');
    const fileInput = document.getElementById('asset-file-input');
    const selectedFileName = document.getElementById('selected-file-name');
    const submitBtn = document.getElementById('submit-upload-btn');

    const openModal = () => {
        uploadModal.style.display = 'flex';
    };

    const closeModal = () => {
        uploadModal.style.display = 'none';
        uploadForm.reset();
        selectedFileName.textContent = '';
        submitBtn.disabled = true;
    };

    const uploadBtn = document.getElementById('btn-upload-asset');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', openModal);
    }

    closeUploadModal.addEventListener('click', closeModal);
    cancelUploadBtn.addEventListener('click', closeModal);

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedFileName.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            submitBtn.disabled = false;
        } else {
            selectedFileName.textContent = '';
            submitBtn.disabled = true;
        }
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        if (!file) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';

        try {
            // Mock upload logic for Sprint 12
            // We use URL.createObjectURL to generate a temporary local URL for the file
            const mockUrl = URL.createObjectURL(file);
            
            const projectId = document.getElementById('asset-project-select').value;

            const assetData = {
                filename: file.name,
                url: mockUrl,
                file_type: file.type || 'application/octet-stream',
                size: file.size,
                project_id: projectId ? projectId : null
            };

            const { createAsset } = await import('../../services/assetService.js');
            await createAsset(assetData);
            
            closeModal();
            renderAssetGallery(container);
        } catch (err) {
            alert('Failed to upload asset: ' + err.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Upload File';
        }
    });
}
