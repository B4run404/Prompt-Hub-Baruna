import { fetchProjects } from '../../services/projectService.js';

export async function renderProjectList(container) {
    // 1. Loading State
    container.innerHTML = `
        <div class="clay-card">
            <h2><i class="fa-solid fa-folder-tree text-primary"></i> Projects</h2>
            <p style="margin-top: 16px;">Loading your projects...</p>
        </div>
    `;

    try {
        // 2. Fetch Data
        const res = await fetchProjects();
        const projects = res.data || []; // Depending on API format

        // 3. Render Header & Button
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="font-size: 1.8rem;"><i class="fa-solid fa-folder-tree text-primary"></i> Projects</h2>
                <button id="btn-add-project" class="clay-btn">
                    <i class="fa-solid fa-plus"></i> New Project
                </button>
            </div>
        `;

        // 4. Render Data List
        if (projects.length === 0) {
            html += `
                <div class="clay-card" style="text-align: center; padding: 40px;">
                    <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 16px;"></i>
                    <h3>No Projects Found</h3>
                    <p style="color: var(--text-secondary);">Start organizing your prompts by creating a project.</p>
                </div>
            `;
        } else {
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">`;
            projects.forEach(p => {
                const statusColor = p.status === 'Completed' ? 'var(--success, #10b981)' : 'var(--primary)';
                const progressWidth = p.progress ? p.progress : 0;
                
                html += `
                    <div class="clay-card" style="display: flex; flex-direction: column; gap: 12px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h3 style="font-size: 1.2rem; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; margin-bottom: 4px;" title="${p.name}">${p.name}</h3>
                            <div style="display: flex; gap: 4px;">
                                <button class="icon-btn btn-edit-project" data-id="${p.id}" title="Edit Project" style="width: 32px; height: 32px;"><i class="fa-solid fa-pen"></i></button>
                                <button class="icon-btn btn-delete-project text-danger" data-id="${p.id}" title="Delete Project" style="width: 32px; height: 32px;"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${p.description || 'No description provided.'}
                        </p>
                        
                        <!-- Status and Deadline -->
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-top: 8px;">
                            <span style="background: rgba(139, 92, 246, 0.1); color: ${statusColor}; padding: 2px 8px; border-radius: 12px; font-weight: 500;">
                                ${p.status || 'Active'}
                            </span>
                            <span style="color: var(--text-secondary);">
                                <i class="fa-solid fa-calendar"></i> ${p.deadline ? new Date(p.deadline).toLocaleDateString() : 'No Deadline'}
                            </span>
                        </div>

                        <!-- Progress Bar -->
                        <div style="margin-top: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 4px;">
                                <span>Progress</span>
                                <span>${progressWidth}%</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 4px; overflow: hidden; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);">
                                <div style="height: 100%; width: ${progressWidth}%; background-color: var(--primary); border-radius: 4px;"></div>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        container.innerHTML = html;

        // 5. Bind Events (Stubs for next tasks)
        const btnAdd = document.getElementById('btn-add-project');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                alert('Add Project Modal will be implemented in Task 4');
            });
        }

        const editBtns = document.querySelectorAll('.btn-edit-project');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                alert('Edit Project Modal will be implemented in Task 5');
            });
        });

        const deleteBtns = document.querySelectorAll('.btn-delete-project');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                alert('Delete Project will be implemented in Task 5');
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
