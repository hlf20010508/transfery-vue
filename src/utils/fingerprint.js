/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import sha256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";

function binaryToStringHex(string) {
    let hexResult = "";
    for (let i = 0; i < string.length; i++) {
        hexResult += integerToHexadecimal(string.charCodeAt(i));
    }
    return hexResult;
}

function integerToHexadecimal(integer) {
    let hexResult = integer.toString(16);
    while (hexResult.length < 4) {
        hexResult = "0" + hexResult;
    }
    return hexResult;
}

// 由于不同的操作系统和显卡在绘制canvas时采用的渲染参数、抗锯齿算法等可能不同，
// 因此绘制出的图片数据的CRC校验码也会不同，可以用于生成唯一的指纹
function generateCanvasCRC() {
    const textToDraw = 'Hello World!';

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    context.textBaseline = "top";
    context.font = "14px 'Arial'";
    context.fillStyle = "#f60";
    context.fillRect(125, 1, 62, 20);
    context.fillStyle = "#069";
    context.fillText(textToDraw, 2, 15);
    context.fillStyle = "rgba(102, 204, 0, 0.7)";
    context.fillText(textToDraw, 4, 17);

    let base64Image = canvas.toDataURL().replace("data:image/png;base64,", "");
    let binaryData = atob(base64Image);

    return binaryToStringHex(binaryData.slice(-16, -12));
}

function collectBrowserInfo() {
    const browserDetails = [
        navigator.appCodeName,
        navigator.appName,
        navigator.language,
        navigator.platform,
        navigator.product,
        navigator.productSub,
        navigator.vendor,
    ];

    return browserDetails.join('');
}

export default function getFingerprint() {
    return sha256(collectBrowserInfo() + generateCanvasCRC()).toString(Hex);
}