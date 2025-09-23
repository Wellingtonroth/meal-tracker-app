import {
  ChartBarIcon as ChartOutline,
  Cog6ToothIcon as CogOutline,
  DocumentTextIcon as DocOutline,
  HomeIcon as HomeOutline,
} from '@heroicons/vue/24/outline'
import {
  ChartBarIcon as ChartSolid,
  Cog6ToothIcon as CogSolid,
  DocumentTextIcon as DocSolid,
  HomeIcon as HomeSolid,
} from '@heroicons/vue/24/solid'

export const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: HomeOutline,
    iconSolid: HomeSolid,
  },
  {
    to: '/plans',
    label: 'Plans',
    icon: DocOutline,
    iconSolid: DocSolid,
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: ChartOutline,
    iconSolid: ChartSolid,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: CogOutline,
    iconSolid: CogSolid,
  },
]
