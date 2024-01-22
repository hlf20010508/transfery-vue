/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import axios from "axios";
import jquery from "jquery";
import { shouldShowTime } from "@/methods/utils.js";

const BYTES_PER_PIECE = 5 * 1024 * 1024;

export function download(item) {
  console.log("download: ", item.content);
  axios
    .get("/get/download", { params: { fileName: item.fileName } })
    .then((res) => {
      let data = res.data;
      if (data.success) {
        var eleLink = jquery("<a></a>")
          .attr("target", "_blank")
          .attr("href", data.url)
          .css("display", "none")
          .appendTo("body");

        eleLink[0].click();
        eleLink.remove();
        console.log("downloaded");
      }
    });
}

async function uploader(context, newItem, partNumber) {
  let stop = false;
  while (!stop) {
    if (newItem.pause) {
      return;
    }
    let startBytes = partNumber * BYTES_PER_PIECE;
    let endBytes = startBytes + BYTES_PER_PIECE;
    if (endBytes > newItem.file.size) {
      endBytes = newItem.file.size;
      stop = true;
    }
    partNumber += 1;

    let filePart = newItem.file.slice(startBytes, endBytes);

    let form = new FormData();
    form.append("filePart", filePart);
    form.append("content", newItem.fileName);
    form.append("uploadId", newItem.uploadId);
    form.append("partNumber", partNumber);

    await context.axios({
      method: "post",
      url: "/post/uploadPart",
      data: form,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => {
      if (res.data.success) {
        newItem.uploadingPercentage =
          ((endBytes / newItem.file.size) * 100) | 0;
        newItem.parts.push({
          partNumber: partNumber,
          etag: res.data.etag,
        });
      }
    });
  }

  await context.axios
    .post("/post/completeUpload", {
      content: newItem.fileName,
      uploadId: newItem.uploadId,
      parts: newItem.parts,
    })
    .then((res) => {
      if (res.data.success) {
        newItem.uploadingPercentage = -1;

        let size = context.list.length;
        let time = Date.parse(Date());
        let showTime = true;
        if (size > 0) {
          showTime = shouldShowTime(time, context.list[size - 1].time);
        }
        newItem.showTime = showTime;
        newItem.time = time;
        newItem = {
          content: newItem.content,
          fileName: newItem.fileName,
          type: newItem.type,
          showTime: newItem.showTime,
          time: newItem.time,
        };

        context.list.push(newItem);
        context.$socket.emit("pushItem", newItem, (id, success) => {
          if (success) {
            newItem.id = id;
            console.log("uploaded");
            context.$nextTick(() => context.toBottom());
          }
        });
      }
    });
}

export function uploadFile(context, res) {
  let time = Date.parse(Date());
  let newItem = {
    content: res.file.name,
    type: "file",
    uploadingPercentage: 0,
    pause: false,
    parts: [],
    file: res.file,
  };
  console.log("upload item: ", newItem);
  context.uploadsList.unshift(newItem);
  context.$refs.ControlBar.showUploadsArea = true;

  let partNumber = 0;

  context.axios
    .post("/post/getUploadId", { content: newItem.file.name, time: time })
    .then(async (res) => {
      if (res.data.success) {
        newItem.uploadId = res.data.uploadId;
        newItem.fileName = res.data.fileName;
        console.log("get uploadId:", newItem.uploadId);
        console.log("get fileName:", newItem.fileName);
        await uploader(context, newItem, partNumber);
      }
    });
}

export function pauseUploadsItem(context, index) {
  context.uploadsList[index].pause = true;
}

export async function resumeUploadsItem(context, index) {
  context.uploadsList[index].pause = false;
  let newItem = context.uploadsList[index];
  let partNumber = context.uploadsList[index].parts.length;
  console.log("resume uploadId:", newItem.uploadId);
  console.log("resume fileName:", newItem.fileName);
  await uploader(context, newItem, partNumber);
}

export function removeCompletedUploads(context) {
  // 删除已完成的项目，包括暂停的
  let i = 0;
  while (i < context.uploadsList.length) {
    if (
      context.uploadsList[i].uploadingPercentage === -1 ||
      context.uploadsList[i].pause
    ) {
      context.uploadsList.splice(i, 1);
    } else {
      i += 1;
    }
  }
  if (!context.uploadsList.length) {
    context.$refs.ControlBar.showUploadsArea = false;
  }
}