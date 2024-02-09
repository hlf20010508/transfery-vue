/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import cnlorem from "cnlorem";
import { getCurrentTimeStamp } from "@/utils";
import { randomInt } from "./utils.js";

const exts = [".txt", ".docx", ".pptx", ".xlsx", ".pdf", ".zip", ".mp3" ,".mp4"];

export function mockId() {
    return randomInt(0, 100);
}

function mockContent() {
    return cnlorem(randomInt(10, 100));
}

function mockTimestamp() {
    // 模拟三天内的时间戳
    return getCurrentTimeStamp() - randomInt(0, 3 * 24 * 3600 * 1000);
}

function mockFileName(id) {
    return "mock-file-" + id + exts[randomInt(0, exts.length - 1)];
}

function mockMessageText() {
    return {
        id: mockId(),
        content: mockContent(),
        timestamp: mockTimestamp(),
        type: "text",
        hasChecked: true,
    }
}

function mockMessageFile() {
    const id = mockId();
    const fileName = mockFileName(id);
    return {
        id: id,
        content: fileName,
        timestamp: mockTimestamp(),
        type: "file",
        fileName: fileName,
        isComplete: true,
        hasChecked: true,
    }
}

export default function mockMessage(number) {
    let mockData = {};
    const mockFunctions = [mockMessageText, mockMessageFile];
    for (let i = 0; i < number; i++) {
        let item = mockFunctions[randomInt(0, mockFunctions.length - 1)]();
        mockData[item.id] = item;
    }
    return mockData;
}