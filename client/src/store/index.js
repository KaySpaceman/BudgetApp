import Vue from 'vue';
import Vuex from 'vuex';
import transactions from './modules/transactions.js';
import categories from './modules/categories.js';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    transactions,
    categories,
  },
});
