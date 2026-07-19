import { apiFetch, saveJSON } from '../app.js';
import { renderField } from './helpers.js';

export async function ListView(filename, itemName, fields) {
  const res = await apiFetch('/api/data/' + filename);
  if (!res) return '';
  const data = await res.json();
  
  // Determine wrapper key (items, plans, packages)
  let wrapperKey = 'items';
  if (data.plans) wrapperKey = 'plans';
  if (data.packages) wrapperKey = 'packages';
  
  window.currentListData = data;
  window.currentListFile = filename;
  window.currentListWrapper = wrapperKey;
  
  window.handleListInput = (index, key, val) => {
    window.currentListData[window.currentListWrapper][index][key] = val;
  };
  
  window.removeListItem = (index) => {
    if(confirm('Delete this item?')) {
      window.currentListData[window.currentListWrapper].splice(index, 1);
      window.renderList();
    }
  };
  
  window.addListItem = () => {
    const newItem = {};
    fields.forEach(f => newItem[f] = f === 'featured' ? false : (f === 'rating' ? 5 : ''));
    window.currentListData[window.currentListWrapper].push(newItem);
    window.renderList();
  };
  
  window.saveList = async (btn) => {
    btn.disabled = true;
    btn.textContent = 'Saving...';
    await saveJSON(window.currentListFile, window.currentListData);
    btn.disabled = false;
    btn.textContent = 'Save Changes';
  };

  window.renderList = () => {
    const listContainer = document.getElementById('listContainer');
    const items = window.currentListData[window.currentListWrapper];
    
    listContainer.innerHTML = items.map((item, i) => `
      <div class="adm-card adm-mb" style="position:relative">
        <button type="button" class="adm-btn adm-btn--secondary" style="position:absolute;top:1.5rem;right:1.5rem;color:#ef4444" onclick="window.removeListItem(${i})">Delete</button>
        <h4 style="margin-top:0;margin-bottom:1.5rem;font-weight:600">Item ${i+1}</h4>
        <div class="adm-grid adm-grid--2">
          ${fields.map(f => {
             // Let long fields span full width
             const isLong = f.includes('desc') || f.includes('text') || f.includes('answer') || f.includes('features');
             return `<div style="${isLong ? 'grid-column: 1 / -1' : ''}">${renderField(f, item[f], `window.handleListInput(${i}, '${f}', this.value)`)}</div>`;
          }).join('')}
        </div>
      </div>
    `).join('');
  };

  // Give a small delay to let HTML mount before rendering
  setTimeout(() => window.renderList(), 50);

  return `
    <div class="adm-content__head">
      <h3>${itemName} Manager</h3>
      <p>Add, edit or remove items.</p>
    </div>
    
    <div id="listContainer"></div>

    <div class="adm-actions" style="justify-content:space-between">
      <button class="adm-btn adm-btn--secondary" onclick="window.addListItem()">+ Add New ${itemName}</button>
      <button class="adm-btn adm-btn--primary" onclick="window.saveList(this)">Save Changes</button>
    </div>
  `;
}
