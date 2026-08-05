/**
 * @file router.js
 * @description Modul untuk menangani navigasi SPA sederhana (Hash-based / DOM Replacement)
 */

export function initRouter() {
    const navItems = document.querySelectorAll('.nav-item[href]');
    
    // Bind click events
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.getAttribute('href').substring(1);
            loadPage(pageId);
        });
    });
}

export function loadPage(pageId) {
    const pageContent = document.getElementById('page-content');
    const navItems = document.querySelectorAll('.nav-item[href]');
    
    // Update active state in sidebar
    navItems.forEach(item => {
        if (item.getAttribute('href') === `#${pageId}`) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Dynamic Route Handling
    if (pageId === 'prompts') {
        import('../modules/prompts/promptUI.js').then(module => {
            module.renderPromptList(pageContent);
        }).catch(err => {
            pageContent.innerHTML = `<div class="clay-card"><h2 class="text-danger">Error Loading Module</h2><p>${err.message}</p></div>`;
        });
    } else {
        // Fallback for undeveloped pages
        pageContent.innerHTML = `
            <div class="clay-card">
                <h2>${pageId.charAt(0).toUpperCase() + pageId.slice(1)}</h2>
                <p style="margin-top: 16px; color: var(--text-secondary);">This module is currently under development (Sprint Planning).</p>
            </div>
        `;
    }
}
