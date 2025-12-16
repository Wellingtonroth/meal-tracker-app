<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: 'app',
});

const { t } = useI18n();
</script>

<template>
  <div>
    <h1>{{ t('auth.login.title') }}</h1>
  </div>
</template>
