<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div id="app">
      <RouterView />
    </div>
  </n-config-provider>
</template>

<script setup>
import { NConfigProvider } from 'naive-ui';
import { themeOverrides } from '@/theme';
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
