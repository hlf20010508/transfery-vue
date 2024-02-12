<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import PrivateSwitch from "./titleItem/PrivateSwitch.vue";
import ConnectionStatus from "./titleItem/ConnectionStatus.vue";
</script>

<template>
    <div id="title-bar">
        <div class="title-wrap">
            <span>Transfery</span>
            <PrivateSwitch />
        </div>
        <ConnectionStatus />
    </div>
</template>

<style scoped>
#title-bar {
    padding-top: 10px;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
}

.title-wrap {
    position: relative;
}
</style>