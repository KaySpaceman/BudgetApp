import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accounts: [],
    totals: {},
  },
  mutations: {
    addAccount() {
      this.$store.commit('increment')
      console.log(this.$store.state.count)
    },
  },
  actions: {
    createAccount() {

    },
    reloadAccounts() {

    },
    reloadTotals() {

    },
  },
});
