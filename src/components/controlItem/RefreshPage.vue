<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { Refresh } from "@element-plus/icons-vue";
import ControlItemBase from "./ControlItemBase.vue";
import { refreshPage } from "@/hooks/refresh.js";
</script>

<template>
    <ControlItemBase>
        <Refresh @click="refreshPage" />
    </ControlItemBase>
</template>