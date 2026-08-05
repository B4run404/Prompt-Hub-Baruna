import { getToken } from '../../services/authService.js';

export function initSearch() {
    const searchInput = document.getElementById('global-search');
    if (!searchInput) return;

    let debounceTimer;
    const API_URL = 'http://localhost:3000/api/v1/search';

    // Create overlay container
    const searchOverlay = document.createElement('div');
    searchOverlay.id = 'search-overlay';
    searchOverlay.style.position = 'absolute';
    searchOverlay.style.top = '70px'; // just below topbar
    searchOverlay.style.left = '50%';
    searchOverlay.style.transform = 'translateX(-50%)';
    searchOverlay.style.width = '600px';
    searchOverlay.style.maxHeight = '70vh';
    searchOverlay.style.overflowY = 'auto';
    searchOverlay.style.background = 'var(--surface)';
    searchOverlay.style.border = '1px solid var(--glass-border)';
    searchOverlay.style.borderRadius = '16px';
    searchOverlay.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
    searchOverlay.style.zIndex = '2000';
    searchOverlay.style.display = 'none';
    searchOverlay.style.flexDirection = 'column';
    searchOverlay.style.padding = '16px';
    searchOverlay.style.backdropFilter = 'blur(10px)';

    // Append to body (or a relative wrapper)
    document.body.appendChild(searchOverlay);

    // Helper: close search
    const closeSearch = () => {
        searchOverlay.style.display = 'none';
    };

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (e.target !== searchInput && !searchOverlay.contains(e.target)) {
            closeSearch();
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
    });

    // Listen to input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        clearTimeout(debounceTimer);
        
        if (query.length === 0) {
            closeSearch();
            return;
        }

        searchOverlay.style.display = 'flex';
        searchOverlay.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 20px;">
                <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
                <p style="margin-top: 10px;">Mencari "${query}"...</p>
            </div>
        `;

        debounceTimer = setTimeout(async () => {
            try {
                const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`, {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                
                if (!res.ok) throw new Error('Search failed');
                
                const { data } = await res.json();
                renderResults(data, query);
            } catch (err) {
                searchOverlay.innerHTML = `
                    <div style="color: #ff4d4d; text-align: center; padding: 20px;">
                        <p><i class="fa-solid fa-triangle-exclamation"></i> Gagal mencari: ${err.message}</p>
                    </div>
                `;
            }
        }, 300);
    });

    function renderResults(results, query) {
        if (!results || results.length === 0) {
            searchOverlay.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 30px;">
                    <i class="fa-solid fa-magnifying-glass fa-2x" style="opacity: 0.5;"></i>
                    <p style="margin-top: 10px;">Tidak ada hasil untuk "${query}".</p>
                </div>
            `;
            return;
        }

        // Group results
        const groups = {
            prompt: { title: 'Prompts', icon: 'fa-terminal', color: 'var(--primary)', items: [] },
            template: { title: 'Templates', icon: 'fa-layer-group', color: '#e0b0ff', items: [] },
            snippet: { title: 'Snippets', icon: 'fa-code', color: '#3b82f6', items: [] },
            project: { title: 'Projects', icon: 'fa-folder-tree', color: '#10b981', items: [] }
        };

        results.forEach(r => {
            if (groups[r.type]) groups[r.type].items.push(r);
        });

        let html = '';
        for (const [key, group] of Object.entries(groups)) {
            if (group.items.length === 0) continue;

            html += `
                <div style="margin-bottom: 16px;">
                    <h4 style="color: var(--text-muted); margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">
                        <i class="fa-solid ${group.icon}" style="color: ${group.color}"></i> ${group.title}
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${group.items.map(item => `
                            <a href="${item.url}" class="search-result-item" style="text-decoration: none; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); padding: 12px; border-radius: 8px; display: flex; flex-direction: column; transition: all 0.2s;" onmouseover="this.style.background='rgba(138,43,226,0.1)'; this.style.borderColor='var(--primary)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'; this.style.borderColor='var(--glass-border)'">
                                <strong style="color: #fff; font-size: 1rem;">${item.title}</strong>
                                <span style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${item.subtitle}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        searchOverlay.innerHTML = html;

        // Bind clicks on links to close overlay
        searchOverlay.querySelectorAll('.search-result-item').forEach(el => {
            el.addEventListener('click', (e) => {
                closeSearch();
                searchInput.value = '';
                
                // If it's a SPA hash link, router logic will pick it up automatically 
                // However, since they are standard <a> tags with href="#hash", 
                // the browser will update the hash, and our router needs to catch it.
                // Wait, router.js only listens to .nav-item! We need to manually loadPage here.
                e.preventDefault();
                const hash = el.getAttribute('href');
                window.location.hash = hash;
                import('../../core/router.js').then(router => {
                    router.loadPage(hash.substring(1));
                });
            });
        });
    }
}
