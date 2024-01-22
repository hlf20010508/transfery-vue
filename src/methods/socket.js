export function connect(context) {
    console.log(`client ${context.$socket.id} connected`);
}

export function disconnect(context) {
    console.log(`client ${context.$socket.id} disconnected`);
}

export function getNewItem(context, item) {
    console.log("got new item");
    let size = context.list.length;
    if (size == 0 || item.id > context.list[size - 1].id) {
        context.list.push(item);
    } else {
        let i = 0;
        while (i < context.list.length) {
            if (item.id < context.list[i].id) {
                context.list.splice(i, 0, item);
                break;
            } else {
                i += 1;
            }
        }
    }
    console.log("new item pushed");
    context.$nextTick(() => context.toBottom());
}

export function removeItem(context, id) {
    console.log("got item to be removed");
    for (let i in context.list) {
        if (context.list[i].id == id) {
            context.list.splice(i, 1);
            console.log("item removed");
            break;
        }
    }
}

export function removeAll(context) {
    context.list = [];
    console.log("all items removed");
}