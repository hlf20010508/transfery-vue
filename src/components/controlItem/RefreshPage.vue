<script setup>
import { Refresh } from "@element-plus/icons-vue";
import ControlItemBase from "./ControlItemBase.vue";
import { showRefreshSpin } from "@/stores/refresh.js";

function refreshPage() {
    showRefreshSpin.value = true;
    //延迟0.5秒刷新，让loading图标能够显示全，不然只有一个点在转
    setInterval(() => location.reload(), 500);
}
</script>

<template>
    <ControlItemBase>
        <Refresh @click="refreshPage" />
    </ControlItemBase>
</template>