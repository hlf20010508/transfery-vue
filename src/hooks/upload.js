import { reactive } from "vue";
import axios from "axios";
import { messageList } from "@/stores/message.js"
import { messageAreaScrollToBottom } from "@/hooks/message.js"
import { socket } from "@/socket";
import { getCurrentTimeStamp } from "@/utils";

const BYTES_PER_PIECE = 5 * 1024 * 1024;

async function uploadPart(newItem, partNumber) {
    let isComplete = false;
    while (!isComplete) {
        if (newItem.pause) {
            return;
        }
        let startBytes = partNumber * BYTES_PER_PIECE;
        let endBytes = startBytes + BYTES_PER_PIECE;

        let fileSize = newItem.file.size;
        if (endBytes > fileSize) {
            endBytes = fileSize;
            isComplete = true;
        }
        partNumber += 1;

        let filePart = newItem.file.slice(startBytes, endBytes);

        let form = new FormData();
        form.append("filePart", filePart);
        form.append("content", newItem.fileName);
        form.append("uploadId", newItem.uploadId);
        form.append("partNumber", partNumber);

        await axios({
            method: "post",
            url: "/post/uploadPart",
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
            let data = res.data
            if (data.success) {
                newItem.percentage = ((endBytes / fileSize) * 100) | 0;
                newItem.parts.push({
                    partNumber: partNumber,
                    etag: data.etag,
                });
            }
        });
    }
}

async function completeUpload(newItem, onFinish) {
    await axios
        .post("/post/completeUpload", {
            content: newItem.fileName,
            uploadId: newItem.uploadId,
            parts: newItem.parts,
        })
        .then((res) => {
            if (res.data.success) {
                let item = {
                    content: newItem.content,
                    fileName: newItem.fileName,
                    type: newItem.type,
                    time: newItem.time,
                };

                socket.emit("pushItem", item, (id, success) => {
                    if (success) {
                        newItem.id = id;
                        newItem.isComplete = true;
                        onFinish();
                        console.log("uploaded");
                    }
                });
            }
        });
}

export function uploadFile(params) {
    console.log("enter uploadFile", getCurrentTimeStamp())

    // 传入参数提取出file，file.file为File对象
    let file = params.file.file;

    let newItem = reactive({
        content: file.name,
        type: "file",
        percentage: 0,
        isComplete: false,
        pause: false,
        parts: [],
        file: file,
        time: getCurrentTimeStamp(),
    });
    console.log("upload item: ", newItem);
    messageList.value.push(newItem);
    messageAreaScrollToBottom();

    let partNumber = 0;
    axios
        .post("/post/getUploadId", { content: newItem.content, time: newItem.time })
        .then(async (res) => {
            let data = res.data;
            if (data.success) {
                newItem.uploadId = data.uploadId;
                newItem.fileName = data.fileName;
                console.log("get uploadId:", newItem.uploadId);
                console.log("get fileName:", newItem.fileName);

                await uploadPart(newItem, partNumber);

                await completeUpload(newItem, params.onFinish);
            }
        });
}