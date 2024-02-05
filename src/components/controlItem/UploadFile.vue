<script setup>
import { Folder } from "@element-plus/icons-vue";
import { NUpload } from "naive-ui";
import ControlItemBase from "./ControlItemBase.vue";
import { uploadFile } from "@/hooks/upload.js"
</script>

<template>
    <ControlItemBase>
        <n-upload :multiple="true" :custom-request="uploadFile">
            <Folder />
        </n-upload>
    </ControlItemBase>
</template>