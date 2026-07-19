/* Gallery page — category filters + lightbox */
import { initSite, waLink, initLightbox } from '../src/site.js'

initSite()

document.querySelectorAll('[data-wa]').forEach(el => {
  el.href = waLink('Hello Arusuvai! I saw your gallery and would like to order.')
  el.target = '_blank'
  el.rel = 'noopener'
})

// Build lightbox from all visible gallery items
const galleryItems = [...document.querySelectorAll('.gallery-item')]
const imgs = galleryItems.map(el => ({
  src: el.querySelector('img').src.replace('w=600', 'w=1200'),
  caption: el.querySelector('img').alt,
}))
const lb = initLightbox(imgs)
galleryItems.forEach((el, i) => el.addEventListener('click', () => lb.open(i)))

// Category filter
const filters = document.querySelectorAll('.gallery-filter')
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter
    filters.forEach(f => f.classList.remove('active'))
    btn.classList.add('active')
    galleryItems.forEach(item => {
      const show = cat === 'all' || item.dataset.cat === cat
      item.style.display = show ? '' : 'none'
    })
  })
})
