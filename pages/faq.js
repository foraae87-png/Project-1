/* FAQ page — accordion logic */
import { initSite, waLink } from '../src/site.js'

initSite()

document.querySelectorAll('[data-wa]').forEach(el => {
  el.href = waLink('Hello Arusuvai! I have a question.')
  el.target = '_blank'
  el.rel = 'noopener'
})

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
