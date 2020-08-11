import Vue from 'vue';
import Vuex from 'vuex';
import accounts from './modules/accounts.js';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    accounts,
  },
});
