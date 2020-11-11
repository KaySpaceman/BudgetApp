import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    accountsList: [],
    isStale: false,
  }),
  mutations: {
    setAccountList(state, accounts) {
      state.accountsList = accounts;
    },
    toggleAccountCache(state) {
      state.isStale = !state.isStale;
    },
  },
  actions: {
    async fetchAccountList({ commit, state }) {
      const response = await graphqlClient.query({
        query: gql`
          query AccountList {
            accounts {
              id
              Name
              Total
              Available
              Savings
            }
          },
        `,
        fetchPolicy: state.isStale ? 'network-only' : 'cache-first',
      });

      if (state.isStale) commit('toggleAccountCache');
      commit('setAccountList', response.data.accounts);
    },
  },
};
