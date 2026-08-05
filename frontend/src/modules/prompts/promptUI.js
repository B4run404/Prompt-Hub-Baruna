import { fetchPrompts } from '../../services/promptService.js';

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
        const prompts = await fetchPrompts();

        // 3. Render Header & Button (Tombol Tambah untuk Task selanjutnya)
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="font-size: 1.8rem;"><i class="fa-solid fa-terminal text-primary"></i> Prompts Library</h2>
                <button id="btn-add-prompt" class="clay-btn">
                    <i class="fa-solid fa-plus"></i> New Prompt
                </button>
            </div>
        `;

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
                html += `
                    <div class="clay-card" style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; justify-content: space-between;">
                            <h3 style="font-size: 1.1rem; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" title="${p.title}">${p.title}</h3>
                            <button class="icon-btn" title="Options" style="width: 32px; height: 32px;"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                            ${p.content}
                        </p>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                            <span><i class="fa-solid fa-clock"></i> ${new Date(p.updated_at).toLocaleDateString()}</span>
                            ${p.is_favorite ? '<i class="fa-solid fa-star" style="color: #fbbf24;"></i>' : ''}
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = `
            <div class="clay-card">
                <h2 style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Error</h2>
                <p style="margin-top: 16px; color: var(--text-secondary);">${error.message}</p>
            </div>
        `;
    }
}
