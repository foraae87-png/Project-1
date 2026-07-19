import { apiFetch, saveJSON } from '../app.js';

export async function GalleryView(filename) {
  const res = await apiFetch('/api/data/' + filename);
  if (!res) return '';
  const data = await res.json();
  
  window.galleryData = data;
  
  window.handleGalleryInput = (index, key, val) => {
    window.galleryData.items[index][key] = val;
  };
  
  window.removeGalleryItem = (index) => {
    if(confirm('Delete this photo?')) {
      window.galleryData.items.splice(index, 1);
      window.renderGallery();
    }
  };
  
  window.addGalleryItem = (url = '') => {
    window.galleryData.items.unshift({ src: url, caption: 'New Photo', category: 'all' });
    window.renderGallery();
  };
  
  window.saveGallery = async (btn) => {
    btn.disabled = true;
    btn.textContent = 'Saving...';
    await saveJSON('gallery.json', window.galleryData);
    btn.disabled = false;
    btn.textContent = 'Save Changes';
  };

  window.renderGallery = () => {
    const container = document.getElementById('galleryContainer');
    container.innerHTML = window.galleryData.items.map((item, i) => `
      <div class="adm-card" style="padding:1rem;display:flex;flex-direction:column;gap:1rem;position:relative">
        <button class="adm-btn adm-btn--secondary" style="position:absolute;top:1.5rem;right:1.5rem;padding:0.25rem 0.5rem;background:#fee2e2;color:#ef4444;border:none" onclick="window.removeGalleryItem(${i})">X</button>
        <img src="${item.src}" style="width:100%;height:150px;object-fit:cover;border-radius:6px;border:1px solid var(--border)">
        
        <input class="adm-input" type="text" placeholder="Image URL" value="${item.src}" oninput="window.handleGalleryInput(${i}, 'src', this.value); this.previousElementSibling.src = this.value">
        <input class="adm-input" type="text" placeholder="Caption (e.g. Masala Dosa)" value="${item.caption}" oninput="window.handleGalleryInput(${i}, 'caption', this.value)">
        <select class="adm-input" onchange="window.handleGalleryInput(${i}, 'category', this.value)">
          <option value="all" ${item.category==='all'?'selected':''}>All</option>
          <option value="food" ${item.category==='food'?'selected':''}>Food</option>
          <option value="kitchen" ${item.category==='kitchen'?'selected':''}>Kitchen</option>
          <option value="events" ${item.category==='events'?'selected':''}>Events</option>
        </select>
      </div>
    `).join('');
  };

  setTimeout(() => window.renderGallery(), 50);

  return `
    <div class="adm-content__head">
      <h3>Gallery Manager</h3>
      <p>Manage photos displayed in the public gallery.</p>
    </div>
    
    <div class="adm-card adm-mb-2">
      <div class="adm-flex" style="gap:1rem;align-items:center">
        <input type="file" accept="image/*" id="galleryUploader" style="display:none" multiple onchange="
          const btn = document.getElementById('gUploadBtn');
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
            if(d.urls) {
              d.urls.forEach(url => window.addGalleryItem(url));
            }
          }).finally(() => {
            btn.textContent = original;
            btn.disabled = false;
            this.value = '';
          });
        ">
        <button id="gUploadBtn" class="adm-btn adm-btn--secondary" onclick="document.getElementById('galleryUploader').click()">Upload New Photos</button>
        <button class="adm-btn adm-btn--ghost" onclick="window.addGalleryItem()">+ Add from URL</button>
      </div>
    </div>

    <div class="adm-grid adm-grid--3" id="galleryContainer"></div>

    <div class="adm-actions">
      <button class="adm-btn adm-btn--primary" onclick="window.saveGallery(this)">Save Changes</button>
    </div>
  `;
}
