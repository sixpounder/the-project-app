import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import brands from '@fortawesome/fontawesome-free-brands';
import { LogMixin } from '@/lib/log';
import './registerServiceWorker'
import moment from 'moment';

Vue.config.productionTip = false

fontawesome.library.add(solid);
fontawesome.library.add(brands);

Vue.component('font-awesome-icon', FontAwesomeIcon);

sync(store, router);

Vue.filter('timeElapsed', function(value) {
  if(value) {
    return new moment(value).fromNow();
  } else {
    return null;
  }
});

new Vue({
  mixins: [LogMixin],
  router,
  store,
  render: h => h(App)
}).$mount('#app')
