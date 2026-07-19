/* Meal subscription page — WhatsApp link wiring */
import { initSite, waLink } from '../src/site.js'

initSite()

const messages = {
  weekly: 'Hello Arusuvai! I would like to start the Weekly Meal Subscription (₹999/week). Please share details.',
  monthly: 'Hello Arusuvai! I would like to start the Monthly Meal Subscription (₹3,499/month). Please share details.',
  custom: 'Hello Arusuvai! I would like a custom meal subscription plan. Please share options.',
  sub: 'Hello Arusuvai! I would like to start a meal subscription. Please share details.',
  party: 'Hello Arusuvai! I would like to enquire about bulk/party catering. Please share details.',
}

document.querySelectorAll('[data-wa]').forEach(el => {
  const key = el.dataset.wa
  el.href = waLink(messages[key] || 'Hello Arusuvai! I would like to know more about meal subscriptions.')
  el.target = '_blank'
  el.rel = 'noopener'
})
