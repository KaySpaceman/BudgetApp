import gql from 'graphql-tag';
import { getClient } from '../../vue-apollo.js';

const graphqlClient = getClient();

export default {
  state: () => ({
    vaultList: [],
    storedSavings: 0,
    savingsGoal: 0,
    selectedVault: {},
  }),
  mutations: {
    setVaultList(state, vaultList) {
      state.vaultList = vaultList;
    },
    refreshStats(state) {
      let goal = 0;
      let stored = 0;

      state.vaultList.forEach((vault) => {
        stored += vault.Balance;
        goal += vault.Goal;
      });

      state.storedSavings = stored;
      state.savingsGoal = goal;
    },
    addVaultToList(state, vault) {
      const existingIndex = state.vaultList.findIndex((v) => v.id === vault.id);

      if (existingIndex < 0) {
        state.vaultList.push(vault);
      } else {
        state.vaultList.splice(existingIndex, 1, vault);
      }
    },
    removeVault(state, id) {
      const deleteIndex = state.vaultList.findIndex((v) => v.id === id);

      if (deleteIndex >= 0) {
        state.vaultList.splice(deleteIndex, 1);
      }
    },
    selectVault(state, vault) {
      state.selectedVault = vault;
    },
  },
  actions: {
    async fetchVaultList({ commit }) {
      const response = await graphqlClient.query({
        query: gql`
          query VaultList {
            vaults(onlyTopLevel: true) {
              id
              Name
              Goal
              Balance
              Color
              IsBuffer
              Parent {
                id
              }
              Children {
                id
                Name
                Goal
                Balance
              }
            }
          },
        `,
      });

      commit('setVaultList', response.data.vaults);
      commit('refreshStats');
    },
    async upsertVault({ commit }, formData) {
      // eslint-disable-next-line no-param-reassign
      delete formData.__typename;

      const response = await graphqlClient.mutate({
        mutation: gql`
          mutation UpsertVault($formData: VaultInput!) {
            upsertVault(vault: $formData) {
              id
              Name
              Goal
              Balance
              Color
              IsBuffer
              Parent {
                id
              }
              Children {
                id
                Name
                Goal
                Balance
              }
            }
          },
        `,
        variables: {
          formData,
        },
      });

      commit('addVaultToList', response.data.upsertVault);
      commit('refreshStats');
    },
    async createVaultTransfer({ commit, dispatch }, { id, amount, direction }) {
      const response = await graphqlClient.mutate({
        mutation: gql`
          mutation CreateVaultTransfer($id: ID!, $amount: Float!, $direction: TransferDirection!) {
            createVaultTransfer(id: $id, amount: $amount, direction: $direction) {
              id
              Name
              Goal
              Balance
              Color
              IsBuffer
              Parent {
                id
              }
              Children {
                id
                Name
                Goal
                Balance
              }
            }
          },
        `,
        variables: {
          id,
          amount,
          direction,
        },
      });

      dispatch('fetchUnassignedSavings');
      commit('addVaultToList', response.data.createVaultTransfer);
      commit('refreshStats');
    },
    async deleteVault({ commit, dispatch }, id) {
      const response = await graphqlClient.mutate({
        mutation: gql`
          mutation DeleteVault($id: ID!) {
            deleteVault(vaultId: $id)
          }
        `,
        variables: {
          id,
        },
      });

      if (response.data.deleteVault) {
        commit('removeVault', id);
        commit('refreshStats');
        dispatch('fetchUnassignedSavings');
      }
    },
  },
};
