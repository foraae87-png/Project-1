/* Services/Menu page — category filtering */
import { initSite, waLink } from '../src/site.js'

initSite()

// Wire WhatsApp links
document.querySelectorAll('[data-wa]').forEach(el => {
  const item = el.dataset.waItem
  const msg = item
    ? `Hello Arusuvai! I would like to order: ${item}. Please confirm availability and price.`
    : 'Hello Arusuvai! I would like to place an order.'
  el.href = waLink(msg)
  el.target = '_blank'
  el.rel = 'noopener'
})

// Menu category tabs
const tabs = document.querySelectorAll('.menu-tab')
const cards = document.querySelectorAll('.menu-card')
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const cat = tab.dataset.cat
    tabs.forEach(t => t.classList.remove('active'))
    tab.classList.add('active')
    cards.forEach(card => {
      const show = cat === 'all' || card.dataset.cat === cat
      card.style.display = show ? '' : 'none'
    })
  })
})
