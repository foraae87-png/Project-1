/* ==========================================================================
   Arusuvai — Shared site logic (nav, footer, reveals, WhatsApp, lightbox)
   Imported by every page.
   ========================================================================== */

// Business config — single source of truth for contact info & links
export const BUSINESS = {
  name: 'Arusuvai',
  tagline: 'Cloud Kitchen',
  whatsapp: '917550161906',
  phone: '918270201301',
  email: 'hello@arusuvai.in',
  instagram: 'https://instagram.com/arusuvai',
  facebook: 'https://facebook.com/arusuvai',
  mapsQuery: 'Arusuvai Cloud Kitchen',
  hours: 'Mon–Sun · 7:00 AM – 10:00 PM',
  followers: '45.5K+',
};

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about.html', label: 'About' },
  { href: '/services.html', label: 'Menu' },
  { href: '/meal-subscription.html', label: 'Meal Plans' },
  { href: '/corporate-orders.html', label: 'Corporate' },
  { href: '/gallery.html', label: 'Gallery' },
  { href: '/reviews.html', label: 'Reviews' },
  { href: '/faq.html', label: 'FAQ' },
  { href: '/contact.html', label: 'Contact' },
];

const LOGO_PATH = '/public/logo.png';

// Build a WhatsApp deep link with a prefilled message
export function waLink(message = 'Hello Arusuvai! I would like to place an order.') {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

// SVG icon set (inline so no extra requests)
const ICONS = {
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.9-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A3.67 3.67 0 0 1 9.17 7.5V6h-2zm9 0A5.17 5.17 0 0 0 11 11.17V18h6.83v-6.83H14.5A3.67 3.67 0 0 1 18.17 7.5V6h-2z"/></svg>`,
};

// Current path helper
function currentPath() {
  const p = window.location.pathname;
  if (p === '/' || p.endsWith('/index.html')) return '/';
  return p.split('/').pop();
}

// Render navigation
function renderNav() {
  const path = currentPath();
  const isActive = (href) => (href === '/' && path === '/') || (href !== '/' && path === href.split('/').pop());
  const linksHTML = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="nav__link ${isActive(l.href) ? 'active' : ''}">${l.label}</a>`
  ).join('');
  const mobileLinksHTML = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="mobile-menu__link ${isActive(l.href) ? 'active' : ''}">${l.label}</a>`
  ).join('');

  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = `
    <div class="nav__inner">
      <a href="/" class="nav__brand">
        <img src="${LOGO_PATH}" alt="${BUSINESS.name} logo" class="nav__logo" />
        <span class="nav__brand-text">${BUSINESS.name}<small>${BUSINESS.tagline}</small></span>
      </a>
      <div class="nav__links">${linksHTML}</div>
      <a href="${waLink()}" target="_blank" rel="noopener" class="btn btn--primary nav__cta pulse">
        ${ICONS.whatsapp} Order on WhatsApp
      </a>
      <button class="nav__toggle" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  document.body.prepend(nav);

  // Mobile menu drawer
  const mobile = document.createElement('aside');
  mobile.className = 'mobile-menu';
  mobile.innerHTML = `
    <div class="mobile-menu__head">
      <a href="/" class="nav__brand">
        <img src="${LOGO_PATH}" alt="${BUSINESS.name} logo" class="nav__logo" />
        <span class="nav__brand-text">${BUSINESS.name}<small>${BUSINESS.tagline}</small></span>
      </a>
      <button class="mobile-menu__close" aria-label="Close menu">&times;</button>
    </div>
    ${mobileLinksHTML}
    <a href="${waLink()}" target="_blank" rel="noopener" class="btn btn--primary btn--block mt-3">${ICONS.whatsapp} Order on WhatsApp</a>
  `;
  document.body.appendChild(mobile);

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  const toggle = nav.querySelector('.nav__toggle');
  const closeBtn = mobile.querySelector('.mobile-menu__close');
  const openMenu = () => { mobile.classList.add('open'); overlay.classList.add('show'); toggle.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { mobile.classList.remove('open'); overlay.classList.remove('show'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
  toggle.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Scroll state
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    updateProgress();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Scroll progress bar
function updateProgress() {
  let bar = document.querySelector('.scroll-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
  }
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
  bar.style.width = `${pct}%`;
}

// Render footer
function renderFooter() {
  const year = new Date().getFullYear();
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div>
          <div class="footer__brand">
            <img src="${LOGO_PATH}" alt="${BUSINESS.name} logo" />
            <h4>${BUSINESS.name}</h4>
          </div>
          <p class="footer__about">Authentic South Indian homemade food — freshly cooked every day with love for families, professionals and celebrations.</p>
          <div class="footer__social mt-3">
            <a href="${BUSINESS.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>
            <a href="${BUSINESS.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
            <a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICONS.whatsapp}</a>
          </div>
        </div>
        <div>
          <h5>Explore</h5>
          <ul class="footer__links">
            ${NAV_LINKS.slice(0, 5).map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h5>Services</h5>
          <ul class="footer__links">
            <li><a href="/meal-subscription.html">Meal Subscription</a></li>
            <li><a href="/corporate-orders.html">Corporate Orders</a></li>
            <li><a href="/services.html">Daily Menu</a></li>
            <li><a href="/services.html">Party Catering</a></li>
            <li><a href="/gallery.html">Gallery</a></li>
          </ul>
        </div>
        <div>
          <h5>Reach Us</h5>
          <ul class="footer__contact">
            <li>${ICONS.phone}<a href="tel:+${BUSINESS.phone}">+${BUSINESS.phone}</a></li>
            <li>${ICONS.whatsapp}<a href="${waLink()}" target="_blank" rel="noopener">WhatsApp Chat</a></li>
            <li>${ICONS.mail}<a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></li>
            <li>${ICONS.clock}${BUSINESS.hours}</li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${year} ${BUSINESS.name} Cloud Kitchen. Crafted with care.</span>
        <span>Freshly cooked every day · ${BUSINESS.followers} Instagram family</span>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

// Floating WhatsApp + Call buttons
function renderFab() {
  const fab = document.createElement('div');
  fab.className = 'fab';
  fab.innerHTML = `
    <a href="tel:+${BUSINESS.phone}" class="fab__call" aria-label="Call us">${ICONS.phone}</a>
    <a href="${waLink()}" target="_blank" rel="noopener" class="fab__wa" aria-label="WhatsApp us">${ICONS.whatsapp}</a>
  `;
  document.body.appendChild(fab);
}

// Reveal-on-scroll using IntersectionObserver
function initReveals() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
}

// Counter animation
export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target % 1 !== 0 ? (target * eased).toFixed(1) : Math.floor(target * eased);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => io.observe(c));
}

// Toast helper
export function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
}

// Lightbox: pass array of {src, caption}
export function initLightbox(items) {
  let idx = 0;
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox__close" aria-label="Close">&times;</button>
    <button class="lightbox__nav lightbox__prev" aria-label="Previous">&#8249;</button>
    <img class="lightbox__img" alt="" />
    <button class="lightbox__nav lightbox__next" aria-label="Next">&#8250;</button>
    <div class="lightbox__caption"></div>
  `;
  document.body.appendChild(lb);
  const img = lb.querySelector('.lightbox__img');
  const cap = lb.querySelector('.lightbox__caption');
  const show = (i) => {
    idx = (i + items.length) % items.length;
    img.src = items[idx].src;
    img.alt = items[idx].caption || '';
    cap.textContent = items[idx].caption || '';
  };
  const open = (i) => { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  lb.querySelector('.lightbox__close').addEventListener('click', close);
  lb.querySelector('.lightbox__prev').addEventListener('click', () => show(idx - 1));
  lb.querySelector('.lightbox__next').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  return { open, close };
}

// Magnetic buttons effect
function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// Boot — call on every page
export function initSite() {
  renderNav();
  renderFooter();
  renderFab();
  initReveals();
  initMagnetic();
  initCounters();
}

export { ICONS, LOGO_PATH };
