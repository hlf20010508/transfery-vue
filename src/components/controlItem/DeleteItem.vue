<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { Close } from "@element-plus/icons-vue";
import ControlItemBase from "./ControlItemBase.vue";
import { messageItemRemoving } from "@/stores/message.js";

function toggleItemRemoving() {
    messageItemRemoving.value = !messageItemRemoving.value;
}
</script>

<template>
    <ControlItemBase>
        <Close @click="toggleItemRemoving" />
    </ControlItemBase>
</template>