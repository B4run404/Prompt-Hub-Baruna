export async function renderTemplateGallery(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2>Template Library</h2>
            <button id="btn-new-template" class="btn-primary" style="background: var(--primary); border: none; padding: 10px 20px; color: #fff; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-plus"></i> Buat Template
            </button>
        </div>
        
        <div id="template-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">
                <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
                <p style="margin-top: 10px;">Memuat template...</p>
            </div>
        </div>
    `;

    document.getElementById('btn-new-template').addEventListener('click', () => {
        openTemplateModal();
    });

    try {
        const { fetchTemplates } = await import('../../services/templateService.js');
        const templates = await fetchTemplates();
        const grid = document.getElementById('template-grid');
        grid.innerHTML = '';

        if (templates.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px; background: var(--surface); border: 1px solid var(--glass-border); border-radius: 12px;">
                    <i class="fa-solid fa-layer-group fa-3x" style="color: var(--primary); margin-bottom: 15px;"></i>
                    <p>Belum ada template. Buat satu untuk mempercepat pekerjaan Anda!</p>
                </div>
            `;
            return;
        }

        templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.style.background = 'var(--surface)';
            card.style.border = '1px solid var(--glass-border)';
            card.style.borderRadius = '12px';
            card.style.padding = '20px';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.gap = '15px';
            card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
            
            let tagsHtml = '';
            if (template.tags && template.tags.length > 0) {
                tagsHtml = `<div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${template.tags.map(tag => `<span style="background: rgba(138, 43, 226, 0.2); color: #e0b0ff; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">${tag}</span>`).join('')}
                </div>`;
            }

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 style="margin: 0; color: #fff; font-size: 1.1rem; line-height: 1.4;">${template.title}</h3>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-edit-template" data-id="${template.id}" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-delete-template" data-id="${template.id}" style="background: transparent; border: none; color: #ff4d4d; cursor: pointer; padding: 4px;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${template.category ? `<span style="color: var(--primary); font-size: 0.85rem; font-weight: bold;"><i class="fa-solid fa-folder"></i> ${template.category}</span>` : ''}
                <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem; flex-grow: 1;">${template.description || 'Tidak ada deskripsi.'}</p>
                ${tagsHtml}
                <button class="btn-use-template" data-id="${template.id}" style="width: 100%; background: rgba(138, 43, 226, 0.1); border: 1px solid var(--primary); color: #fff; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: auto; transition: all 0.2s ease;">
                    <i class="fa-solid fa-copy"></i> Gunakan Templat
                </button>
            `;

            grid.appendChild(card);
        });

        // Event Listeners for action buttons
        document.querySelectorAll('.btn-delete-template').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm('Yakin ingin menghapus template ini?')) {
                    try {
                        const { deleteTemplate } = await import('../../services/templateService.js');
                        await deleteTemplate(id);
                        renderTemplateGallery(container);
                    } catch (err) {
                        alert('Gagal menghapus template: ' + err.message);
                    }
                }
            });
        });

        // Event listener for edit
        document.querySelectorAll('.btn-edit-template').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const template = templates.find(t => t.id === id);
                if (template) openTemplateModal(template);
            });
        });

        // Event listener for use template (Duplicate)
        document.querySelectorAll('.btn-use-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const template = templates.find(t => t.id === id);
                if (template) useTemplate(template);
            });
        });

    } catch (err) {
        document.getElementById('template-grid').innerHTML = `
            <div style="grid-column: 1 / -1; color: #ff4d4d; text-align: center; padding: 40px; background: var(--surface); border: 1px solid #ff4d4d; border-radius: 12px;">
                <i class="fa-solid fa-circle-exclamation fa-2x" style="margin-bottom: 10px;"></i>
                <p>Gagal memuat template: ${err.message}</p>
            </div>
        `;
    }
}

// Global modal state
let currentTemplateId = null;

function openTemplateModal(template = null) {
    currentTemplateId = template ? template.id : null;
    const modalTitle = template ? 'Edit Template' : 'Buat Template Baru';
    
    // Check if modal exists
    let modal = document.getElementById('template-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'template-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0, 0, 0, 0.7)';
        modal.style.backdropFilter = 'blur(5px)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="background: var(--surface); border: 1px solid var(--glass-border); border-radius: 16px; padding: 30px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #fff;">${modalTitle}</h3>
                <button id="btn-close-template-modal" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.2rem;">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <form id="template-form" style="display: flex; flexDirection: column; gap: 15px;">
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="color: var(--text-muted); font-size: 0.9rem;">Judul Template</label>
                    <input type="text" id="tpl-title" required value="${template ? template.title : ''}" style="padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: 8px; color: #fff;">
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="color: var(--text-muted); font-size: 0.9rem;">Kategori (Opsional)</label>
                    <input type="text" id="tpl-category" value="${template && template.category ? template.category : ''}" style="padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: 8px; color: #fff;">
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="color: var(--text-muted); font-size: 0.9rem;">Deskripsi Singkat</label>
                    <textarea id="tpl-desc" rows="2" style="padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: 8px; color: #fff; resize: vertical;">${template && template.description ? template.description : ''}</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="color: var(--text-muted); font-size: 0.9rem;">Konten Prompt</label>
                    <textarea id="tpl-content" required rows="6" style="padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: 8px; color: #fff; resize: vertical; font-family: monospace;">${template ? template.content : ''}</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="color: var(--text-muted); font-size: 0.9rem;">Tags (Pisahkan dengan koma)</label>
                    <input type="text" id="tpl-tags" value="${template && template.tags ? template.tags.join(', ') : ''}" placeholder="misal: coding, javascript, react" style="padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: 8px; color: #fff;">
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
                    <button type="button" id="btn-cancel-template" style="background: transparent; border: 1px solid var(--glass-border); padding: 10px 20px; color: #fff; border-radius: 8px; cursor: pointer;">Batal</button>
                    <button type="submit" id="btn-save-template" style="background: var(--primary); border: none; padding: 10px 20px; color: #fff; border-radius: 8px; cursor: pointer; font-weight: bold;">Simpan Template</button>
                </div>
            </form>
        </div>
    `;

    modal.style.display = 'flex';

    const closeModal = () => {
        modal.style.display = 'none';
    };

    document.getElementById('btn-close-template-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-template').addEventListener('click', closeModal);

    document.getElementById('template-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('tpl-title').value.trim();
        const category = document.getElementById('tpl-category').value.trim();
        const description = document.getElementById('tpl-desc').value.trim();
        const content = document.getElementById('tpl-content').value.trim();
        const tagsStr = document.getElementById('tpl-tags').value.trim();
        
        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

        const tplData = {
            title,
            category: category || null,
            description: description || null,
            content,
            tags
        };

        const btnSave = document.getElementById('btn-save-template');
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

        try {
            const { createTemplate, updateTemplate } = await import('../../services/templateService.js');
            if (currentTemplateId) {
                await updateTemplate(currentTemplateId, tplData);
            } else {
                await createTemplate(tplData);
            }
            closeModal();
            const container = document.getElementById('app-content-area');
            if (container) renderTemplateGallery(container);
        } catch (err) {
            alert('Gagal menyimpan template: ' + err.message);
            btnSave.disabled = false;
            btnSave.innerHTML = 'Simpan Template';
        }
    });
}

function useTemplate(template) {
    // Save template data to sessionStorage so promptEditor can pick it up
    sessionStorage.setItem('use_template_data', JSON.stringify({
        title: template.title,
        content: template.content,
        category: template.category,
        tags: template.tags
    }));
    
    // Trigger navigation to prompt creation
    import('../../core/router.js').then(router => {
        router.loadPage('prompts');
        // Wait a bit for the module to load, then open the modal automatically
        setTimeout(() => {
            const btnAdd = document.getElementById('btn-add-prompt');
            if (btnAdd) btnAdd.click();
        }, 300);
    });
}
