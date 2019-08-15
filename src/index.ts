import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'

import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  loading: require('./assets/image/default.png')
})
fastclick.attach(document.body)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#App')