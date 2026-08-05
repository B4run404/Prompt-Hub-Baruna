import { initTheme } from './utils/themeManager.js';
import { initAuth } from './modules/auth/auth.js';
import { initRouter } from './core/router.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Tema (Dark/Light)
    initTheme();

    // 2. Inisialisasi Event Listener untuk Toggle Tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        import('./utils/themeManager.js').then(module => {
            themeToggle.addEventListener('click', module.toggleTheme);
        });
    }

    // 3. Inisialisasi Navigasi SPA
    initRouter();

    // 4. Inisialisasi Logika Autentikasi
    initAuth();

    // 5. Inisialisasi Fitur Global Search
    import('./modules/search/searchUI.js').then(module => {
        module.initSearch();
    });
});
