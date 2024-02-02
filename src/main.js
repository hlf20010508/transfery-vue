/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import axios from "axios"
import { socketIO } from '@/socket'

const app = createApp(App)

app.use(router)
app.use(socketIO)

if (import.meta.env.DEV) {
    axios.defaults.baseURL = '/api'
}

app.mount('#app')
