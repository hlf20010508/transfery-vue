<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { ref } from "vue";
import { NIcon } from "naive-ui";
import { CopyDocument, Check } from "@element-plus/icons-vue";
import MessageItemBase from "./MessageItemBase.vue";
import { copyText } from "@/utils";

const props = defineProps(["messageList", "index"]);
const item = props.messageList[props.index];

let textCopied = ref(false);
let timer = -1; // 未定义计时器时的默认ID

function handleCopy(content) {
    copyText(content);

    textCopied.value = true;

    // 防止大量重复点击产生多个计时器
    clearTimeout(timer);
    timer = setTimeout(
        () => textCopied.value = false,
        1000
    );
}
</script>

<template>
    <MessageItemBase :messageList="messageList" :index="index">
        <template #container>
            <p v-for="(paragraph, paragraphIndex) in item.content.split('\n')" :key="'paragraph' + paragraphIndex">
                {{ paragraph }}
            </p>
        </template>
        <template #footer>
            <n-icon @click="handleCopy(item.content)">
                <CopyDocument v-if="!textCopied" />
                <Check v-if="textCopied" />
            </n-icon>
        </template>
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

.n-icon:hover {
    cursor: pointer;
    color: var(--primary-color-hover);
}
</style>