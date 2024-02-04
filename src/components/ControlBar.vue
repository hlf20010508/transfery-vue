<script setup>
import { NFlex } from "naive-ui";
import { NDivider } from "naive-ui";
import DeleteItem from "./controlItem/DeleteItem.vue";
import RefreshPage from "./controlItem/RefreshPage.vue";
import DeleteAll from "./controlItem/DeleteAll.vue";
</script>

<template>
    <div class="control-bar">
        <DeleteAll />
        <n-divider style="--n-color: #dcdfe6" />
        <n-flex>
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