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

const props = defineProps(["messageList", "index"]);
const item = props.messageList[props.index];

let textCopied = ref(false);
let timer = -1; // 未定义计时器时的默认ID

function copyText(content) {
    content = content.trim();

    // 当上下文非安全时，即非https或localhost时，无法使用navigator.clipboard
    if (window.isSecureContext)
        navigator.clipboard.writeText(content);
    else
        copyTextFallback(content);

    textCopied.value = true;

    // 防止大量重复点击产生多个计时器
    clearTimeout(timer);
    timer = setTimeout(
        () => textCopied.value = false,
        1000
    );
}

function copyTextFallback(content) {
    let textArea = document.createElement("textarea");
    textArea.value = content;

    // 不能使用
    // textArea.style.display = "none";

    // 使textarea不在视图中
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Copy fallback: unable to copy:', err);
    }

    document.body.removeChild(textArea);
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
            <n-icon @click="copyText(item.content)">
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