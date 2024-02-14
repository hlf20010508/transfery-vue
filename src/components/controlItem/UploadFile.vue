<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { Folder } from "@element-plus/icons-vue";
import { NUpload } from "naive-ui";
import ControlItemBase from "./ControlItemBase.vue";
import { uploadFile } from "@/hooks/upload.js"
import { isAuthorized } from "@/stores/admin.js"
</script>

<template>
    <ControlItemBase v-if="isAuthorized">
        <n-upload :multiple="true" :custom-request="uploadFile">
            <Folder />
        </n-upload>
    </ControlItemBase>
</template>