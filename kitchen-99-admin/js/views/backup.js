import { apiFetch, showToast } from '../app.js';

export async function BackupView() {
  
  window.restoreBackup = async () => {
    const fileInput = document.getElementById('restoreFile');
    if (!fileInput.files.length) {
      alert('Please select a backup file first.');
      return;
    }
    if (!confirm('Warning: Restoring will overwrite all current website data. Are you sure?')) return;
    
    const btn = document.getElementById('restoreBtn');
    btn.disabled = true;
    btn.textContent = 'Restoring...';

    const formData = new FormData();
    formData.append('backupFile', fileInput.files[0]);

    try {
      const res = await fetch('/api/restore', { credentials: 'same-origin',  
        method: 'POST', 
        body: formData,
        headers: { 'x-csrf-token': localStorage.getItem('csrf_token') }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Website restored successfully!');
        setTimeout(() => location.reload(), 1500);
      } else {
        showToast(data.error || 'Restore failed', 'error');
        btn.disabled = false;
        btn.textContent = 'Restore from Backup';
      }
    } catch (err) {
      showToast('Restore failed', 'error');
      btn.disabled = false;
      btn.textContent = 'Restore from Backup';
    }
  };

  return `
    <div class="adm-content__head">
      <h3>System Backup</h3>
      <p>Securely backup or restore your website data.</p>
    </div>
    
    <div class="adm-grid adm-grid--2">
      <div class="adm-card">
        <h4 style="margin-top:0; font-family:'Poppins'; font-weight:600">Download Backup</h4>
        <p style="color:var(--muted); margin-bottom: 2rem; font-size: 0.95rem">Download all your website content (menus, text, configuration) as a single JSON file. This allows you to safely keep a copy of your configuration offline.</p>
        <a href="/api/backup" class="adm-btn adm-btn--primary" style="display:inline-block; text-decoration:none">Download Full Backup</a>
      </div>
      
      <div class="adm-card">
        <h4 style="margin-top:0; font-family:'Poppins'; font-weight:600">Restore Data</h4>
        <p style="color:var(--muted); margin-bottom: 1.5rem; font-size: 0.95rem">Upload a previously downloaded backup file to restore your website content. This will immediately overwrite current live data.</p>
        
        <input type="file" id="restoreFile" accept=".json" style="margin-bottom: 1rem; display: block; border: 1px dashed var(--border); width: 100%; padding: 1rem; border-radius: 6px; cursor: pointer" />
        <button id="restoreBtn" class="adm-btn adm-btn--secondary" onclick="window.restoreBackup()">Restore from Backup</button>
      </div>
    </div>
  `;
}
