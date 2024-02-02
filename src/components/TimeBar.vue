<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { ref } from "vue";
import { NTime } from "naive-ui";
import { timeFormat } from "@/stores/globalVar.js";

let currentTimeStamp = ref(new Date().getTime());

function updateTimeStamp() {
    currentTimeStamp.value = new Date().getTime();
}

setInterval(updateTimeStamp, 1000);
</script>

<template>
    <n-time :time="currentTimeStamp" :format="timeFormat" />
</template>

<style scoped>
time {
    margin: 10px 0 10px 0;
    font-size: 16px;
    display: block;
}
</style>