import { fetchPrompts } from '../../services/promptService.js';
import { fetchTags } from '../../services/tagService.js';

let currentTagFilter = null;

export async function renderPromptList(container) {
    // 1. Loading State
    container.innerHTML = `
        <div class="clay-card">
            <h2><i class="fa-solid fa-terminal text-primary"></i> Prompts Library</h2>
            <p style="margin-top: 16px;">Loading your prompts...</p>
        </div>
    `;

    try {
        // 2. Fetch Data
        const [promptsData, tagsData] = await Promise.all([
            fetchPrompts(),
            fetchTags().catch(() => []) // Fallback if tags fail
        ]);

        // Filter based on selected tag
        const prompts = currentTagFilter 
            ? promptsData.filter(p => p.tags && p.tags.some(t => t.id === currentTagFilter))
            : promptsData;

        // 3. Render Header & Button
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="font-size: 1.8rem;"><i class="fa-solid fa-terminal text-primary"></i> Prompts Library</h2>
                <button id="btn-add-prompt" class="clay-btn">
                    <i class="fa-solid fa-plus"></i> New Prompt
                </button>
            </div>
        `;

        // Render Tags Filter Bar
        if (tagsData && tagsData.length > 0) {
            let tagsHtml = `<div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; align-items: center;">
                <span style="font-size: 0.9rem; color: var(--text-secondary);"><i class="fa-solid fa-filter"></i> Filter:</span>
                <button class="clay-btn btn-filter-tag" data-id="" style="padding: 4px 12px; font-size: 0.85rem; border-radius: 16px; ${currentTagFilter === null ? 'box-shadow: inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.5);' : ''}">All</button>`;
                
            tagsData.forEach(t => {
                const isActive = currentTagFilter === t.id;
                const activeStyle = isActive ? 'box-shadow: inset 2px 2px 5px rgba(0,0,0,0.3); opacity: 0.9;' : '';
                tagsHtml += `<button class="clay-btn btn-filter-tag" data-id="${t.id}" style="padding: 4px 12px; font-size: 0.85rem; border-radius: 16px; background-color: ${t.color}; color: white; ${activeStyle}">${t.name}</button>`;
            });
            tagsHtml += `</div>`;
            html += tagsHtml;
        }

        // 4. Render Data List
        if (prompts.length === 0) {
            html += `
                <div class="clay-card" style="text-align: center; padding: 40px;">
                    <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 16px;"></i>
                    <h3>No Prompts Found</h3>
                    <p style="color: var(--text-secondary);">You haven't created any prompts yet.</p>
                </div>
            `;
        } else {
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">`;
            prompts.forEach(p => {
                const starIcon = p.is_favorite ? 'fa-solid fa-star' : 'fa-regular fa-star';
                const starColor = p.is_favorite ? 'color: #f59e0b;' : 'color: var(--text-secondary);';
                
                html += `
                    <div class="clay-card" style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h3 style="font-size: 1.2rem; margin-bottom: 4px;" title="${p.title}">${p.title}</h3>
                            <div style="display: flex; gap: 4px;">
                                <button class="icon-btn btn-favorite-prompt" data-id="${p.id}" title="Toggle Favorite" style="width: 32px; height: 32px; ${starColor}"><i class="${starIcon}"></i></button>
                                <button class="icon-btn btn-copy-prompt" data-content="${p.content.replace(/"/g, '&quot;')}" title="Copy to Clipboard" style="width: 32px; height: 32px; color: var(--primary);"><i class="fa-regular fa-copy"></i></button>
                                <button class="icon-btn btn-edit-prompt" data-id="${p.id}" data-title="${p.title}" data-content="${p.content.replace(/"/g, '&quot;')}" title="Edit Prompt" style="width: 32px; height: 32px;"><i class="fa-solid fa-pen"></i></button>
                                <button class="icon-btn btn-delete-prompt text-danger" data-id="${p.id}" title="Delete Prompt" style="width: 32px; height: 32px;"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                        <div class="markdown-preview" style="color: var(--text-secondary); font-size: 0.9rem; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-top: 8px; margin-bottom: 8px; line-height: 1.5;">
                            ${typeof marked !== 'undefined' ? marked.parse(p.content) : p.content}
                        </div>
                        <div style="display: flex; gap: 4px; margin-bottom: 8px; flex-wrap: wrap;">
                            ${p.tags ? p.tags.map(t => `<span style="background-color: ${t.color}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem;">${t.name}</span>`).join('') : ''}
                        </div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                            <span><i class="fa-solid fa-clock"></i> ${new Date(p.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        container.innerHTML = html;

        // 5. Bind Events
        const copyBtns = document.querySelectorAll('.btn-copy-prompt');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const content = btn.getAttribute('data-content');
                try {
                    await navigator.clipboard.writeText(content);
                    const icon = btn.querySelector('i');
                    icon.className = 'fa-solid fa-check';
                    btn.style.color = '#10b981';
                    setTimeout(() => {
                        icon.className = 'fa-regular fa-copy';
                        btn.style.color = 'var(--primary)';
                    }, 2000);
                } catch (err) {
                    alert('Failed to copy.');
                }
            });
        });

        const favBtns = document.querySelectorAll('.btn-favorite-prompt');
        favBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                try {
                    const { toggleFavoritePrompt } = await import('../../services/promptService.js');
                    await toggleFavoritePrompt(id);
                    renderPromptList(container);
                } catch (err) {
                    alert(err.message || 'Failed to toggle favorite');
                }
            });
        });

        const filterBtns = document.querySelectorAll('.btn-filter-tag');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tagId = btn.getAttribute('data-id');
                currentTagFilter = tagId ? tagId : null;
                renderPromptList(container);
            });
        });

        const btnAdd = document.getElementById('btn-add-prompt');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => showPromptModal(container));
        }

        const editBtns = document.querySelectorAll('.btn-edit-prompt');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const title = btn.getAttribute('data-title');
                const content = btn.getAttribute('data-content');
                showPromptModal(container, { id, title, content });
            });
        });

        const deleteBtns = document.querySelectorAll('.btn-delete-prompt');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to move this prompt to trash?')) {
                    try {
                        const { deletePrompt } = await import('../../services/promptService.js');
                        await deletePrompt(id);
                        renderPromptList(container);
                    } catch (err) {
                        alert(err.message || 'Failed to delete prompt');
                    }
                }
            });
        });

    } catch (error) {
        container.innerHTML = `
            <div class="clay-card">
                <h2 style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Error</h2>
                <p style="margin-top: 16px; color: var(--text-secondary);">${error.message}</p>
            </div>
        `;
    }
}

// Fitur Form Tambah & Edit Prompt (Task 5 & 6 & Version History Task 6)
async function showPromptModal(container, existingPrompt = null) {
    const isEdit = !!existingPrompt;
    let fullPrompt = null;
    let historyHtml = '';

    if (isEdit) {
        try {
            const { getPromptById } = await import('../../services/promptService.js');
            fullPrompt = await getPromptById(existingPrompt.id);
            
            if (fullPrompt.versions && fullPrompt.versions.length > 0) {
                historyHtml = `
                    <div style="margin-bottom: 24px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-secondary);">Version History</label>
                        <div style="max-height: 120px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 8px;">
                            ${fullPrompt.versions.map(v => `
                                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--clay-bg); padding: 8px 12px; border-radius: 8px; box-shadow: inset 1px 1px 3px rgba(0,0,0,0.1);">
                                    <div>
                                        <div style="font-size: 0.85rem; font-weight: bold; color: var(--text-primary);">Version ${v.version_number}</div>
                                        <div style="font-size: 0.75rem; color: var(--text-secondary);">${new Date(v.created_at).toLocaleString()}</div>
                                    </div>
                                    <button type="button" class="clay-btn btn-restore-version" data-content="${v.content.replace(/"/g, '&quot;')}" style="padding: 4px 12px; font-size: 0.8rem; border-radius: 8px;">Load</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        } catch (err) {
            console.error('Failed to load prompt details', err);
        }
    }
    
    // Buat elemen overlay modal
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.backdropFilter = 'blur(4px)';
    overlay.id = 'prompt-modal-overlay';

    overlay.innerHTML = `
        <div class="clay-card" style="width: 100%; max-width: 500px; padding: 32px; position: relative;">
            <button id="btn-close-modal" class="icon-btn" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px;">
                <i class="fa-solid fa-times"></i>
            </button>
            <h2 style="margin-bottom: 24px;">
                <i class="fa-solid ${isEdit ? 'fa-pen' : 'fa-plus'} text-primary"></i> 
                ${isEdit ? 'Edit Prompt' : 'Create New Prompt'}
            </h2>
            <form id="form-add-prompt">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-secondary);">Title</label>
                    <input type="text" id="prompt-title" class="clay-input" required placeholder="e.g. SEO Blog Post Generator" value="${isEdit ? existingPrompt.title : ''}">
                </div>
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-secondary);">Content</label>
                    <textarea id="prompt-content" class="clay-input" required placeholder="Write your prompt logic here..." style="min-height: 120px; resize: vertical;">${isEdit ? existingPrompt.content : ''}</textarea>
                </div>
                ${historyHtml}
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" id="btn-cancel-modal" class="clay-btn" style="background-color: var(--clay-bg); color: var(--text-primary);">Cancel</button>
                    <button type="submit" id="btn-submit-prompt" class="clay-btn">${isEdit ? 'Update Prompt' : 'Save Prompt'}</button>
                </div>
                <div id="modal-error" style="color: var(--danger); margin-top: 12px; font-size: 0.9rem;"></div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    // Bind Load Version Buttons
    const restoreBtns = document.querySelectorAll('.btn-restore-version');
    restoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.getAttribute('data-content');
            document.getElementById('prompt-content').value = content;
        });
    });

    // Event Bindings for Modal
    const closeModal = () => document.body.removeChild(overlay);
    
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
    
    // Klik di luar modal untuk menutup
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Handle Form Submit
    const form = document.getElementById('form-add-prompt');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('prompt-title').value;
        const content = document.getElementById('prompt-content').value;
        const errorDiv = document.getElementById('modal-error');
        const submitBtn = document.getElementById('btn-submit-prompt');

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        errorDiv.textContent = '';

        try {
            const promptService = await import('../../services/promptService.js');
            
            if (isEdit) {
                await promptService.updatePrompt(existingPrompt.id, { title, content });
            } else {
                await promptService.createPrompt({ title, content });
            }
            
            // Sukses: tutup modal & render ulang list
            closeModal();
            renderPromptList(container);
            
        } catch (error) {
            errorDiv.textContent = error.message || 'Failed to process request';
            submitBtn.disabled = false;
            submitBtn.textContent = isEdit ? 'Update Prompt' : 'Save Prompt';
        }
    });
}
