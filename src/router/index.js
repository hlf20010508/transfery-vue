/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { createRouter, createWebHashHistory } from "vue-router";
import Index from '@/views/Index.vue';
import Login from '@/views/Login.vue';
import Device from '@/views/Device.vue';
import Token from '@/views/Token.vue';

const routes = [
    {
        name: "index",
        path: "/",
        component: Index,
    },
    {
        name: "login",
        path: "/login",
        component: Login,
    },
    {
        name: "device",
        path: "/device",
        component: Device,
    },
    {
        name: "token",
        path: "/token",
        component: Token,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});

export default router;