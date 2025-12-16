import type { Theme } from '@/types/theme';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light' as Theme,
  }),
  actions: {
    setTheme(t: Theme) {
      this.theme = t;
    },
  },
});
