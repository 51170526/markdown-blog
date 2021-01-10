import Vue from 'vue'
import App from './App.vue'
import router from './router'
import mavonEditor from 'mavon-editor'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(mavonEditor)
Vue.use(VueAxios, axios)
Vue.use(Antd);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
