import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    accountsList: [],
  }),
  mutations: {
    setAccountList(state, accounts) {
      state.accountsList = accounts;
    },
  },
  actions: {
    async fetchAccountList({ commit }) {
      const response = await graphqlClient.query({
        query: gql`
          query AccountList {
            accounts {
              id
              Name
            }
          },
        `,
      });

      commit('setAccountList', response.data.accounts);
    },
  },
};
