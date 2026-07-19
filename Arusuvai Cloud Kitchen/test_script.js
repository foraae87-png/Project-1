  
    let currentFile = null;
    let currentData = null;

    async function loadFileList() {
      const res = await fetch('/api/data');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const files = await res.json();
      const list = document.getElementById('navList');
      list.innerHTML = '';
      
      // Dashboard Tab
      const dashLi = document.createElement('li');
      dashLi.className = 'nav-item active';
      dashLi.textContent = 'DASHBOARD';
      dashLi.onclick = () => showDashboard(dashLi);
      list.appendChild(dashLi);

      files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.textContent = file.replace('.json', '').replace(/-/g, ' ').toUpperCase();
        li.onclick = () => selectFile(file, li);
        list.appendChild(li);
      });
      
      // Backup Manager Tab
      const backupLi = document.createElement('li');
      backupLi.className = 'nav-item';
      backupLi.textContent = 'BACKUP MANAGER';
      backupLi.style.borderTop = '1px solid var(--ad-border)';
      backupLi.onclick = () => showBackup(backupLi);
      list.appendChild(backupLi);

      showDashboard(dashLi);
    }

    function showBackup(el) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('pageTitle').textContent = 'Backup & Restore';
      document.getElementById('editorContainer').style.display = 'none';
      document.getElementById('dashboardView').style.display = 'none';
      currentFile = null;

      let backupView = document.getElementById('backupView');
      if (!backupView) {
        backupView = document.createElement('div');
        backupView.id = 'backupView';
        backupView.style.padding = '2rem';
        backupView.innerHTML = `
          <div style="background: white; padding: 2rem; border-radius: 8px; border: 1px solid var(--ad-border); max-width: 600px;">
            <h2 style="margin-top:0;">Backup Website Data</h2>
            <p style="color: var(--ad-muted);">Download all your website content (menus, gallery, text) as a single file.</p>
            <a href="/api/backup" class="btn btn--primary" style="display:inline-block; text-decoration:none; margin-bottom: 2rem;">Download Backup</a>

            <h2 style="margin-top:1rem; border-top: 1px solid var(--ad-border); padding-top: 1.5rem;">Restore Data</h2>
            <p style="color: var(--ad-muted);">Upload a previously downloaded backup file to restore your website content.</p>
            <input type="file" id="restoreFile" accept=".json" style="margin-bottom: 1rem; display: block;" />
            <button class="btn btn--secondary" onclick="restoreBackup()">Restore from Backup</button>
          </div>
        `;
        document.querySelector('.main-content').appendChild(backupView);
      }
      backupView.style.display = 'block';
    }

    async function restoreBackup() {
      const fileInput = document.getElementById('restoreFile');
      if (!fileInput.files.length) {
        alert('Please select a backup file first.');
        return;
      }
      if (!confirm('Warning: Restoring will overwrite all current website data. Are you sure?')) return;
      
      const formData = new FormData();
      formData.append('backupFile', fileInput.files[0]);

      try {
        const res = await fetch('/api/restore', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          showToast('Website restored successfully!');
          setTimeout(() => location.reload(), 1500);
        } else {
          showToast(data.error || 'Restore failed', true);
        }
      } catch (err) {
        showToast('Restore failed', true);
      }
    }

    async function showDashboard(el) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('pageTitle').textContent = 'Overview';
      document.getElementById('editorContainer').style.display = 'none';
      document.getElementById('dashboardView').style.display = 'block';
      const backupView = document.getElementById('backupView');
      if (backupView) backupView.style.display = 'none';
      currentFile = null;

      try {
        const res = await fetch('/api/stats');
        const stats = await res.json();
        const grid = document.getElementById('dashboardStats');
        grid.innerHTML = `
          <div style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--ad-border); text-align: center;">
            <div style="font-size: 2.5rem; font-weight: bold; color: var(--ad-primary);">${stats.menuItems}</div>
            <div style="color: var(--ad-muted); margin-top: 0.5rem; font-weight: 500;">Menu Items</div>
          </div>
          <div style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--ad-border); text-align: center;">
            <div style="font-size: 2.5rem; font-weight: bold; color: var(--ad-primary);">${stats.galleryImages}</div>
            <div style="color: var(--ad-muted); margin-top: 0.5rem; font-weight: 500;">Gallery Images</div>
          </div>
          <div style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--ad-border); text-align: center;">
            <div style="font-size: 2.5rem; font-weight: bold; color: var(--ad-primary);">${stats.reviews}</div>
            <div style="color: var(--ad-muted); margin-top: 0.5rem; font-weight: 500;">Reviews</div>
          </div>
          <div style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--ad-border); text-align: center;">
            <div style="font-size: 2.5rem; font-weight: bold; color: var(--ad-primary);">${stats.mealPlans}</div>
            <div style="color: var(--ad-muted); margin-top: 0.5rem; font-weight: 500;">Meal Plans</div>
          </div>
          <div style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--ad-border); text-align: center;">
            <div style="font-size: 2.5rem; font-weight: bold; color: var(--ad-primary);">${stats.corporatePackages}</div>
            <div style="color: var(--ad-muted); margin-top: 0.5rem; font-weight: 500;">Corporate Packages</div>
          </div>
        `;
      } catch(e) {
        console.error(e);
      }
    }

    async function selectFile(file, el) {
      currentFile = file;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('pageTitle').textContent = 'Editing: ' + file.replace('.json', '');
      
      document.getElementById('dashboardView').style.display = 'none';
      const backupView = document.getElementById('backupView');
      if (backupView) backupView.style.display = 'none';
      document.getElementById('editorContainer').style.display = 'flex';
      
      await loadSelected();
    }

    async function loadSelected() {
      if (!currentFile) return;
      const res = await fetch('/api/data/' + currentFile);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      currentData = await res.json();
      renderForm();
    }

    function renderForm() {
      const container = document.getElementById('dynamicForm');
      container.innerHTML = '';
      container.appendChild(buildNode(currentData, 'root', currentData));
    }

    function buildNode(data, key, parentContext, index = null) {
      if (Array.isArray(data)) {
        return buildArray(data, key, parentContext);
      } else if (typeof data === 'object' && data !== null) {
        return buildObject(data, key, index);
      } else {
        return buildField(data, key, parentContext, index);
      }
    }

    function buildObject(obj, title, index) {
      const wrapper = document.createElement('div');
      wrapper.className = 'object-group';
      
      if (title !== 'root') {
        const h3 = document.createElement('h3');
        h3.className = 'object-group-title';
        h3.textContent = (typeof index === 'number') ? `Item ${index + 1}` : title.replace(/_/g, ' ');
        wrapper.appendChild(h3);
      }

      const fieldsContainer = document.createElement('div');
      for (const k in obj) {
        fieldsContainer.appendChild(buildNode(obj[k], k, obj));
      }
      wrapper.appendChild(fieldsContainer);

      const addFieldBtn = document.createElement('button');
      addFieldBtn.type = 'button';
      addFieldBtn.className = 'btn-add-field';
      addFieldBtn.textContent = '+ Add New Field';
      addFieldBtn.onclick = () => {
        const newKey = prompt('Enter name for the new field:');
        if (newKey && !obj.hasOwnProperty(newKey)) {
          obj[newKey] = '';
          renderForm();
        } else if (newKey) {
          alert('Field already exists!');
        }
      };
      wrapper.appendChild(addFieldBtn);

      return wrapper;
    }

    function buildArray(arr, key, parentContext) {
      const wrapper = document.createElement('div');
      wrapper.className = 'array-container';
      
      const title = document.createElement('h3');
      title.className = 'object-group-title';
      title.textContent = key.replace(/_/g, ' ') + ' (List)';
      wrapper.appendChild(title);

      const itemsContainer = document.createElement('div');
      
      arr.forEach((item, index) => {
        const itemWrap = document.createElement('div');
        itemWrap.className = 'array-item';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => {
          if (confirm('Are you sure you want to remove this item?')) {
            arr.splice(index, 1);
            renderForm();
          }
        };
        itemWrap.appendChild(removeBtn);
        itemWrap.appendChild(buildNode(item, key, arr, index));
        itemsContainer.appendChild(itemWrap);
      });
      
      wrapper.appendChild(itemsContainer);

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn btn--primary';
      addBtn.style.marginTop = '1rem';
      addBtn.textContent = '+ Add New ' + key.replace(/_/g, ' ');
      addBtn.onclick = () => {
        let newItem = '';
        if (arr.length > 0) {
          if (typeof arr[0] === 'object') {
            newItem = {};
            for (let k in arr[0]) {
              newItem[k] = typeof arr[0][k] === 'number' ? 0 : (typeof arr[0][k] === 'boolean' ? false : '');
            }
          }
        } else {
           // Default to object if empty array
           newItem = { name: '', description: '' };
        }
        arr.push(newItem);
        renderForm();
      };
      wrapper.appendChild(addBtn);

      return wrapper;
    }

    function buildField(val, key, parentContext, index) {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-group';
      
      const label = document.createElement('label');
      label.textContent = key.replace(/_/g, ' ');
      wrapper.appendChild(label);

      let input;
      // If it's a long text or a description, use textarea
      if (typeof val === 'string' && (val.length > 80 || key.toLowerCase().includes('description') || key.toLowerCase().includes('text') || key.toLowerCase().includes('review') || key.toLowerCase().includes('features'))) {
        input = document.createElement('textarea');
        input.className = 'form-control';
        input.value = val;
      } else {
        input = document.createElement('input');
        input.className = 'form-control';
        input.type = typeof val === 'number' ? 'number' : 'text';
        if (typeof val === 'boolean') input.type = 'checkbox';
        if (typeof val === 'boolean') input.checked = val;
        else input.value = val;
      }

      input.oninput = (e) => {
        let newVal = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        if (typeof val === 'number') newVal = Number(newVal);
        
        if (index !== null && Array.isArray(parentContext)) {
          parentContext[index] = newVal;
        } else {
          parentContext[key] = newVal;
        }
      };

      wrapper.appendChild(input);

      // Image Upload Button if key implies image
      if (typeof val === 'string' && (key.toLowerCase().includes('image') || key.toLowerCase().includes('src') || key.toLowerCase().includes('avatar') || key.toLowerCase().includes('icon'))) {
        const uploadWrap = document.createElement('div');
        uploadWrap.style.marginTop = '0.5rem';
        uploadWrap.style.display = 'flex';
        uploadWrap.style.gap = '1rem';
        uploadWrap.style.alignItems = 'center';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        const uploadBtn = document.createElement('button');
        uploadBtn.type = 'button';
        uploadBtn.className = 'btn btn--secondary';
        uploadBtn.textContent = 'Upload Image';
        uploadBtn.onclick = () => fileInput.click();

        const preview = document.createElement('img');
        preview.src = val;
        preview.style.height = '60px';
        preview.style.borderRadius = '4px';
        preview.style.objectFit = 'cover';
        if (!val) preview.style.display = 'none';

        fileInput.onchange = async (e) => {
          if (!e.target.files.length) return;
          const file = e.target.files[0];
          uploadBtn.textContent = 'Uploading...';
          uploadBtn.disabled = true;

          const formData = new FormData();
          formData.append('file', file);

          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });
            const data = await res.json();
            if (data.url) {
              input.value = data.url;
              preview.src = data.url;
              preview.style.display = 'block';
              
              if (index !== null && Array.isArray(parentContext)) {
                parentContext[index] = data.url;
              } else {
                parentContext[key] = data.url;
              }
              showToast('Image uploaded successfully!');
            } else {
              showToast(data.error || 'Upload failed', true);
            }
          } catch (err) {
            showToast('Upload failed', true);
          } finally {
            uploadBtn.textContent = 'Upload Image';
            uploadBtn.disabled = false;
          }
        };

        uploadWrap.appendChild(uploadBtn);
        uploadWrap.appendChild(fileInput);
        uploadWrap.appendChild(preview);
        wrapper.appendChild(uploadWrap);
      }

      return wrapper;
    }

    async function saveData() {
      if (!currentFile || !currentData) return;
      
      const res = await fetch('/api/data/' + currentFile, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentData)
      });
      if (res.ok) {
        showToast('Saved successfully!');
      } else {
        showToast('Error saving file', true);
      }
    }
    
    async function logout() {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }

    function showToast(msg, isError = false) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.className = 'toast show' + (isError ? ' error' : '');
      setTimeout(() => toast.className = 'toast', 3000);
    }

    loadFileList();
  
