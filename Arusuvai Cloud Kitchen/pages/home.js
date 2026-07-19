/* Home page logic */
import { initSite, waLink, initLightbox, BUSINESS, ICONS } from '../src/site.js'

// FAQ accordion
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-item__q')
    const a = item.querySelector('.faq-item__a')
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open')
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open')
        i.querySelector('.faq-item__a').style.maxHeight = null
      })
      if (!isOpen) {
        item.classList.add('open')
        a.style.maxHeight = a.scrollHeight + 'px'
      }
    })
  })
}

// Featured gallery lightbox
function initFeaturedGallery() {
  const imgs = [...document.querySelectorAll('.featured-gallery__item img')]
  const items = imgs.map(img => ({ src: img.src, caption: img.alt }))
  const lb = initLightbox(items)
  document.querySelectorAll('.featured-gallery__item').forEach((el, i) => {
    el.addEventListener('click', () => lb.open(i))
  })
}

// Instagram feed lightbox
function initIgFeed() {
  const imgs = [...document.querySelectorAll('.ig-card img')]
  const items = imgs.map(img => ({ src: img.src, caption: img.alt }))
  const lb = initLightbox(items)
  document.querySelectorAll('.ig-card').forEach((el, i) => {
    el.addEventListener('click', () => lb.open(i))
  })
}

// Parallax on hero decorative elements
function initParallax() {
  const kolam = document.querySelector('.hero__kolam')
  if (!kolam) return
  window.addEventListener('scroll', () => {
    const y = window.scrollY
    if (y < window.innerHeight) kolam.style.transform = `translateY(${y * 0.15}px)`
  }, { passive: true })
}

initSite()
initFaq()
initFeaturedGallery()
initIgFeed()
initParallax()
