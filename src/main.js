// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from './router'
import axios from "axios";
import VueAxios from "vue-axios";
import InfiniteLoading from 'vue-infinite-loading';

Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.use(InfiniteLoading);

if (process.env.NODE_ENV == "development") { require("./mock"); }

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
