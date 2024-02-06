import { reactive } from "vue";
import http from "@/http";
import { messageBuffer } from "@/stores/message.js"
import { messageAreaScrollToBottom } from "@/hooks/message.js"
import { socket } from "@/socket";
import { getCurrentTimeStamp } from "@/utils";

const BYTES_PER_PIECE = 5 * 1024 * 1024;

async function uploadParts(item, startPartNumber) {
    let partNumber = startPartNumber;
    let isComplete = false;
    while (!isComplete) {
        if (item.pause) {
            return;
        }
        let startBytes = partNumber * BYTES_PER_PIECE;
        let endBytes = startBytes + BYTES_PER_PIECE;

        let fileSize = item.file.size;
        if (endBytes > fileSize) {
            endBytes = fileSize;
            isComplete = true;
        }
        partNumber += 1;

        let filePart = item.file.slice(startBytes, endBytes);

        let form = new FormData();
        form.append("filePart", filePart);
        form.append("content", item.fileName);
        form.append("uploadId", item.uploadId);
        form.append("partNumber", partNumber);

        await http({
            method: "post",
            url: "/uploadPart",
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
            let data = res.data
            if (data.success) {
                item.percentage = ((endBytes / fileSize) * 100) | 0;
                item.parts.push({
                    partNumber: partNumber,
                    etag: data.etag,
                });
            }
        });
    }
}

async function completeUpload(item) {
    await http
        .post("/completeUpload", {
            content: item.fileName,
            uploadId: item.uploadId,
            parts: item.parts,
        })
        .then((res) => {
            if (res.data.success) {
                item.isComplete = true;
            }
        });
}

export function uploadFile(params) {
    // 立即终止上传按钮对上传项目的监控，防止重复上传
    params.onFinish();
    // 传入参数提取出file，file.file为File对象
    let file = params.file.file;

    let item = reactive({
        content: file.name,
        type: "file",
        percentage: 0,
        isComplete: false,
        pause: false,
        parts: [],
        file: file,
        time: getCurrentTimeStamp(),
    });
    console.log("upload item: ", item);

    http
        .post("/fetchUploadId", { content: item.content, time: item.time })
        .then(async (res) => {
            let data = res.data;
            if (data.success) {
                item.uploadId = data.uploadId;
                item.fileName = data.fileName;
                console.log("get uploadId:", item.uploadId);
                console.log("get fileName:", item.fileName);

                let itemInfo = {
                    content: item.content,
                    fileName: item.fileName,
                    type: item.type,
                    time: item.time,
                    sid: socket.id,
                };

                http.post("/newItem", itemInfo).then(async res => {
                    let data = res.data;
                    if (data.success) {
                        console.log("get id:", data.id);
                        item.id = data.id;

                        console.log(item)
                        messageBuffer.value[item.id] = item;
                        messageAreaScrollToBottom();

                        await uploadParts(item, 0);
                        await completeUpload(item);
                    }
                });
            }
        });
}

export function pauseUpload(id) {
    messageBuffer.value[id].pause = true;
}

export async function resumeUpload(id) {
    let item = messageBuffer.value[id];
    item.pause = false;
    let partNumber = item.parts.length;
    console.log("resume uploadId:", item.uploadId);
    console.log("resume fileName:", item.fileName);

    await uploadParts(item, partNumber);
    await completeUpload(item);
}