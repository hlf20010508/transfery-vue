/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import SocketIO from 'socket.io-client';
import Vue3SocketIO from '@hlf01/vue3-socket.io';

export const socket = (
    () => SocketIO(location.protocol + '//' + location.hostname + ':' + location.port + '/')
)();

export const socketIO = new Vue3SocketIO({
    debug: true,
    connection: socket,
});