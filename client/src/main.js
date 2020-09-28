import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';
import { createProvider } from './vue-apollo.js';

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount('#app');
