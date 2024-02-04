/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-3-socket.io';

let isDev = import.meta.env.DEV;

export const socket = (() => {
    if (isDev) {
        return SocketIO(import.meta.env.VITE_PROXY_HOSTNAME);
    } else {
        return SocketIO(location.protocol + '//' + location.hostname + ':' + location.port + '/');
    }
})();

export const socketIO = new VueSocketIO({
    debug: true,
    connection: socket
});