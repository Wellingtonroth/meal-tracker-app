import {
  ChartBarIcon as ChartOutline,
  Cog6ToothIcon as CogOutline,
  DocumentTextIcon as DocOutline,
  HomeIcon as HomeOutline,
} from '@heroicons/vue/24/outline';
import {
  ChartBarIcon as ChartSolid,
  Cog6ToothIcon as CogSolid,
  DocumentTextIcon as DocSolid,
  HomeIcon as HomeSolid,
} from '@heroicons/vue/24/solid';
import { useI18n } from 'vue-i18n';

export const getNavItems = () => {
  const { t } = useI18n();

  return [
    {
      to: '/app/home',
      label: t('navigation.dashboard'),
      icon: HomeOutline,
      iconSolid: HomeSolid,
    },
    {
      to: '/app/plans',
      label: t('navigation.plans'),
      icon: DocOutline,
      iconSolid: DocSolid,
    },
    {
      to: '/app/reports',
      label: t('navigation.reports'),
      icon: ChartOutline,
      iconSolid: ChartSolid,
    },
    {
      to: '/app/settings',
      label: t('navigation.settings'),
      icon: CogOutline,
      iconSolid: CogSolid,
    },
  ];
};
