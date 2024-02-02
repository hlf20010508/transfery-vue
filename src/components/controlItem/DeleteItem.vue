<script setup>
import useMessageStore from "@/stores/message.js";

let { messageItemRemoving } = useMessageStore();

function toggleItemRemoving() {
    messageItemRemoving.value = !messageItemRemoving.value;
}
</script>

<template>
    <button @click="toggleItemRemoving">RM</button>
</template>