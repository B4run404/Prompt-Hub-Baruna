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
                <div class="clay-card">
                    <h2 style="font-size: 1.2rem; margin-bottom: 16px;">Recent Activity</h2>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr style="border-bottom: 2px solid var(--glass-border);">
                                    <th style="padding: 12px; color: var(--text-secondary); font-weight: 600;">Type</th>
                                    <th style="padding: 12px; color: var(--text-secondary); font-weight: 600;">Title / Name</th>
                                    <th style="padding: 12px; color: var(--text-secondary); font-weight: 600;">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stats.recentActivity && stats.recentActivity.length > 0 ? stats.recentActivity.map(act => `
                                    <tr style="border-bottom: 1px solid var(--glass-border);">
                                        <td style="padding: 12px;">
                                            <span style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; background: ${act.type === 'Prompt' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)'}; color: ${act.type === 'Prompt' ? '#10b981' : '#8b5cf6'};">
                                                ${act.type}
                                            </span>
                                        </td>
                                        <td style="padding: 12px; font-weight: 500;">${act.title}</td>
                                        <td style="padding: 12px; color: var(--text-secondary);">${new Date(act.updated_at).toLocaleString()}</td>
                                    </tr>
                                `).join('') : '<tr><td colspan="3" style="padding: 12px; text-align: center; color: var(--text-secondary);">No recent activity found.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
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
