<script setup>
import { NFlex } from "naive-ui";
import { NDivider } from "naive-ui";
import DeleteItem from "./controlItem/DeleteItem.vue";
import RefreshPage from "./controlItem/RefreshPage.vue";
</script>

<template>
    <div>
        <n-divider style="--n-color: #dcdfe6" />
        <n-flex>
            <DeleteItem />
            <RefreshPage />
        </n-flex>
    </div>
</template>

<style scoped>
.n-divider {
    margin: 0 0 10px 0;
}
</style>