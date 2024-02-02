/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { createRouter, createWebHashHistory } from "vue-router";
import Index from '@/views/Index.vue';

const routes = [
  {
    path: "/",
    component: Index,
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

