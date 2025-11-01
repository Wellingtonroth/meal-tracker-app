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

const { t } = useI18n();

const router = useRouter();
const localePath = useLocalePath();

const go = (route?: string) => {
  if (!route) return;
  router.push(localePath(route));
};

const settingsSections = ref([
  {
    title: 'Geral',
    items: [
      { label: 'Idioma', key: 'language', icon: LanguageIcon, route: '/settings/language' },
      { label: 'Nome', key: 'name', icon: UserIcon, route: '/settings/name' },
      { label: 'Email', key: 'email', icon: EnvelopeIcon, route: '/settings/email' },
      { label: 'Senha', key: 'password', icon: LockClosedIcon, route: '/settings/password' },
    ],
  },
  {
    title: 'Comunicação',
    items: [
      {
        label: 'Lembrete de refeição',
        key: 'mealReminder',
        icon: BellAlertIcon,
        route: '/settings/notifications',
      },
      {
        label: 'Relatório semanal',
        key: 'weeklyReport',
        icon: ChartBarSquareIcon,
        route: '/settings/weekly-report',
      },
    ],
  },
  {
    title: 'Exibição',
    items: [{ label: 'Tema', key: 'theme', icon: PaintBrushIcon, route: '/settings/theme' }],
  },
  {
    title: 'Conta',
    items: [
      {
        label: 'Sair',
        key: 'logout',
        icon: ArrowRightStartOnRectangleIcon,
        route: '/settings/logout',
      },
      {
        label: 'Deletar conta',
        key: 'deleteAccount',
        icon: TrashIcon,
        route: '/settings/delete-account',
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
