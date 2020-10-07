import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    spendingCategories: [],
    incomeCategories: [],
  }),
  mutations: {
    setSpendingCategories(state, categories) {
      state.spendingCategories = categories;
    },
    setIncomeCategories(state, categories) {
      state.incomeCategories = categories;
    },
  },
  actions: {
    async fetchCategories({ commit }, { type, mutation }) {
      const response = await graphqlClient.query({
        query: gql`
          query Categories {
            categories(maxLevel: 1, type: "${type}") {
              id
              Name
              Level
              Children {
                id
                Name
                Level
                Children {
                  id
                  Name
                  Level
                }
              }
            }
          },
        `,
      });

      commit(mutation, response.data.categories);
    },
  },
};
