// App Entry Point

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const loginScreen = document.getElementById('login-screen');
    const appShell = document.getElementById('app-shell');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const themeToggle = document.getElementById('theme-toggle');
    const logoutBtn = document.getElementById('logout-btn');
    const navItems = document.querySelectorAll('.nav-item[href]');
    
    // Check Auth State
    const checkAuth = () => {
        const token = localStorage.getItem('prompthub_token');
        if (token) {
            // User is logged in
            loginScreen.classList.add('hidden');
            appShell.classList.remove('hidden');
            // Mock fetching dashboard content
            loadPage('dashboard');
        } else {
            // User is not logged in
            loginScreen.classList.remove('hidden');
            appShell.classList.add('hidden');
        }
    };

    // Theme Management
    const initTheme = () => {
        const savedTheme = localStorage.getItem('prompthub_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('prompthub_theme', newTheme);
        updateThemeIcon(newTheme);
    };

    const updateThemeIcon = (theme) => {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-moon';
        } else {
            icon.className = 'fa-solid fa-sun';
        }
    };

    // Navigation
    const loadPage = (pageId) => {
        const pageContent = document.getElementById('page-content');
        
        // Update active nav item
        navItems.forEach(item => {
            if (item.getAttribute('href') === `#${pageId}`) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Placeholder for dynamic content loading
        pageContent.innerHTML = `
            <div class="clay-card">
                <h2>${pageId.charAt(0).toUpperCase() + pageId.slice(1)}</h2>
                <p style="margin-top: 16px; color: var(--text-secondary);">This module is currently under development (Sprint Planning).</p>
            </div>
        `;
    };

    // Event Listeners
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Temporary mock authentication since backend is not yet running
            if (email === 'Baruna404' && password === 'bagusbae123') {
                localStorage.setItem('prompthub_token', 'mock_jwt_token');
                checkAuth();
            } else {
                loginError.textContent = 'Invalid ID or password. Use Baruna404 / bagusbae123';
            }
            
            // TODO: Replace with real API call
            /*
            try {
                const res = await fetch('http://localhost:3000/api/v1/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('prompthub_token', data.token);
                    checkAuth();
                } else {
                    loginError.textContent = data.message || 'Login failed';
                }
            } catch (err) {
                loginError.textContent = 'Server error. Is backend running?';
            }
            */
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('prompthub_token');
            checkAuth();
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.getAttribute('href').substring(1);
            loadPage(pageId);
        });
    });

    // Initialize
    initTheme();
    checkAuth();
});
