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

        // 5. Bind Events
        const btnAdd = document.getElementById('btn-add-project');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                showProjectModal(container);
            });
        }

        const editBtns = document.querySelectorAll('.btn-edit-project');
        editBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                try {
                    const { getProjectById } = await import('../../services/projectService.js');
                    const response = await getProjectById(id);
                    showProjectModal(container, response.data);
                } catch (err) {
                    alert(err.message || 'Failed to fetch project details');
                }
            });
        });

        const deleteBtns = document.querySelectorAll('.btn-delete-project');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                    try {
                        const { deleteProject } = await import('../../services/projectService.js');
                        await deleteProject(id);
                        renderProjectList(container); // Refresh list
                    } catch (err) {
                        alert(err.message || 'Failed to delete project');
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

// Fitur Form Tambah & Edit Project (Task 4)
function showProjectModal(container, existingProject = null) {
    const isEdit = !!existingProject;
    
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
    overlay.id = 'project-modal-overlay';

    // Helper formatting deadline for input type="date"
    let dateValue = '';
    if (isEdit && existingProject.deadline) {
        const d = new Date(existingProject.deadline);
        dateValue = d.toISOString().split('T')[0];
    }

    overlay.innerHTML = `
        <div class="clay-card" style="width: 100%; max-width: 500px; padding: 32px; position: relative; max-height: 90vh; overflow-y: auto;">
            <button id="btn-close-project-modal" class="icon-btn" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px;">
                <i class="fa-solid fa-times"></i>
            </button>
            <h2 style="margin-bottom: 24px;">
                <i class="fa-solid ${isEdit ? 'fa-pen' : 'fa-plus'} text-primary"></i> 
                ${isEdit ? 'Edit Project' : 'Create New Project'}
            </h2>
            <form id="form-project">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-secondary);">Project Name *</label>
                    <input type="text" id="project-name" class="clay-input" required placeholder="e.g. AI Content Generator" value="${isEdit ? existingProject.name : ''}">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-secondary);">Description</label>
                    <textarea id="project-desc" class="clay-input" placeholder="What is this project about?" style="min-height: 80px; resize: vertical;">${isEdit ? (existingProject.description || '') : ''}</textarea>
                </div>
                <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-secondary);">Status</label>
                        <select id="project-status" class="clay-input">
                            <option value="Active" ${isEdit && existingProject.status === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="On Hold" ${isEdit && existingProject.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                            <option value="Completed" ${isEdit && existingProject.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-secondary);">Progress (%)</label>
                        <input type="number" id="project-progress" class="clay-input" min="0" max="100" value="${isEdit ? existingProject.progress : '0'}">
                    </div>
                </div>
                <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-secondary);">Deadline</label>
                        <input type="date" id="project-deadline" class="clay-input" value="${dateValue}">
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-secondary);">Framework</label>
                        <input type="text" id="project-framework" class="clay-input" placeholder="e.g. Next.js" value="${isEdit ? (existingProject.framework || '') : ''}">
                    </div>
                </div>

                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" id="btn-cancel-project-modal" class="clay-btn" style="background-color: var(--clay-bg); color: var(--text-primary);">Cancel</button>
                    <button type="submit" id="btn-submit-project" class="clay-btn">${isEdit ? 'Update Project' : 'Save Project'}</button>
                </div>
                <div id="project-modal-error" style="color: var(--danger); margin-top: 12px; font-size: 0.9rem;"></div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeModal = () => document.body.removeChild(overlay);
    
    document.getElementById('btn-close-project-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-project-modal').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    const form = document.getElementById('form-project');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('project-name').value;
        const description = document.getElementById('project-desc').value;
        const status = document.getElementById('project-status').value;
        const progress = parseInt(document.getElementById('project-progress').value, 10);
        let deadline = document.getElementById('project-deadline').value;
        const framework = document.getElementById('project-framework').value;
        
        // Convert empty string to null for optional fields
        const data = {
            name,
            description: description || null,
            status,
            progress: isNaN(progress) ? 0 : progress,
            framework: framework || null,
            deadline: deadline ? new Date(deadline).toISOString() : null
        };

        const errorDiv = document.getElementById('project-modal-error');
        const submitBtn = document.getElementById('btn-submit-project');

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        errorDiv.textContent = '';

        try {
            const projectService = await import('../../services/projectService.js');
            
            if (isEdit) {
                // Update will be handled in Task 5
                await projectService.updateProject(existingProject.id, data);
            } else {
                await projectService.createProject(data);
            }
            
            closeModal();
            renderProjectList(container); // Refresh
            
        } catch (error) {
            errorDiv.textContent = error.message || 'Failed to process request';
            submitBtn.disabled = false;
            submitBtn.textContent = isEdit ? 'Update Project' : 'Save Project';
        }
    });
}
