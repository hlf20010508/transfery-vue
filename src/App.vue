<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NConfigProvider } from "naive-ui";

/** @type import('naive-ui').GlobalThemeOverrides */
const customTheme = {
  common: {
    primaryColor: '#409eff',
    primaryColorHover: '#409eff',
  },
}
</script>

<template>
  <n-config-provider :theme-overrides="customTheme">
    <router-view />
  </n-config-provider>
</template>

<style>
:root {
  --primary-color: #409eff;
  --primary-color-hover: #409eff;
  --error-color: #f56c6c;
  --error-color-hover: #f56c6c;
  --background-color: #f3f3f3;
  --min-font-size: 12px;
  --tip-color: #a2a2a2;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  max-width: 600px;
  margin: 0 auto 0 auto;
  background: var(--background-color);
}

html,
body {
  margin: 0;
  height: 100%;
}
</style>