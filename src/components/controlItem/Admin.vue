<script setup>
import { User } from "@element-plus/icons-vue";
import { NDropdown } from "naive-ui";
import { useRouter } from "vue-router";
import ControlItemBase from "./ControlItemBase.vue";
import { isAuthorized } from "@/stores/admin.js"

const router = useRouter();

const options = [{
    label: "退出",
    key: "quit"
}];
</script>

<template>
    <ControlItemBase>
        <n-dropdown v-if="isAuthorized" trigger="click" :options="options">
            <User />
        </n-dropdown>
        <User v-else @click="router.push({name: 'login'})"/>
    </ControlItemBase>
</template>