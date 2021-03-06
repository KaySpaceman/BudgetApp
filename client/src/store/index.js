import Vue from 'vue';
import Vuex from 'vuex';
import transactions from './modules/transactions.js';
import vaults from './modules/vaults.js';
import categories from './modules/categories.js';
import accounts from './modules/accounts.js';
import users from './modules/users.js';
import charts from './modules/charts.js';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    transactions,
    vaults,
    categories,
    accounts,
    users,
    charts,
  },
});
