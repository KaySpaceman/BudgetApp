import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    transactionList: [],
    selectedTransaction: Object,
  }),
  mutations: {
    setTransactionList(state, transactionList) {
      state.transactionList = transactionList;
    },
    addTransactionToList(state, transaction) {
      const existingIndex = state.transactionList.findIndex((t) => t.id === transaction.id);

      if (existingIndex < 0) {
        state.transactionList.unshift(transaction);
      } else {
        state.transactionList.splice(existingIndex, 1, transaction);
      }
    },
    selectTransaction(state, transaction) {
      state.selectedTransaction = transaction;
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
              Account {
                id
              }
              Type
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
    async upsertTransaction({ commit }, formData) {
      // eslint-disable-next-line no-param-reassign
      delete formData.__typename;

      const response = await graphqlClient.mutate({
        mutation: gql`
          mutation UpsertTransaction($formData: TransactionInput!) {
            upsertTransaction(transaction: $formData) {
              id
              Date
              Amount
              Note
              Account {
                id
              }
              Type
              Category {
                id
                Name
              }
            }
          },
        `,
        variables: {
          formData,
        },
      });

      commit('addTransactionToList', response.data.upsertTransaction);
    },
  },
};
