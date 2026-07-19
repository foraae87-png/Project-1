import { defineConfig } from 'vite'
import { resolve } from 'path'

// Multi-page Vite config — each public page is a separate HTML entry.
// The PHP admin lives under /admin and is not processed by Vite.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        meal: resolve(__dirname, 'meal-subscription.html'),
        corporate: resolve(__dirname, 'corporate-orders.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        faq: resolve(__dirname, 'faq.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})
