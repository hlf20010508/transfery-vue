import http from "@/http";

export function download(item) {
    console.log("download: ", item.fileName);
    http
        .get("/downloadUrl", { params: { fileName: item.fileName } })
        .then(res => {
            let data = res.data;
            if (data.success) {
                window.open(data.url, '_blank');
            }
        });
}