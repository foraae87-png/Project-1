import { apiFetch } from '../app.js';

export async function DashboardView() {
  const res = await apiFetch('/api/stats');
  if (!res) return '';
  const stats = await res.json();
  
  return `
    <div class="adm-content__head">
      <h3>Welcome back, Admin</h3>
      <p>Here's an overview of your Arusuvai Cloud Kitchen website content.</p>
    </div>

    <div class="adm-grid adm-grid--4">
      <div class="adm-card">
        <div class="adm-stat__icon adm-stat__icon--primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11h18M5 11a7 7 0 0 1 14 0M12 18a2 2 0 0 0 2-2v-2h-4v2a2 2 0 0 0 2 2Z"/></svg>
        </div>
        <div class="adm-stat__num">${stats.menuItems}</div>
        <div class="adm-stat__label">Menu Items</div>
      </div>
      <div class="adm-card">
        <div class="adm-stat__icon adm-stat__icon--accent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <div class="adm-stat__num">${stats.galleryImages}</div>
        <div class="adm-stat__label">Gallery Photos</div>
      </div>
      <div class="adm-card">
        <div class="adm-stat__icon adm-stat__icon--blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-9M14 17H5M17 7a3 3 0 1 0-6 0M7 17a3 3 0 1 0 6 0"/></svg>
        </div>
        <div class="adm-stat__num">${stats.reviews}</div>
        <div class="adm-stat__label">Reviews</div>
      </div>
      <div class="adm-card">
        <div class="adm-stat__icon adm-stat__icon--purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/></svg>
        </div>
        <div class="adm-stat__num">${stats.faqs}</div>
        <div class="adm-stat__label">FAQ Entries</div>
      </div>
    </div>

    <div class="adm-grid adm-grid--2 adm-mt-2">
      <div class="adm-card">
        <div class="adm-flex adm-flex--between adm-mb">
          <h4 style="font-family:'Poppins';font-weight:600">Quick Actions</h4>
        </div>
        <div class="adm-grid adm-grid--2">
          <a href="#/hero" class="adm-btn adm-btn--ghost">Edit Hero</a>
          <a href="#/menu" class="adm-btn adm-btn--ghost">Manage Menu</a>
          <a href="#/gallery" class="adm-btn adm-btn--ghost">Add Photos</a>
          <a href="#/business" class="adm-btn adm-btn--ghost">Business Info</a>
          <a href="#/seo" class="adm-btn adm-btn--ghost">SEO Settings</a>
          <a href="#/social" class="adm-btn adm-btn--ghost">Social Links</a>
        </div>
      </div>
      <div class="adm-card">
        <h4 style="font-family:'Poppins';font-weight:600;margin-bottom:1rem">Configuration Tips</h4>
        <ul style="color: var(--ad-muted); font-size: 0.9rem; padding-left: 1rem; list-style: disc;">
          <li style="margin-bottom: 0.5rem">Upload images via the <b>Media Library</b>.</li>
          <li style="margin-bottom: 0.5rem">Changes instantly update the live website.</li>
          <li style="margin-bottom: 0.5rem">Regularly download a backup of your data.</li>
          <li>For SEO, ensure meta descriptions are descriptive.</li>
        </ul>
      </div>
    </div>
  `;
}
