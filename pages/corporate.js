/* Corporate orders page — WhatsApp link wiring */
import { initSite, waLink } from '../src/site.js'

initSite()

const messages = {
  corp: 'Hello Arusuvai! I would like a corporate catering quote. Please share details.',
  'corp-daily': 'Hello Arusuvai! I would like to enquire about daily office lunch subscriptions. Please share details.',
  'corp-team': 'Hello Arusuvai! I would like a team catering quote. Please share details.',
  'corp-bulk': 'Hello Arusuvai! I would like to place a bulk corporate order. Please share details.',
}

document.querySelectorAll('[data-wa]').forEach(el => {
  const key = el.dataset.wa
  el.href = waLink(messages[key] || 'Hello Arusuvai! I would like to know more about corporate orders.')
  el.target = '_blank'
  el.rel = 'noopener'
})
