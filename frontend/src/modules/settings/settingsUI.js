import { API_BASE_URL as CONFIG_API_URL } from '../../config.js';
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
                <div style="display: flex; gap: 12px; margin-top: 16px;">
                    <button id="btn-export-backup" class="btn btn-primary clay-btn">
                        <i class="fa-solid fa-download"></i> Download Backup (.json)
                    </button>
                    <button id="btn-restore-backup" class="btn clay-btn" style="background: rgba(255, 77, 77, 0.1); color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.3);">
                        <i class="fa-solid fa-upload"></i> Restore from Backup
                    </button>
                    <input type="file" id="input-restore-file" accept=".json" style="display: none;">
                </div>
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
            
            const response = await fetch(`${CONFIG_API_URL}/backup/export`, {
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

    // Restore Backup Logic
    const btnRestore = document.getElementById('btn-restore-backup');
    const inputRestore = document.getElementById('input-restore-file');

    btnRestore.addEventListener('click', () => {
        const confirmRestore = confirm("PERINGATAN: Melakukan Restore akan MENGHAPUS SEMUA DATA ANDA SAAT INI dan menggantinya dengan isi file backup. Apakah Anda yakin ingin melanjutkan?");
        if (confirmRestore) {
            inputRestore.click();
        }
    });

    inputRestore.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const originalText = btnRestore.innerHTML;
        btnRestore.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Restoring...`;
        btnRestore.disabled = true;

        try {
            const { getToken } = await import('../../services/authService.js');
            const token = getToken();

            const formData = new FormData();
            formData.append('backup', file);

            const response = await fetch(`${CONFIG_API_URL}/backup/import`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Gagal memulihkan data');
            }

            alert('✅ Restore berhasil! Halaman akan dimuat ulang untuk menampilkan data terbaru.');
            window.location.reload();
            
        } catch (err) {
            alert(`❌ Error Restore: ${err.message}`);
            // Reset input so they can select the same file again if it failed
            inputRestore.value = '';
        } finally {
            btnRestore.innerHTML = originalText;
            btnRestore.disabled = false;
        }
    });
}
