<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { ref } from "vue";
import { NCard, NTime, NIcon, NFlex } from "naive-ui";
import { CopyDocument, Check } from "@element-plus/icons-vue";
import MessageItemBase from "./MessageItemBase.vue";

defineProps(["item", "index"]);

let textCopied = ref(false);
let timer = -1; // 未定义计时器时的默认ID

function messageCopyText(content) {
    navigator.clipboard.writeText(content.trim());
    textCopied.value = true;
    // 防止大量重复点击产生多个计时器
    clearTimeout(timer);
    timer = setTimeout(() => {
        textCopied.value = false;
    }, 1000);
}
</script>

<template>
    <MessageItemBase :item="item" :index="index">
        <n-card embedded :bordered="false" content-style="padding: 0 16px;"
            footer-style="text-align: right; padding: 0 16px 8px 0;" :hoverable="true">
            <p v-for="(paragraph, paragraphIndex) in item.content.split('\n')" :key="'paragraph' + paragraphIndex">
                {{ paragraph }}
            </p>
            <template #footer>
                <n-flex align="center" justify="end" :wrap="false">
                    <n-icon @click="messageCopyText(item.content)">
                        <CopyDocument v-if="!textCopied" />
                        <Check v-if="textCopied" />
                    </n-icon>
                    <n-time :time="item.time" format="HH:mm:ss" />
                </n-flex>
            </template>
        </n-card>
    </MessageItemBase>
</template>

<style scoped>
p {
    font-size: 16px;
    overflow-wrap: break-word;
    word-break: break-word;
    min-height: 22px;
    margin: 8px 0;
}

.n-card {
    border-radius: 10px;
}

.n-icon:hover {
    cursor: pointer;
    color: var(--primary-color-hover);
}
</style>