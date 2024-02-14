<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { Close } from "@element-plus/icons-vue";
import ControlItemBase from "./ControlItemBase.vue";
import { messageBuffer, messageItemRemoving } from "@/stores/message.js";
import { isAuthorized } from "@/stores/admin.js";
import { obj_length } from "@/utils";

function toggleItemRemoving() {
    if (obj_length(messageBuffer.value) > 0) {
        messageItemRemoving.value = !messageItemRemoving.value;
    }
}
</script>

<template>
    <ControlItemBase v-if="isAuthorized">
        <Close @click="toggleItemRemoving" />
    </ControlItemBase>
</template>