import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    transactionList: [],
    selectedTransaction: {},
    page: 1,
    perPage: 10,
    count: 20,
    cachedPages: [],
    stalePages: [],
  }),
  mutations: {
    setTransactionList(state, transactionList) {
      state.transactionList = transactionList;
    },
    addTransactionToList(state, transaction) {
      const existingIndex = state.transactionList.findIndex((t) => t.id === transaction.id);

      if (existingIndex < 0) {
        if (state.page === 1) {
          state.transactionList.unshift(transaction);
        }
      } else {
        state.transactionList.splice(existingIndex, 1, transaction);
      }
    },
    removeTransaction(state, id) {
      const deleteIndex = state.transactionList.findIndex((t) => t.id === id);

      if (deleteIndex >= 0) {
        state.transactionList.splice(deleteIndex, 1);
      }
    },
    selectTransaction(state, transaction) {
      state.selectedTransaction = transaction;
    },
    setTransactionCount(state, count) {
      state.count = count;
    },
    setTransactionPage(state, page) {
      state.page = page;
    },
    setTransactionPerPage(state, perPage) {
      state.perPage = perPage;
    },
    invalidateTransactionCache(state) {
      state.stalePages = [...state.stalePages, ...state.cachedPages];
      state.cachedPages = [];
      state.count = null;
    },
    addCachedPage(state, page) {
      if (!state.cachedPages.includes(page)) {
        state.cachedPages.push(page);
      }
    },
    removeStalePage(state, page) {
      state.stalePages.splice(state.stalePages.indexOf(page), 1);
    },
  },
  actions: {
    async fetchTransactionList({ commit, state }) {
      const { page } = state;
      const forceRefresh = state.stalePages.includes(page);

      const response = await graphqlClient.query({
        query: gql`
          query TransactionList($page: Int, $perPage: Int) {
            transactions(page: $page, perPage: $perPage) {
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
          page,
          perPage: state.perPage,
        },
        fetchPolicy: forceRefresh ? 'network-only' : 'cache-first',
      });

      if (forceRefresh) {
        commit('removeStalePage', page);
      }

      commit('addCachedPage', page);
      commit('setTransactionList', response.data.transactions);
    },
    async upsertTransaction({ commit, state, dispatch }, formData) {
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

      commit('invalidateTransactionCache');
      commit('addTransactionToList', response.data.upsertTransaction);

      if (state.page !== 1) {
        commit('setTransactionPage', 1);
        dispatch('fetchTransactionList');
        dispatch('fetchTransactionCount');
      }
    },
    async createTransferTransaction(
      { commit, state, dispatch }, { transaction, destination, createCopy },
    ) {
      // eslint-disable-next-line no-param-reassign
      delete transaction.__typename;

      const response = await graphqlClient.mutate({
        mutation: gql`
          mutation CreateTransferTransaction(
            $transaction: TransactionInput!,
            $destination: ID!,
            $createCopy: Boolean!
          ) {
            createTransferTransaction(
              transaction: $transaction,
              destination: $destination,
              createCopy: $createCopy
            ) {
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
          transaction,
          destination,
          createCopy,
        },
      });

      commit('invalidateTransactionCache');
      response.data.createTransferTransaction.forEach((responseTransaction) => {
        commit('addTransactionToList', responseTransaction);
      });

      if (state.page !== 1) {
        commit('setTransactionPage', 1);
        dispatch('fetchTransactionList');
      }
    },
    async deleteTransaction({ commit }, id) {
      const response = await graphqlClient.mutate({
        mutation: gql`
          mutation DeleteTransaction($id: ID!) {
            deleteTransaction(transactionId: $id)
          }
        `,
        variables: {
          id,
        },
      });

      if (response.data.deleteTransaction) {
        commit('removeTransaction', id);
        commit('invalidateTransactionCache');
      }
    },
    async fetchTransactionCount({ commit, state }) {
      const forceRefresh = state.count === null;

      const response = await graphqlClient.query({
        query: gql`
          query TransactionCount {
            transactionCount
          }
        `,
        fetchPolicy: forceRefresh ? 'network-only' : 'cache-first',
      });

      commit('setTransactionCount', response.data.transactionCount);
    },
  },
};
