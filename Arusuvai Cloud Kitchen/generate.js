import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function updateStaticSite() {
  const dataDir = path.join(__dirname, 'data');
  const readJson = (file) => {
    try { return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8')); } 
    catch (e) { return null; }
  };

  const hero = readJson('hero.json');
  const faq = readJson('faq.json');
  const gallery = readJson('gallery.json');
  const menu = readJson('menu.json');
  const reviews = readJson('reviews.json');
  const corporate = readJson('corporate.json');
  const subscriptions = readJson('subscriptions.json');
  const business = readJson('business.json');
  const seo = readJson('seo.json');
  const social = readJson('social.json');
  const announcements = readJson('announcements.json');
  const about = readJson('about.json');

  // Update index.html
  let indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    let $ = cheerio.load(fs.readFileSync(indexPath, 'utf8'));
    
    // SEO
    if (seo) {
      $('title').text(seo.site_title);
      $('meta[name="description"]').attr('content', seo.meta_description);
      $('meta[property="og:title"]').attr('content', seo.og_title);
      $('meta[property="og:description"]').attr('content', seo.og_description);
    }

    // Announcements
    $('#announcement-bar').remove();
    if (announcements && announcements.items && announcements.items.length > 0) {
      const active = announcements.items.find(a => a.enabled);
      if (active) {
        $('body').prepend(`
          <div id="announcement-bar" style="background: var(--primary); color: white; text-align: center; padding: 0.5rem; font-size: 0.875rem; font-weight: 500;">
            <strong style="margin-right: 0.5rem;">${active.title}</strong> ${active.description}
          </div>
        `);
      }
    }
    
    // Hero
    if (hero) {
      $('.hero__eyebrow').text(hero.eyebrow);
      const parts = hero.headline.split('\n');
      $('.hero__title').html(parts.map(p => `<span class="line"><span>${p}</span></span>`).join('\n          '));
      $('.hero__sub').text(hero.subheadline);
      $('.hero__visual img').attr('src', hero.image);
      $('.hero__ctas a.btn--primary').html(`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.9-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z"/></svg>\n            ${hero.cta_primary}`);
      $('.hero__ctas a.btn--ghost').text(hero.cta_secondary);
    }
    
    // Stats (from social & business if needed, or leave hardcoded)
    if (business) {
      $('[data-counter="45.5"]').attr('data-counter', business.followers.replace(/[^0-9.]/g, '')).text('0');
      $('[data-counter="45.5"]').attr('data-suffix', business.followers.replace(/[0-9.]/g, ''));
    }

    // Story / About
    if (about) {
      $('.story__img img').attr('src', about.image);
      const storyPars = $('.story__content p:not(.story__sign)');
      if (storyPars.length >= 2) {
        $(storyPars[0]).text(about.business_story);
        $(storyPars[1]).text(about.founder_story);
      }
    }

    fs.writeFileSync(indexPath, $.html());
  }

  // Update about.html
  let aboutPath = path.join(__dirname, 'about.html');
  if (fs.existsSync(aboutPath) && about) {
    let $ = cheerio.load(fs.readFileSync(aboutPath, 'utf8'));
    $('.story__img img').attr('src', about.image);
    const storyPars = $('.story__content p:not(.story__sign)');
    if (storyPars.length >= 2) {
      $(storyPars[0]).text(about.business_story);
      $(storyPars[1]).text(about.founder_story);
    }
    fs.writeFileSync(aboutPath, $.html());
  }

  // Update contact.html
  let contactPath = path.join(__dirname, 'contact.html');
  if (fs.existsSync(contactPath) && business) {
    let $ = cheerio.load(fs.readFileSync(contactPath, 'utf8'));
    // Update contact cards based on business data
    $('.contact-card:has(svg[stroke="currentColor"]:has(path[d*="M22 16.92"])) p').text(business.phone);
    $('.contact-card:has(svg[stroke="currentColor"]:has(path[d*="M4 4h16c1.1"])) p').text(business.email);
    $('.contact-card:has(svg[stroke="currentColor"]:has(path[d*="M21 10c0 7-9 13-9 13s-9-6-9-13"])) p').html(business.address.replace(', ', '<br>'));
    $('.contact-card:has(svg[stroke="currentColor"]:has(circle[cx="12"])) p').html(business.hours.replace(', ', '<br>'));
    fs.writeFileSync(contactPath, $.html());
  }

  // Update faq.html
  let faqPath = path.join(__dirname, 'faq.html');
  if (fs.existsSync(faqPath) && faq && faq.items) {
    let $ = cheerio.load(fs.readFileSync(faqPath, 'utf8'));
    const list = $('.faq-list');
    list.empty();
    faq.items.forEach(item => {
      list.append(`
        <div class="faq-item reveal">
          <button class="faq-item__q">${item.question}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
          <div class="faq-item__a"><div class="faq-item__a-inner">${item.answer}</div></div>
        </div>
      `);
    });
    fs.writeFileSync(faqPath, $.html());
  }

  // Update gallery.html
  let galleryPath = path.join(__dirname, 'gallery.html');
  if (fs.existsSync(galleryPath) && gallery && gallery.items) {
    let $ = cheerio.load(fs.readFileSync(galleryPath, 'utf8'));
    const grid = $('.gallery-grid');
    grid.empty();
    gallery.items.forEach(item => {
      grid.append(`
        <div class="gallery-item reveal" data-cat="${item.category}">
          <img src="${item.src}" alt="${item.caption}" loading="lazy" />
          <div class="gallery-item__overlay">
            <span class="gallery-item__caption">${item.caption}</span>
          </div>
        </div>
      `);
    });
    fs.writeFileSync(galleryPath, $.html());
  }

  // Update reviews.html
  let reviewsPath = path.join(__dirname, 'reviews.html');
  if (fs.existsSync(reviewsPath) && reviews && reviews.items) {
    let $ = cheerio.load(fs.readFileSync(reviewsPath, 'utf8'));
    const grid = $('.reviews-grid');
    grid.empty();
    reviews.items.forEach((item, i) => {
      let stars = '';
      for (let s = 0; s < (item.rating || 5); s++) {
        stars += '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15 8.5 22 9.5 17 14.3 18 21.3 12 17.8 6 21.3 7 14.3 2 9.5 9 8.5"/></svg>';
      }
      let sourceIcon = item.source === 'Google' || item.source === 'Google Review' 
        ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>' 
        : (item.source === 'Instagram' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg>' 
        : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.9-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z"/></svg>');
      
      grid.append(`
        <article class="review-card reveal" ${i % 2 !== 0 ? 'data-delay="1"' : ''}>
          <div class="review-card__head">
            ${item.avatar ? `<img class="review-card__avatar" src="${item.avatar}" alt="${item.name}" loading="lazy" />` : '<div class="review-card__avatar" style="background:#e2e8f0;"></div>'}
            <div><div class="review-card__name">${item.name}</div><div class="review-card__meta">${item.role}</div></div>
            <div class="review-card__stars">${stars}</div>
          </div>
          <p class="review-card__text">${item.text}</p>
          <span class="review-card__source">${sourceIcon} ${item.source}</span>
        </article>
      `);
    });
    fs.writeFileSync(reviewsPath, $.html());
  }

  // Update menu / services.html
  let menuPath = path.join(__dirname, 'services.html');
  if (fs.existsSync(menuPath) && menu && menu.items) {
    let $ = cheerio.load(fs.readFileSync(menuPath, 'utf8'));
    const grid = $('.menu-grid');
    grid.empty();
    menu.items.forEach(item => {
      grid.append(`
        <div class="menu-card reveal" data-cat="${item.category}">
          <div class="menu-card__img">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
            ${item.tag ? `<span class="menu-card__tag">${item.tag}</span>` : ''}
          </div>
          <div class="menu-card__content">
            <div class="menu-card__header">
              <h3>${item.name}</h3>
              <span class="menu-card__price">${item.price}</span>
            </div>
            <p class="menu-card__desc">${item.description}</p>
            <a href="#" data-wa data-wa-item="${item.name}" class="btn btn--outline btn--sm mt-3" data-magnetic>Order Now</a>
          </div>
        </div>
      `);
    });
    fs.writeFileSync(menuPath, $.html());
  }
  
  // Update meal-subscription.html
  let subPath = path.join(__dirname, 'meal-subscription.html');
  if (fs.existsSync(subPath) && subscriptions && subscriptions.plans) {
    let $ = cheerio.load(fs.readFileSync(subPath, 'utf8'));
    const grid = $('.pricing-grid');
    grid.empty();
    subscriptions.plans.forEach(plan => {
      grid.append(`
        <div class="pricing-card ${plan.featured ? 'pricing-card--featured' : ''} reveal">
          ${plan.featured ? '<div class="pricing-card__badge">Most Popular</div>' : ''}
          <h3>${plan.name}</h3>
          <p class="pricing-card__desc">${plan.desc}</p>
          <div class="pricing-card__price">
            <span class="currency">₹</span><span class="amount">${plan.price}</span>${plan.period ? `<span class="period">/${plan.period}</span>` : ''}
          </div>
          <ul class="pricing-card__features">
            ${plan.features.split('\n').map(f => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${f}</li>`).join('')}
          </ul>
          <a href="#" data-wa class="btn ${plan.featured ? 'btn--primary' : 'btn--outline'} btn--lg" style="width:100%" data-magnetic>Choose Plan</a>
        </div>
      `);
    });
    fs.writeFileSync(subPath, $.html());
  }

  // Update corporate-orders.html
  let corpPath = path.join(__dirname, 'corporate-orders.html');
  if (fs.existsSync(corpPath) && corporate && corporate.packages) {
    let $ = cheerio.load(fs.readFileSync(corpPath, 'utf8'));
    const grid = $('.pricing-grid');
    grid.empty();
    corporate.packages.forEach(pkg => {
      grid.append(`
        <div class="pricing-card ${pkg.featured ? 'pricing-card--featured' : ''} reveal">
          ${pkg.featured ? '<div class="pricing-card__badge">Most Popular</div>' : ''}
          <h3>${pkg.name}</h3>
          <p class="pricing-card__desc">${pkg.desc}</p>
          <div class="pricing-card__price">
            ${pkg.price !== 'Custom' ? '<span class="currency">₹</span>' : ''}<span class="amount">${pkg.price}</span><span class="period">${pkg.unit || ''}</span>
          </div>
          <ul class="pricing-card__features">
            ${pkg.features.split('\n').map(f => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${f}</li>`).join('')}
          </ul>
          <a href="#" data-wa class="btn ${pkg.featured ? 'btn--primary' : 'btn--outline'} btn--lg" style="width:100%" data-magnetic>Request Quote</a>
        </div>
      `);
    });
    fs.writeFileSync(corpPath, $.html());
  }
  
  // Update site.js
  let siteJsPath = path.join(__dirname, 'src', 'site.js');
  if (fs.existsSync(siteJsPath) && business && social) {
    let siteJs = fs.readFileSync(siteJsPath, 'utf8');
    const b = business;
    const s = social;
    const newBusiness = `export const BUSINESS = {
  name: '${b.name}',
  tagline: '${b.tagline}',
  whatsapp: '${b.whatsapp || s.whatsapp}',
  phone: '${b.phone}',
  email: '${b.email}',
  instagram: '${s.instagram || b.instagram}',
  facebook: '${s.facebook || b.facebook}',
  mapsQuery: '${b.address}',
  hours: '${b.hours}',
  followers: '${s.instagram_followers || b.followers}',
};`;
    siteJs = siteJs.replace(/export const BUSINESS = \{[\s\S]*?\};/, newBusiness);
    fs.writeFileSync(siteJsPath, siteJs);
  }
  
  return true;
}
