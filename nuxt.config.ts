// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  imports: {
    dirs: ['stores'],
  },
  devtools: { enabled: true },
  css: ['@/assets/styles/main.scss'],
  app: {
    head: {
      title: 'Meal Tracker',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0f172a' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Meal Tracker' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192.png' },
      ],
    },
  },
})
