export async function renderSettingsPage(container) {
    container.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding-bottom: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2>Settings & Backup</h2>
            </div>
            
            <div class="clay-card" style="margin-top: 24px;">
                <h3><i class="fa-solid fa-cloud-arrow-down" style="color: var(--primary);"></i> Export Data Backup</h3>
                <p style="color: var(--text-muted); margin: 8px 0 20px 0; font-size: 0.95rem;">
                    Download all your workspace data including Prompts, Projects, Templates, Snippets, and Tags into a single JSON file. Keep this file safe.
                </p>
                <button id="btn-export-backup" class="btn btn-primary clay-btn">
                    <i class="fa-solid fa-download"></i> Download Backup (.json)
                </button>
            </div>
        </div>
    `;

    document.getElementById('btn-export-backup').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mempersiapkan Backup...`;
        btn.disabled = true;

        try {
            const { getToken } = await import('../../services/authService.js');
            const token = getToken();
            
            const response = await fetch('http://localhost:3000/api/v1/backup/export', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Gagal mengekspor data');
            }

            // Parse filename from Content-Disposition if available
            let filename = `prompthub-backup-${new Date().getTime()}.json`;
            const disposition = response.headers.get('Content-Disposition');
            if (disposition && disposition.includes('filename=')) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) filename = match[1];
            }

            // Create Blob and Download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            a.remove();
            
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}
