import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    transactionList: [],
    selectedTransaction: Object,
  }),
  mutations: {
    selectTransaction(state, transaction) {
      state.selectedTransaction = transaction;
    },
    addTransactionToList(state, transaction) {
      state.transactionList.add(transaction);
    },
    setTransactionList(state, transactionList) {
      state.transactionList = transactionList;
    },
  },
  actions: {
    async fetchTransactionList({ commit }) {
      const response = await graphqlClient.query({
        query: gql`
          query TransactionList {
            transactions {
              id
              Date
              Amount
              Note
              Category {
                id
                Name
              }
            }
          },
        `,
      });

      commit('setTransactionList', response.data.transactions);
    },
  },
};
