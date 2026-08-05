export async function renderSnippetList(container) {
    container.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%;"><i class="fa-solid fa-spinner fa-spin fa-2x color-primary"></i></div>`;
    
    try {
        const { fetchSnippets } = await import('../../services/snippetService.js');
        const snippets = await fetchSnippets();

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h1 style="font-size: 1.8rem; font-weight: 700;">Code Snippets</h1>
                <button id="btn-add-snippet" class="btn btn-primary clay-btn"><i class="fa-solid fa-plus"></i> Add Snippet</button>
            </div>
        `;

        if (!snippets || snippets.length === 0) {
            html += `<div class="clay-card" style="text-align: center; padding: 48px; color: var(--text-secondary);">No snippets found. Start saving your reusable code blocks!</div>`;
        } else {
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px;">`;
            snippets.forEach(snippet => {
                const starIcon = snippet.is_favorite ? 'fa-solid fa-star' : 'fa-regular fa-star';
                const starColor = snippet.is_favorite ? 'color: #f59e0b;' : 'color: var(--text-secondary);';
                // Only show a preview of the code
                const codePreview = snippet.code.split('\\n').slice(0, 5).join('\\n');
                
                html += `
                    <div class="clay-card snippet-card" data-id="${snippet.id}" data-title="${snippet.title}" data-code="${snippet.code.replace(/"/g, '&quot;')}" data-language="${snippet.language}" style="display: flex; flex-direction: column; gap: 12px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h3 style="font-size: 1.2rem; margin-bottom: 4px;" title="${snippet.title}">${snippet.title}</h3>
                            <div style="display: flex; gap: 4px;">
                                <button class="icon-btn btn-favorite-snippet" data-id="${snippet.id}" title="Toggle Favorite" style="width: 32px; height: 32px; ${starColor}"><i class="${starIcon}"></i></button>
                                <button class="icon-btn btn-edit-snippet" data-id="${snippet.id}" data-title="${snippet.title}" data-code="${snippet.code.replace(/"/g, '&quot;')}" data-language="${snippet.language}" title="Edit Snippet" style="width: 32px; height: 32px;"><i class="fa-solid fa-pen"></i></button>
                                <button class="icon-btn btn-delete-snippet text-danger" data-id="${snippet.id}" title="Delete Snippet" style="width: 32px; height: 32px;"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; background: rgba(139, 92, 246, 0.2); color: #8b5cf6; font-weight: 600; text-transform: uppercase;">
                                ${snippet.language}
                            </span>
                        </div>
                        <div style="flex-grow: 1; max-height: 120px; overflow: hidden; position: relative;">
                            <pre style="margin: 0; padding: 8px; border-radius: 8px; font-size: 0.85rem; height: 100%;"><code class="language-${snippet.language}">${codePreview}</code></pre>
                            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; background: linear-gradient(transparent, var(--surface));"></div>
                        </div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                            <span><i class="fa-solid fa-clock"></i> ${new Date(snippet.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        // Modal Form for Snippet
        html += `
            <div id="snippet-modal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                <div class="clay-card" style="width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; background: var(--surface);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h2 id="snippet-modal-title">Add Code Snippet</h2>
                        <button id="close-snippet-modal" class="icon-btn"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <form id="snippet-form">
                        <input type="hidden" id="snippet-id">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" id="snippet-title" class="clay-input" required placeholder="e.g., Fetch API Wrapper">
                        </div>
                        <div class="form-group">
                            <label>Language</label>
                            <select id="snippet-language" class="clay-input" required style="background: var(--surface); color: var(--text-primary); border: 1px solid var(--glass-border);">
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="python">Python</option>
                                <option value="json">JSON</option>
                                <option value="bash">Bash / Shell</option>
                                <option value="sql">SQL</option>
                                <option value="plaintext">Plain Text</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Code Snippet</label>
                            <textarea id="snippet-code" class="clay-input" required rows="10" style="font-family: monospace;" placeholder="Paste your code here..."></textarea>
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
                            <button type="button" id="cancel-snippet-btn" class="btn" style="background: transparent; border: 1px solid var(--glass-border); color: var(--text-primary);">Cancel</button>
                            <button type="submit" class="btn btn-primary clay-btn">Save Snippet</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Apply Prism syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(container);
        }

        bindEvents(container);

    } catch (err) {
        container.innerHTML = `<div class="clay-card"><h2 class="text-danger">Failed to Load Snippets</h2><p>${err.message}</p></div>`;
    }
}

function bindEvents(container) {
    const modal = document.getElementById('snippet-modal');
    const closeBtn = document.getElementById('close-snippet-modal');
    const cancelBtn = document.getElementById('cancel-snippet-btn');
    const form = document.getElementById('snippet-form');
    
    const idInput = document.getElementById('snippet-id');
    const titleInput = document.getElementById('snippet-title');
    const langSelect = document.getElementById('snippet-language');
    const codeTextarea = document.getElementById('snippet-code');

    const openModal = () => {
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
        form.reset();
        idInput.value = '';
    };

    document.getElementById('btn-add-snippet').addEventListener('click', () => {
        document.getElementById('snippet-modal-title').textContent = 'Add Code Snippet';
        openModal();
    });

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Edit Buttons
    document.querySelectorAll('.btn-edit-snippet').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('snippet-modal-title').textContent = 'Edit Code Snippet';
            idInput.value = btn.getAttribute('data-id');
            titleInput.value = btn.getAttribute('data-title');
            langSelect.value = btn.getAttribute('data-language');
            codeTextarea.value = btn.getAttribute('data-code');
            openModal();
        });
    });

    // Delete Buttons
    document.querySelectorAll('.btn-delete-snippet').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this snippet?')) {
                try {
                    const { deleteSnippet } = await import('../../services/snippetService.js');
                    await deleteSnippet(id);
                    renderSnippetList(container);
                } catch (err) {
                    alert('Failed to delete: ' + err.message);
                }
            }
        });
    });

    // Favorite Buttons
    document.querySelectorAll('.btn-favorite-snippet').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            try {
                const { toggleFavoriteSnippet } = await import('../../services/snippetService.js');
                await toggleFavoriteSnippet(id);
                renderSnippetList(container);
            } catch (err) {
                alert('Failed to toggle favorite: ' + err.message);
            }
        });
    });

    // Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            title: titleInput.value,
            language: langSelect.value,
            code: codeTextarea.value
        };

        try {
            const { createSnippet, updateSnippet } = await import('../../services/snippetService.js');
            if (idInput.value) {
                await updateSnippet(idInput.value, data);
            } else {
                await createSnippet(data);
            }
            closeModal();
            renderSnippetList(container);
        } catch (err) {
            alert('Failed to save snippet: ' + err.message);
        }
    });
}
