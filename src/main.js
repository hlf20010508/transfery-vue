// -*- coding: utf-8 -*-
// 
// (C) 2022 L-ING <hlf01@icloud.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import InfiniteLoading from 'vue-infinite-loading';
import router from './router'
import axios from "axios";
import VueAxios from "vue-axios";
import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.use(InfiniteLoading);
Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO(location.protocol+'//'+document.domain+':'+location.port+'/')
}))

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
