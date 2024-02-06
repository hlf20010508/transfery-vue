<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NFlex } from "naive-ui";
import { NDivider } from "naive-ui";
import UploadFile from "./controlItem/UploadFile.vue";
import DeleteItem from "./controlItem/DeleteItem.vue";
import RefreshPage from "./controlItem/RefreshPage.vue";
import RemoveAll from "./controlItem/RemoveAll.vue";
</script>

<template>
    <div class="control-bar">
        <RemoveAll />
        <n-divider style="--n-color: #dcdfe6" />
        <n-flex>
            <UploadFile />
            <DeleteItem />
            <RefreshPage />
        </n-flex>
    </div>
</template>

<style scoped>
.control-bar {
    /* 使元素高度包含内部元素的margin，防止高度计算出现问题 */
    overflow: hidden;
}

.n-divider {
    margin: 0 0 10px 0;
}
</style>