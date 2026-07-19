import { apiFetch, saveJSON } from '../app.js';
import { renderField } from './helpers.js';

export async function FormView(filename, title) {
  const res = await apiFetch('/api/data/' + filename);
  if (!res) return '';
  const data = await res.json();
  
  // Store reference to data to save later
  window.currentFormData = data;
  window.currentFormFile = filename;

  window.handleFormInput = (key, val) => {
    window.currentFormData[key] = val;
  };

  window.saveForm = async (btn) => {
    btn.disabled = true;
    btn.textContent = 'Saving...';
    await saveJSON(window.currentFormFile, window.currentFormData);
    btn.disabled = false;
    btn.textContent = 'Save Changes';
  };

  const fieldsHTML = Object.entries(data).map(([key, value]) => {
    return renderField(key, value, `window.handleFormInput('${key}', this.value)`);
  }).join('');

  return `
    <div class="adm-content__head">
      <h3>${title}</h3>
      <p>Update the configuration below.</p>
    </div>
    
    <div class="adm-card adm-mb-2">
      ${fieldsHTML}
    </div>

    <div class="adm-actions">
      <button class="adm-btn adm-btn--primary" onclick="window.saveForm(this)">Save Changes</button>
    </div>
  `;
}
