import { useAppStore } from '@/stores/app'

export default defineNuxtPlugin(() => {
  const app = useAppStore()
  app.initTheme()
})
