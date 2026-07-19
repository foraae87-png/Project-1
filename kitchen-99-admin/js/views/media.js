import { apiFetch } from '../app.js';

export async function MediaView() {
  window.loadMedia = async () => {
    const res = await apiFetch('/api/media');
    if(!res) return;
    const files = await res.json();
    
    const container = document.getElementById('mediaContainer');
    if(!files.length) {
      container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--muted)">No media uploaded yet.</div>';
      return;
    }
    
    container.innerHTML = files.map(f => {
      const isImg = f.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
      const preview = isImg 
        ? `<img src="${f.url}" style="width:100%;height:140px;object-fit:cover;border-radius:6px 6px 0 0;">`
        : `<div style="width:100%;height:140px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;border-radius:6px 6px 0 0;"><svg viewBox="0 0 24 24" width="48" stroke="var(--muted)" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div>`;
      
      const sizeKB = Math.round(f.size / 1024);
      
      return `
        <div class="adm-card" style="padding:0">
          ${preview}
          <div style="padding:1rem">
            <div style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.9rem;margin-bottom:0.25rem" title="${f.name}">${f.name}</div>
            <div style="color:var(--muted);font-size:0.8rem;margin-bottom:1rem">${sizeKB} KB</div>
            <div class="adm-flex" style="gap:0.5rem">
              <button class="adm-btn adm-btn--secondary" style="flex:1;padding:0.25rem;font-size:0.8rem" onclick="navigator.clipboard.writeText(window.location.origin + '${f.url}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy URL', 2000)">Copy URL</button>
              <button class="adm-btn adm-btn--secondary" style="background:#fee2e2;color:#ef4444;border:none;padding:0.25rem 0.5rem" onclick="window.deleteMedia('${f.name}')">
                <svg viewBox="0 0 24 24" width="16" stroke="currentColor" fill="none"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  window.deleteMedia = async (filename) => {
    if(confirm('Are you sure you want to delete this file? This cannot be undone.')) {
      await apiFetch('/api/media/' + filename, { method: 'DELETE' });
      window.loadMedia();
    }
  };
  
  setTimeout(() => window.loadMedia(), 50);

  return `
    <div class="adm-content__head adm-flex adm-flex--between" style="align-items:center">
      <div>
        <h3>Media Library</h3>
        <p>Manage uploaded files and images.</p>
      </div>
      <div>
        <input type="file" id="bulkUpload" multiple style="display:none" onchange="
          const btn = document.getElementById('mUploadBtn');
          const original = btn.textContent;
          btn.textContent = 'Uploading...';
          btn.disabled = true;
          const fd = new FormData();
          for(let f of this.files) fd.append('files', f);
          fetch('/api/upload', { credentials: 'same-origin', 
            method: 'POST',
            body: fd,
            headers: { 'x-csrf-token': localStorage.getItem('csrf_token') }
          }).then(r => r.json()).then(d => {
            window.loadMedia();
          }).finally(() => {
            btn.textContent = original;
            btn.disabled = false;
            this.value = '';
          });
        ">
        <button id="mUploadBtn" class="adm-btn adm-btn--primary" onclick="document.getElementById('bulkUpload').click()">Upload Files</button>
      </div>
    </div>
    
    <div class="adm-grid adm-grid--4" id="mediaContainer">
      <div style="color:var(--muted)">Loading media...</div>
    </div>
  `;
}
