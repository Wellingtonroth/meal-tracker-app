<template>
  <div class="app-shell">
    <DesktopSidebar />

    <main class="content">
      <slot />
    </main>

    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import BottomNavigation from '@/components/navigation/BottomNavigation.vue'
import DesktopSidebar from '@/components/navigation/DesktopSidebar.vue'
</script>

<style scoped lang="scss">
.app-shell {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100dvh;

  @media (min-width: 1024px) {
    grid-template-columns: 250px 1fr;
  }
}

.content {
  min-height: 100%;
  padding: 16px;
  
  @media (min-width: 1024px) { 
    padding: 24px;
  }
}
</style>
