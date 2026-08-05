export async function renderDashboard(container) {
    container.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%;"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--primary);"></i></div>`;
    
    try {
        const { getDashboardStats } = await import('../../services/dashboardService.js');
        const stats = await getDashboardStats();

        const html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h1 style="font-size: 1.8rem; font-weight: 700;">Dashboard</h1>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div class="clay-card" style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                        <i class="fa-solid fa-folder"></i>
                    </div>
                    <div>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Total Projects</div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${stats.totalProjects}</div>
                    </div>
                </div>
                
                <div class="clay-card" style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: #10b981; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                        <i class="fa-solid fa-code"></i>
                    </div>
                    <div>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Total Prompts</div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${stats.totalPrompts}</div>
                    </div>
                </div>

                <div class="clay-card" style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: #f59e0b; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Favorites</div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${stats.favoritePrompts + stats.favoriteProjects}</div>
                    </div>
                </div>
                
                <div class="clay-card" style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: #8b5cf6; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                        <i class="fa-solid fa-tags"></i>
                    </div>
                    <div>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Categories</div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${stats.totalCategories}</div>
                    </div>
                </div>
            </div>
            
            <div id="recent-activity-container" style="margin-top: 32px;">
                <!-- Placeholder for Sprint 9 Task 5 -->
            </div>
        `;
        
        container.innerHTML = html;
        
    } catch (err) {
        container.innerHTML = `
            <div class="clay-card">
                <h2 class="text-danger">Failed to Load Dashboard</h2>
                <p>${err.message}</p>
                <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top: 16px;">Retry</button>
            </div>
        `;
    }
}
