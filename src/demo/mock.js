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

function mockMessageBase(isNew=false) {
    return {
        id: mockId(),
        timestamp: isNew ? getCurrentTimeStamp() : mockTimestamp(),
        hasChecked: !isNew,
    }
}

function mockMessageText(isNew=false) {
    let item = mockMessageBase(isNew);
    item.type = "text";
    item.content = mockContent();
    return item;
}

function mockMessageFile(isNew=false) {
    let item = mockMessageBase(isNew);
    item.type = "file";
    item.fileName = mockFileName(item.id);
    item.content = item.fileName;
    item.isComplete = true;
    return item;
}

export function mockMessage(isNew=false) {
    const mockFunctions = [mockMessageText, mockMessageFile];
    const item = mockFunctions[randomInt(0, mockFunctions.length - 1)](isNew);
    return item;
}

export default function mockMessages(number) {
    let mockData = {};
    for (let i = 0; i < number; i++) {
        let item = mockMessage();
        mockData[item.id] = item;
    }
    return mockData;
}