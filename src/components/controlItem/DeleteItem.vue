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