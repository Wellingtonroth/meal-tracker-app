import { useRoute } from 'vue-router'

export function useActiveLink() {
  const route = useRoute()

  function isActive(path: string) {
    return route.path === path || route.path.startsWith(`${path}/`)
  }

  return { isActive }
}
