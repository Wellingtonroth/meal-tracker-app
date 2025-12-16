import type { Theme } from '@/types/theme';
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';

export function useTheme() {
  const app = useAppStore();

  const themeCookie = useCookie<Theme>('theme', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });

  const theme = computed(() => app.theme);

  const applyTheme = (t: Theme) => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', t);
    }
  };

  const initTheme = () => {
    const saved = themeCookie.value ?? 'light';
    app.setTheme(saved);
    applyTheme(saved);

    if (import.meta.client) {
      return localStorage.setItem('theme', saved);
    }
  };

  const toggleTheme = () => {
    const next: Theme = app.theme === 'dark' ? 'light' : 'dark';
    app.setTheme(next);
    themeCookie.value = next;

    applyTheme(next);

    if (import.meta.client) {
      return localStorage.setItem('theme', next);
    }
  };

  return { theme, initTheme, toggleTheme };
}
