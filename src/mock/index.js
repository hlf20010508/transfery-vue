import Mock from "mockjs"
//Mock.mock("url", "get", require("file"));
//Mock.mock("url", "post", (request) => { console.log('request: ', request) });
Mock.mock("/get/page?page=0", "get", require("./page0.json"));
Mock.mock("/get/page?page=1", "get", require("./page1.json"));