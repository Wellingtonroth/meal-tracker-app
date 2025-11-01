/// <reference types="@vite-pwa/nuxt" />
/// <reference types="@nuxtjs/i18n" />

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@vite-pwa/nuxt', '@nuxtjs/i18n'],
  compatibilityDate: '2025-09-23',
  imports: {
    dirs: ['stores'],
  },
  devtools: { enabled: true },
  css: ['@/assets/styles/main.scss'],
  i18n: {
    defaultLocale: 'pt-BR',
    locales: [
      { code: 'pt-BR', language: 'pt-BR', file: 'pt-BR.json', name: 'Português (Brasil)' },
      { code: 'en-US', language: 'en-US', file: 'en-US.json', name: 'English (US)' },
    ],
    strategy: 'prefix_except_default',
    langDir: 'locales',
    baseUrl: 'http://localhost:3000',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
    },
    compilation: { strictMessage: true },
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: { navigateFallback: '/' },
    manifest: {
      name: 'Meal Tracker',
      short_name: 'Meals',
      start_url: '/?source=pwa',
      scope: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#0f172a',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        {
          src: '/icons/maskable-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: '/icons/maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
  },
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
      link: [{ rel: 'apple-touch-icon', href: '/icons/icon-192.png' }],
    },
  },
});
