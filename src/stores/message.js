import { ref } from "vue";

let messageList = ref([]);
let messageItemRemoving = ref(false);

export default function () {
    return {
        messageList,
        messageItemRemoving,
    }
};