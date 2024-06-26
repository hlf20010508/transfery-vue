/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { reactive } from "vue";
import http from "@/http";
import { messageBuffer, messageItemRemoving } from "@/stores/message.js"
import { isPrivate } from "@/stores/admin.js"
import { messageAreaScrollToBottom } from "@/hooks/message.js"
import { socketEmitProgress } from "@/hooks/socket.js"
import { socket } from "@/socket";
import { getCurrentTimeStamp } from "@/utils";

// must larger than 5 * 1024 * 1024
const BYTES_PER_PIECE = 5 * 1024 * 1024;

async function uploadParts(item, startPartNumber) {
    let partNumber = startPartNumber;
    let isComplete = false;
    while (!isComplete) {
        if (item.pause) {
            return;
        }

        // 此时禁止resume
        item.resumeAllowed = false

        const startBytes = partNumber * BYTES_PER_PIECE;
        let endBytes = startBytes + BYTES_PER_PIECE;

        const fileSize = item.file.size;
        if (endBytes > fileSize) {
            endBytes = fileSize;
            isComplete = true;
        }

        partNumber += 1;

        const filePart = item.file.slice(startBytes, endBytes);

        let form = new FormData();
        form.append("filePart", filePart);
        form.append("fileName", item.fileName);
        form.append("uploadId", item.uploadId);
        form.append("partNumber", partNumber);

        await http({
            method: "post",
            url: "/uploadPart",
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(res => {
            item.percentage = parseInt(endBytes / fileSize * 100);
            item.parts.push({
                number: partNumber,
                etag: res.data,
            });

            socketEmitProgress(item);

            // 此后可以resume
            item.resumeAllowed = true;

        });
    }

    await completeUpload(item);
}

async function completeUpload(item) {
    // 此时禁止resume，否则虽然能够成功上传，但是后台可能会多收到分片
    item.resumeAllowed = false

    await http
        .post("/completeUpload", {
            id: item.id,
            fileName: item.fileName,
            uploadId: item.uploadId,
            parts: item.parts,
        })
        .then(() => {
            item.isComplete = true;

            socketEmitProgress(item);

            console.log("upload complete:", item.fileName);

        });
}

export function uploadFile(params) {
    // 立即终止上传按钮对上传项目的监控，防止重复上传
    params.onFinish();

    // 关闭删除模式
    messageItemRemoving.value = false;

    // 传入参数提取出file，file.file为File对象
    let file = params.file.file;

    let item = reactive({
        content: file.name,
        timestamp: getCurrentTimeStamp(),
        type: "file",
        isComplete: false,
        percentage: 0,
        pause: false,
        resumeAllowed: false,
        parts: [],
        file: file,
        isHost: true, // 标记为本机上传
    });

    item.isPrivate = isPrivate.value;

    http
        .post("/fetchUploadId", { content: item.content, timestamp: item.timestamp })
        .then(async res => {
            item.uploadId = res.data.uploadId;
            item.fileName = res.data.fileName;

            http.post("/newItem", {
                content: item.content,
                timestamp: item.timestamp,
                isPrivate: item.isPrivate,
                type: item.type,
                fileName: item.fileName,
                isComplete: item.isComplete,
                sid: socket.id,
            }).then(async res => {
                item.id = res.data.id;

                messageBuffer.value[item.id] = item;

                console.log("upload item:", item)

                messageAreaScrollToBottom();

                await uploadParts(item, 0);

            });

        });
}

export function pauseUpload(id) {
    let item = messageBuffer.value[id];

    if (item.isHost)
        item.pause = true;
}

export async function resumeUpload(id) {
    // 在上传分片的过程中禁止resume，否则若短时间内多次切换pause和resume会调用多个uploadParts
    if (messageBuffer.value[id].resumeAllowed) {
        let item = messageBuffer.value[id];

        item.pause = false;

        const partNumber = item.parts.length;

        console.log("resume uploadId:", item.uploadId);
        console.log("resume fileName:", item.fileName);

        await uploadParts(item, partNumber);
    }
}