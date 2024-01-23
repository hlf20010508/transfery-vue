/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { shouldShowTime, isInArray } from "@/methods/utils.js";

export function toBottom(context) {
    let component = context.$refs.MessageArea;
    component.$refs.myScrollbar.scrollTop =
        component.$refs.myScrollbar.scrollHeight;
}

export function getNewPage(context, $state) {
    context.axios
        .get("/get/page", {
            params: {
                size: context.list.length,
            },
        })
        .then((response) => {
            let data = response.data;
            if (data.messages.length) {
                context.page += 1;
                context.list.unshift(...data.messages.reverse());
                $state.loaded();
            } else {
                $state.complete();
            }
        });
}

export function sync(context) {
    console.log("syncing...");
    let size = context.list.length;
    let lastId;
    if (size > 0 && context.list[0].id) {
        let i = size - 1;
        while (!context.list[i].id) {
            //寻找最后一个有id的item，可以跳过正在上传的没有id的item
            i -= 1;
        }
        lastId = context.list[i].id;
    } else {
        lastId = 0;
    }
    context.axios
        .get("/get/sync", {
            params: {
                lastId: lastId,
            },
        })
        .then((res) => {
            let temp = res.data.newItems;
            console.log("received synced new items:", temp);
            if (temp.length > 0) {
                let i;
                let idList = [];
                for (i of context.list) {
                    idList.push(i.id);
                }
                let newItems = [];
                for (i of temp) {
                    if (!isInArray(i.id, idList)) {
                        newItems.push(i);
                    }
                }
                if (newItems.length > 0) {
                console.log("final synced new items:", newItems);
                context.list.push(...newItems);

                context.$nextTick(() => context.toBottom());
                console.log("unsynced items pushed");
                } else {
                    console.log("no unsynced item");
                }
            } else {
                console.log("no unsynced item");
            }
        });
    console.log("synced");
}

export function submit(context, value) {
    if (value != "\n") {
        console.log("submit: ", value);
        let date = new Date();
        let time = Date.parse(date);
        let showTime = false;
        let size = context.list.length;
        if (size > 0) {
            showTime = shouldShowTime(time, context.list[size - 1].time);
        } else {
            showTime = true;
        }

        let newItem = {
            content: value,
            type: "text",
            showTime: showTime,
            time: time,
        };
        context.$socket.emit("pushItem", newItem, (id, success) => {
            if (success) {
                newItem.id = id;
                context.list.push(newItem);
                console.log("pushed");
                context.$nextTick(() => context.toBottom());
            }
        });
    }
}

export function remove(context) {
    //开关删除模式
    if (!context.removing) {
        context.removing = true;
    } else {
        context.unremove();
    }
}

export function unremove(context) {
    //关闭删除模式
    context.removing = false;
}

export function removeItem(context, item, index) {
    //删除项目
    console.log("remove item: ", item);
    let showTime = false;
    let deletedItem = item;
    deletedItem.change = null;
    if (index != context.list.length - 1) {
        if (context.list[index].showTime) {
            //如果被删除的项目会显示时间，则将下一个项目改为会显示时间
            showTime = true;
            deletedItem.change = {
                id: context.list[index + 1].id,
            };
        }
    }
    context.$socket.emit("remove", deletedItem, (success) => {
        if (success) {
            if (showTime) {
                context.list[index + 1].showTime = true;
            }
            context.list.splice(index, 1);
            console.log("removed");
        }
    });
}

export function removeAll(context) {
    if (confirm("确定要删除全部吗")) {
        context.$socket.emit("removeAll", (success) => {
            if (success) {
                context.list = [];
                context.unremove();
                console.log("removed all items");
                context.$message({
                    showClose: true,
                    message: "删除成功",
                    type: "success",
                    duration: 1500,
                });
            }
        });
    } else {
        context.$message({
            showClose: true,
            message: "已取消删除",
            duration: 1500,
        });
    }
}