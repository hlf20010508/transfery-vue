<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { ref } from "vue";
import { NTime } from "naive-ui";
import { getCurrentTimeStamp } from "@/utils"


let currentTimeStamp = ref(getCurrentTimeStamp());

function updateTimeStamp() {
    currentTimeStamp.value = getCurrentTimeStamp();
}

setInterval(updateTimeStamp, 1000);
</script>

<template>
    <n-time :time="currentTimeStamp" format="yyyy-MM-dd HH:mm:ss" />
</template>

<style scoped>
time {
    margin: 10px 0 10px 0;
    font-size: 16px;
    display: block;
    text-align: center;
}
</style>