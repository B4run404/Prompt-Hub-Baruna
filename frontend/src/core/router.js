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
    if (pageId === 'dashboard') {
        import('../modules/dashboard/dashboardUI.js').then(module => {
            module.renderDashboard(pageContent);
        }).catch(err => {
            pageContent.innerHTML = `<div class="clay-card"><h2 class="text-danger">Error Loading Module</h2><p>${err.message}</p></div>`;
        });
    } else if (pageId === 'prompts') {
        import('../modules/prompts/promptUI.js').then(module => {
            module.renderPromptList(pageContent);
        }).catch(err => {
            pageContent.innerHTML = `<div class="clay-card"><h2 class="text-danger">Error Loading Module</h2><p>${err.message}</p></div>`;
        });
    } else if (pageId === 'projects') {
        import('../modules/projects/projectUI.js').then(module => {
            module.renderProjectList(pageContent);
        }).catch(err => {
            pageContent.innerHTML = `<div class="clay-card"><h2 class="text-danger">Error Loading Module</h2><p>${err.message}</p></div>`;
        });
    } else if (pageId === 'knowledge') {
        import('../modules/knowledge/knowledgeUI.js').then(module => {
            module.renderKnowledgeBase(pageContent);
        }).catch(err => {
            pageContent.innerHTML = `<div class="clay-card"><h2 class="text-danger">Error Loading Module</h2><p>${err.message}</p></div>`;
        });
    } else if (pageId === 'snippets') {
        import('../modules/snippets/snippetUI.js').then(module => {
            module.renderSnippetList(pageContent);
        }).catch(err => {
            pageContent.innerHTML = `<div class="clay-card"><h2 class="text-danger">Error Loading Module</h2><p>${err.message}</p></div>`;
        });
    } else if (pageId === 'assets') {
        import('../modules/assets/assetUI.js').then(module => {
            module.renderAssetGallery(pageContent);
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
