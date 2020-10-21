import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    spendingCategories: [],
    incomeCategories: [],
    selectedCategory: Object,
  }),
  getters: {
    allCategories: (state) => state.spendingCategories.concat(state.incomeCategories),
  },
  mutations: {
    setSpendingCategories(state, categories) {
      state.spendingCategories = categories;
    },
    setIncomeCategories(state, categories) {
      state.incomeCategories = categories;
    },
    selectCategory(state, category) {
      state.selectedCategory = category;
    },
  },
  actions: {
    async fetchCategories({ commit }, { type, forceRefresh }) {
      let mutation = '';

      switch (type) {
        case 'INCOME':
          mutation = 'setIncomeCategories';
          break;
        case 'SPENDING':
          mutation = 'setSpendingCategories';
          break;
        default:
          return;
      }

      const response = await graphqlClient.query({
        query: gql`
          query Categories {
            categories(maxLevel: 1, type: "${type}") {
              id
              Name
              Level
              Parent {
                id
              }
              Children {
                id
                Name
                Level
                Parent {
                  id
                }
                Children {
                  id
                  Name
                  Level
                  Parent {
                    id
                  }
                }
              }
            }
          },
        `,
        fetchPolicy: forceRefresh ? 'network-only' : 'cache-first',
      });

      commit(mutation, response.data.categories);
    },
    async upsertCategory({ dispatch }, formData) {
      // eslint-disable-next-line no-param-reassign
      delete formData.__typename;

      const response = await graphqlClient.mutate({
        mutation: gql`
          mutation UpsertCategory($formData: CategoryInput!) {
            upsertCategory(category: $formData) {
              id
            }
          },
        `,
        variables: {
          formData,
        },
      });

      if (response.data.upsertCategory.id) {
        dispatch('fetchCategories', { type: 'SPENDING', forceRefresh: true });
        dispatch('fetchCategories', { type: 'INCOME', forceRefresh: true });
      }
    },
    async deleteCategory({ dispatch }, id) {
      const response = await graphqlClient.mutate({
        mutation: gql`
          mutation DeleteCategory($id: ID!) {
            deleteCategory(categoryId: $id)
          }
        `,
        variables: {
          id,
        },
      });

      if (response.data.deleteCategory) {
        dispatch('fetchCategories', { type: 'SPENDING', forceRefresh: true });
        dispatch('fetchCategories', { type: 'INCOME', forceRefresh: true });
      }
    },
  },
};
