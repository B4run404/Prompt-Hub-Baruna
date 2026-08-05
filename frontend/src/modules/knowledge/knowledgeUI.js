import { initMarkdownEditor } from '../../utils/markdownEditor.js';

let editorInstance = null;

export async function renderKnowledgeBase(container) {
    container.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%;"><i class="fa-solid fa-spinner fa-spin fa-2x color-primary"></i></div>`;
    
    try {
        const { fetchDocuments } = await import('../../services/documentService.js');
        const documents = await fetchDocuments();

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h1 style="font-size: 1.8rem; font-weight: 700;">Knowledge Base</h1>
                <button id="btn-add-document" class="btn btn-primary clay-btn"><i class="fa-solid fa-plus"></i> Add Document</button>
            </div>
        `;

        if (!documents || documents.length === 0) {
            html += `<div class="clay-card" style="text-align: center; padding: 48px; color: var(--text-secondary);">No documents found. Start writing your knowledge base!</div>`;
        } else {
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">`;
            documents.forEach(doc => {
                const starIcon = doc.is_favorite ? 'fa-solid fa-star' : 'fa-regular fa-star';
                const starColor = doc.is_favorite ? 'color: #f59e0b;' : 'color: var(--text-secondary);';
                
                html += `
                    <div class="clay-card doc-card" data-id="${doc.id}" style="display: flex; flex-direction: column; gap: 12px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h3 style="font-size: 1.2rem; margin-bottom: 4px;" title="${doc.title}">${doc.title}</h3>
                            <div style="display: flex; gap: 4px;">
                                <button class="icon-btn btn-favorite-doc" data-id="${doc.id}" title="Toggle Favorite" style="width: 32px; height: 32px; ${starColor}"><i class="${starIcon}"></i></button>
                                <button class="icon-btn btn-edit-doc" data-id="${doc.id}" data-title="${doc.title}" data-content="${doc.content.replace(/"/g, '&quot;')}" title="Edit Document" style="width: 32px; height: 32px;"><i class="fa-solid fa-pen"></i></button>
                                <button class="icon-btn btn-delete-doc text-danger" data-id="${doc.id}" title="Delete Document" style="width: 32px; height: 32px;"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                            ${doc.content}
                        </p>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                            <span><i class="fa-solid fa-clock"></i> ${new Date(doc.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        // Modal Form for Document
        html += `
            <div id="document-modal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                <div class="clay-card" style="width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; background: var(--surface);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h2 id="document-modal-title">Create Document</h2>
                        <button id="close-document-modal" class="icon-btn"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <form id="document-form">
                        <input type="hidden" id="document-id">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" id="document-title" class="clay-input" required>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Content (Markdown)</label>
                            <textarea id="document-content" style="display:none;"></textarea>
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
                            <button type="button" id="cancel-document-btn" class="btn" style="background: transparent; border: 1px solid var(--glass-border); color: var(--text-primary);">Cancel</button>
                            <button type="submit" class="btn btn-primary clay-btn">Save Document</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Bind Events
        bindEvents(container);

    } catch (err) {
        container.innerHTML = `<div class="clay-card"><h2 class="text-danger">Failed to Load Knowledge Base</h2><p>${err.message}</p></div>`;
    }
}

function bindEvents(container) {
    const modal = document.getElementById('document-modal');
    const closeBtn = document.getElementById('close-document-modal');
    const cancelBtn = document.getElementById('cancel-document-btn');
    const form = document.getElementById('document-form');
    const idInput = document.getElementById('document-id');
    const titleInput = document.getElementById('document-title');
    const contentTextarea = document.getElementById('document-content');

    const openModal = () => {
        modal.style.display = 'flex';
        // Initialize EasyMDE if not already initialized
        if (!editorInstance) {
            // Need a slight timeout to ensure DOM is fully visible for EasyMDE
            setTimeout(() => {
                editorInstance = initMarkdownEditor('document-content');
                if (contentTextarea.value) {
                    editorInstance.value(contentTextarea.value);
                }
            }, 100);
        } else {
            editorInstance.value(contentTextarea.value);
        }
    };

    const closeModal = () => {
        modal.style.display = 'none';
        form.reset();
        idInput.value = '';
        contentTextarea.value = '';
        if (editorInstance) {
            editorInstance.value('');
        }
    };

    document.getElementById('btn-add-document').addEventListener('click', () => {
        document.getElementById('document-modal-title').textContent = 'Create Document';
        openModal();
    });

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Edit Buttons
    document.querySelectorAll('.btn-edit-doc').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('document-modal-title').textContent = 'Edit Document';
            idInput.value = btn.getAttribute('data-id');
            titleInput.value = btn.getAttribute('data-title');
            contentTextarea.value = btn.getAttribute('data-content');
            openModal();
        });
    });

    // Delete Buttons
    document.querySelectorAll('.btn-delete-doc').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this document?')) {
                try {
                    const { deleteDocument } = await import('../../services/documentService.js');
                    await deleteDocument(id);
                    renderKnowledgeBase(container);
                } catch (err) {
                    alert('Failed to delete: ' + err.message);
                }
            }
        });
    });

    // Favorite Buttons
    document.querySelectorAll('.btn-favorite-doc').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            try {
                const { toggleFavoriteDocument } = await import('../../services/documentService.js');
                await toggleFavoriteDocument(id);
                renderKnowledgeBase(container);
            } catch (err) {
                alert('Failed to toggle favorite: ' + err.message);
            }
        });
    });

    // Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get value from EasyMDE
        const contentVal = editorInstance ? editorInstance.value() : contentTextarea.value;
        
        if (!contentVal) {
            alert('Content cannot be empty');
            return;
        }

        const data = {
            title: titleInput.value,
            content: contentVal
        };

        try {
            const { createDocument, updateDocument } = await import('../../services/documentService.js');
            if (idInput.value) {
                await updateDocument(idInput.value, data);
            } else {
                await createDocument(data);
            }
            closeModal();
            renderKnowledgeBase(container);
        } catch (err) {
            alert('Failed to save document: ' + err.message);
        }
    });
}
