import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    Username: '',
    FirstName: '',
    LastName: '',
    FullName: '',
    UnassignedSavings: 0,
    UnassignedInvestments: 0,
    BufferMonths: 6,
  }),
  mutations: {
    setUserInfo(state, user) {
      state.Username = user.Username;
      state.FirstName = user.FirstName;
      state.LastName = user.LastName;
      state.FullName = user.FullName;
      state.UnassignedSavings = user.UnassignedSavings;
      state.UnassignedInvestments = user.UnassignedInvestments;
      state.BufferMonths = user.BufferMonths;
    },
  },
  actions: {
    async loginUser({ commit }, { email, password }) {
      // TODO: Implement proper authentication
      const response = await graphqlClient.mutate({
        mutation: gql`
          mutation LoginUser($email: String!, $password: String!) {
            loginUser(email: $email, password: $password) {
              Username
              FirstName
              LastName
              FullName
              UnassignedSavings
              UnassignedInvestments
              BufferMonths
            }
          },
        `,
        variables: {
          email,
          password,
        },
      });

      commit('setUserInfo', response.data.loginUser);
    },
  },
};
