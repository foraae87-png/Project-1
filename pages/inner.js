/* Shared inner-page logic: boot site + wire WhatsApp links */
import { initSite, waLink } from '../src/site.js'

initSite()

document.querySelectorAll('[data-wa]').forEach(el => {
  el.href = waLink('Hello Arusuvai! I would like to know more.')
  el.target = '_blank'
  el.rel = 'noopener'
})
