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
// axios.defaults.baseURL = '/api'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
