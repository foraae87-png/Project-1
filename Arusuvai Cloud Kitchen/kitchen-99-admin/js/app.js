import { DashboardView } from './views/dashboard.js';
import { FormView } from './views/form.js';
import { ListView } from './views/list.js';
import { GalleryView } from './views/gallery.js';
import { MediaView } from './views/media.js';
import { BackupView } from './views/backup.js';

const appContent = document.getElementById('appContent');
const pageTitle = document.getElementById('pageTitle');
const navLinks = document.querySelectorAll('.adm-nav__link');
const overlay = document.getElementById('overlay');
const sidebar = document.getElementById('sidebar');

export const state = {
  csrfToken: localStorage.getItem('csrf_token') || ''
};

// Toast notification
export function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  toastMsg.textContent = msg;
  toast.className = `adm-toast show adm-toast--${type}`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Global API Fetch wrapper to handle CSRF and Auth
export async function apiFetch(url, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.method && options.method !== 'GET') {
    headers.set('x-csrf-token', state.csrfToken);
  }
  
  const res = await fetch(url, { credentials: 'same-origin', ...options, headers });
  if (res.status === 401 || res.status === 403) {
    window.location.href = '/kitchen-99in';
    return null;
  }
  return res;
}

// Save JSON data wrapper
export async function saveJSON(filename, data) {
  const res = await apiFetch(`/api/data/${filename}`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (res && res.ok) {
    showToast('Saved successfully');
    return true;
  }
  showToast('Error saving data', 'error');
  return false;
}

// Router
async function route() {
  let hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) hash = 'dashboard';
  
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.nav === hash);
  });
  
  // Close mobile sidebar
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  
  appContent.innerHTML = '<div class="adm-empty">Loading...</div>';

  switch (hash) {
    case 'dashboard':
      pageTitle.textContent = 'Dashboard Overview';
      appContent.innerHTML = await DashboardView();
      break;
    case 'hero':
      pageTitle.textContent = 'Hero Section';
      appContent.innerHTML = await FormView('hero.json', 'Hero');
      break;
    case 'about':
      pageTitle.textContent = 'About Us';
      appContent.innerHTML = await FormView('about.json', 'About Details');
      break;
    case 'announcements':
      pageTitle.textContent = 'Announcements';
      appContent.innerHTML = await ListView('announcements.json', 'Announcement', ['title', 'description', 'enabled']);
      break;
    case 'menu':
      pageTitle.textContent = 'Menu Manager';
      appContent.innerHTML = await ListView('menu.json', 'Menu Item', ['name', 'price', 'category', 'description', 'tag', 'image']);
      break;
    case 'subscriptions':
      pageTitle.textContent = 'Meal Plans';
      appContent.innerHTML = await ListView('subscriptions.json', 'Meal Plan', ['name', 'price', 'period', 'desc', 'features', 'featured']);
      break;
    case 'corporate':
      pageTitle.textContent = 'Corporate Packages';
      appContent.innerHTML = await ListView('corporate.json', 'Package', ['name', 'price', 'unit', 'desc', 'features', 'featured']);
      break;
    case 'gallery':
      pageTitle.textContent = 'Gallery';
      appContent.innerHTML = await GalleryView('gallery.json');
      break;
    case 'testimonials':
      pageTitle.textContent = 'Testimonials';
      appContent.innerHTML = await ListView('reviews.json', 'Review', ['name', 'role', 'text', 'rating', 'source', 'avatar']);
      break;
    case 'faq':
      pageTitle.textContent = 'FAQ Manager';
      appContent.innerHTML = await ListView('faq.json', 'FAQ', ['question', 'answer']);
      break;
    case 'business':
      pageTitle.textContent = 'Business Details';
      appContent.innerHTML = await FormView('business.json', 'Business Info');
      break;
    case 'social':
      pageTitle.textContent = 'Social Media';
      appContent.innerHTML = await FormView('social.json', 'Social Links');
      break;
    case 'seo':
      pageTitle.textContent = 'SEO Settings';
      appContent.innerHTML = await FormView('seo.json', 'SEO Options');
      break;
    case 'media':
      pageTitle.textContent = 'Media Library';
      appContent.innerHTML = await MediaView();
      break;
    case 'backup':
      pageTitle.textContent = 'Backup & Restore';
      appContent.innerHTML = await BackupView();
      break;
    default:
      appContent.innerHTML = `<div class="adm-empty">Page not found for path: "${hash}"</div>`;
  }
}

// Auth verify
apiFetch('/api/verify').then(res => {
  if(res) {
    res.json().then(data => {
      state.csrfToken = data.csrfToken;
      localStorage.setItem('csrf_token', data.csrfToken);
      route();
    });
  }
});

// Event Listeners
window.addEventListener('hashchange', route);
document.getElementById('menuBtn').addEventListener('click', () => {
  sidebar.classList.add('open');
  overlay.classList.add('show');
});
overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
});
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await apiFetch('/api/logout', { method: 'POST' });
  window.location.href = '/kitchen-99in';
});
document.getElementById('themeToggle').addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
});
