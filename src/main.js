/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { socketIO } from "@/socket";
import { isDemo } from "@/utils";

const app = createApp(App);

app.use(router);

if (!isDemo()) {
    app.use(socketIO);
}

app.mount('#app');
