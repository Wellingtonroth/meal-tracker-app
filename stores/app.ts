import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light' as Theme,
  }),
  actions: {
    setTheme(t: Theme) {
      this.theme = t
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem('theme', t)
    },
    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },
    initTheme() {
      const saved = (localStorage.getItem('theme') as Theme) || 'light'
      this.setTheme(saved)
    },
  },
})
