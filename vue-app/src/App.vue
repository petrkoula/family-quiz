<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div id="app">
      <RouterView />
    </div>
  </n-config-provider>
</template>

<script setup>
import { onMounted } from 'vue';
import { NConfigProvider } from 'naive-ui';
import { useGameStore } from '@/stores/gameStore';
import { themeOverrides } from '@/theme';

const gameStore = useGameStore();

onMounted(() => {
  // Initialize quiz data on app load (local-first)
  gameStore.initializeQuizData();
});
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
