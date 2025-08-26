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
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
