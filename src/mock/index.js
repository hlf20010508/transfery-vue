import Mock from "mockjs"
//Mock.mock("url", "get", require("file"));
//Mock.mock("url", "post", (request) => { console.log('request: ', request) });
Mock.mock("/get/page?page=0", "get", require("../../static/page0.json"));
Mock.mock("/get/page?page=1", "get", require("../../static/page1.json"));
Mock.mock("/get/page?page=2", "get", require("../../static/page2.json"));
Mock.mock("/post/message", "post", (request) => {
    console.log('request: ', request)
    return {
        success: true
    }
})
Mock.mock("/get/download?content=file1", "get", require("../../static/url.json"))
Mock.mock("/post/upload", "post", (request) => {
    console.log('request: ', request)
    return {
        success: true,
    }
})
Mock.mock("/post/remove", "post", (request) => {
    console.log('request: ', request)
    return {
        success: true
    }
})
