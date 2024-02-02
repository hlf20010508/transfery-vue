<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<template>
    <router-view/>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  max-width: 600px;
  margin: 0 auto 0 auto;
  background: #f3f3f3;
  /* 防止顶部无法占满 */
  overflow: hidden;
}

html,
body {
  margin: 0;
  height: 100%;
}
</style>