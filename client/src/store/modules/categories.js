import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    spendingCategories: [],
    incomeCategories: [],
    selectedCategory: Object,
    staleCache: false,
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
    invalidateCategoryCache(state) {
      state.staleCache = true;
    },
  },
  actions: {
    async fetchCategories({ commit, state }, { type }) {
      const forceRefresh = state.staleCache;
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
    async upsertCategory({ commit, dispatch }, formData) {
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
        commit('invalidateCategoryCache');
        dispatch('fetchCategories', { type: 'SPENDING' });
        dispatch('fetchCategories', { type: 'INCOME' });
      }
    },
    async deleteCategory({ commit, dispatch }, id) {
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
        commit('invalidateCategoryCache');
        dispatch('fetchCategories', { type: 'SPENDING' });
        dispatch('fetchCategories', { type: 'INCOME' });
      }
    },
  },
};
