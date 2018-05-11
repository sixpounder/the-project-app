import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import brands from '@fortawesome/fontawesome-free-brands';
import './registerServiceWorker'

Vue.config.productionTip = false

fontawesome.library.add(solid);
fontawesome.library.add(brands);

Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
