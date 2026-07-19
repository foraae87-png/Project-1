/* Contact page — form submission via WhatsApp + hours highlight */
import { initSite, waLink, BUSINESS, toast } from '../src/site.js'

initSite()

document.querySelectorAll('[data-wa]').forEach(el => {
  el.href = waLink('Hello Arusuvai! I would like to get in touch.')
  el.target = '_blank'
  el.rel = 'noopener'
})

// Contact form — compose a WhatsApp message and open it
const form = document.getElementById('contactForm')
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = form.name.value.trim()
    const phone = form.phone.value.trim()
    const service = form.service.value
    const message = form.message.value.trim()
    const text = `Hello Arusuvai!%0A%0AName: ${name}%0APhone: ${phone}%0AService: ${service}%0A%0A${message}`
    window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text).replace(/%250A/gi, '%0A')}`, '_blank')
    toast('Opening WhatsApp…')
    form.reset()
  })
}

// Highlight today's business hours
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const today = days[new Date().getDay()]
document.querySelectorAll('.hours-row').forEach(row => {
  if (row.dataset.day === today) row.classList.add('today')
})
