import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    totalSpending: [],
    categorizedSpending: [],
  }),
  mutations: {
    setTotalSpending(state, totalSpending) {
      state.totalSpending = totalSpending;
    },
    setCategorizedSpending(state, categorizedSpending) {
      state.categorizedSpending = categorizedSpending;
    },
  },
  actions: {
    async fetchTotalSpending({ commit }, timeUnit) {
      const response = await graphqlClient.query({
        query: gql`
          query TotalSpendingChart($timeUnit: TimeUnit) {
            totalSpendingChart(timeUnit: $timeUnit) {
              x
              y
            }
          },
        `,
        variables: {
          timeUnit,
        },
      });

      commit('setTotalSpending', response.data.totalSpendingChart);
    },
    async fetchCategorizedSpending({ commit }, timePeriod) {
      const response = await graphqlClient.query({
        query: gql`
          query CategorizedSpendingChart($timePeriod: TimePeriod) {
            categorizedSpendingChart(timePeriod: $timePeriod) {
              name
              value
              children {
                name
                value
                children {
                  name
                  value
                  children {
                    name
                    value
                  }
                }
              }
            }
          },
        `,
        variables: {
          timePeriod,
        },
      });

      commit('setCategorizedSpending', response.data.categorizedSpendingChart);
    },
  },
};
