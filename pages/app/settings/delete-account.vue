<script setup lang="ts">
definePageMeta({
  layout: 'authenticated',
});

const { t } = useI18n();
</script>

<template>
  <div>
    <h1>{{ t('auth.login.title') }}</h1>
  </div>
</template>
