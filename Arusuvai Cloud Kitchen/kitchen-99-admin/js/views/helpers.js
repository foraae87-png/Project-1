// Helper to build a form field
export function renderField(key, value, onchange) {
  let inputHtml = '';
  const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  if (typeof value === 'boolean') {
    inputHtml = `
      <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer">
        <input type="checkbox" ${value ? 'checked' : ''} onchange="if(this.checked){${onchange.replace('this.value', 'true')}}else{${onchange.replace('this.value', 'false')}}">
        ${label}
      </label>
    `;
    return `<div class="adm-form-group">${inputHtml}</div>`;
  }

  // String / Number
  if (typeof value === 'string' && (value.length > 50 || key.includes('desc') || key.includes('text') || key.includes('features') || key.includes('answer'))) {
    inputHtml = `<textarea class="adm-input" rows="4" oninput="${onchange}">${value}</textarea>`;
  } else {
    inputHtml = `<input class="adm-input" type="text" value="${value}" oninput="${onchange}">`;
  }

  let imgUpload = '';
  if (typeof value === 'string' && (key.includes('image') || key.includes('icon') || key.includes('avatar') || key.includes('src'))) {
    const previewId = 'prev_' + Math.random().toString(36).substr(2, 9);
    imgUpload = `
      <div class="adm-flex adm-mt-1" style="gap:1rem; align-items:center">
        <img id="${previewId}" src="${value || ''}" style="height: 60px; border-radius: 4px; object-fit: cover; display: ${value ? 'block' : 'none'}; border: 1px solid var(--border)">
        <input type="file" accept="image/*" style="display:none" onchange="window.uploadHelper(this, '${previewId}', (url) => { ${onchange.replace('this.value', 'url')} })">
        <button class="adm-btn adm-btn--secondary" type="button" onclick="this.previousElementSibling.click()">Upload Image</button>
      </div>
    `;
  }

  return `
    <div class="adm-form-group">
      <label>${label}</label>
      ${inputHtml}
      ${imgUpload}
    </div>
  `;
}

// Global upload helper
window.uploadHelper = async (input, previewId, callback) => {
  if (!input.files.length) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('files', file); // API expects 'files' array for multer array() but single works too since it's multer.array('files')
  
  const originalText = input.nextElementSibling.textContent;
  input.nextElementSibling.textContent = 'Uploading...';
  input.nextElementSibling.disabled = true;

  try {
    const res = await fetch('/api/upload', { credentials: 'same-origin', 
      method: 'POST',
      body: formData,
      headers: { 'x-csrf-token': localStorage.getItem('csrf_token') }
    });
    const data = await res.json();
    if (data.urls && data.urls.length) {
      const url = data.urls[0];
      const preview = document.getElementById(previewId);
      preview.src = url;
      preview.style.display = 'block';
      input.previousElementSibling.value = url; // Update the actual text input if needed
      callback(url);
    } else {
      alert('Upload failed: ' + (data.error || ''));
    }
  } catch (e) {
    alert('Upload failed');
  } finally {
    input.nextElementSibling.textContent = originalText;
    input.nextElementSibling.disabled = false;
  }
};
