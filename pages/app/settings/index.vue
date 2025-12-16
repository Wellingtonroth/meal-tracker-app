<template>
  <div>
    <header class="header">
      <h1>{{ t('settings.title') }}</h1>
    </header>

    <section v-for="section in settingsSections" :key="section.title" class="main">
      <b>{{ section.title }}</b>

      <div v-for="item in section.items" :key="item.key" class="container" @click="go(item.route)">
        <div class="item-left">
          <component :is="item.icon" class="icon--sm" />
          <span>{{ item.label }}</span>
        </div>
        <ChevronRightIcon class="icon--sm" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRightStartOnRectangleIcon,
  BellAlertIcon,
  ChartBarSquareIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  LanguageIcon,
  LockClosedIcon,
  PaintBrushIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/vue/24/outline';
import { ref } from 'vue';

definePageMeta({
  layout: 'app',
  middleware: 'app',
});

const { t } = useI18n();

const router = useRouter();
const localePath = useLocalePath();

const go = (route?: string) => {
  if (!route) return;
  router.push(localePath(route));
};

const settingsSections = ref([
  {
    title: t('settings.general.title'),
    items: [
      {
        label: t('settings.language.title'),
        key: 'language',
        icon: LanguageIcon,
        route: '/app/settings/language',
      },
      { label: t('settings.name.title'), key: 'name', icon: UserIcon, route: '/app/settings/name' },
      {
        label: t('settings.email.title'),
        key: 'email',
        icon: EnvelopeIcon,
        route: '/app/settings/email',
      },
      {
        label: t('settings.password.title'),
        key: 'password',
        icon: LockClosedIcon,
        route: '/app/settings/password',
      },
    ],
  },
  {
    title: t('settings.communication.title'),
    items: [
      {
        label: t('settings.notifications.title'),
        key: 'mealReminder',
        icon: BellAlertIcon,
        route: '/app/settings/notifications',
      },
      {
        label: t('settings.weekly-report.title'),
        key: 'weeklyReport',
        icon: ChartBarSquareIcon,
        route: '/app/settings/weekly-report',
      },
    ],
  },
  {
    title: t('settings.display.title'),
    items: [
      {
        label: t('settings.theme.title'),
        key: 'theme',
        icon: PaintBrushIcon,
        route: '/app/settings/theme',
      },
    ],
  },
  {
    title: t('settings.account.title'),
    items: [
      {
        label: t('settings.logout.title'),
        key: 'logout',
        icon: ArrowRightStartOnRectangleIcon,
        route: '/app/settings/logout',
      },
      {
        label: t('settings.delete-account.title'),
        key: 'deleteAccount',
        icon: TrashIcon,
        route: '/app/settings/delete-account',
      },
    ],
  },
]);
</script>

<style scoped lang="scss">
.header {
  color: var(--color-text);
  text-align: center;
}

.main {
  margin-top: 20px;
  color: var(--color-text);

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--color-divider);
    padding: 12px;
    margin-top: 10px;
    border-radius: 8px;
    font-weight: 500;
    background: var(--color-surface);

    &:hover {
      cursor: pointer;
      background: var(--color-ghost);
      color: var(--color-primary);
    }

    .item-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .icon--sm {
    width: 20px;
    height: 20px;
  }
}
</style>
