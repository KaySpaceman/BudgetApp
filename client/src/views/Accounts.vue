<template>
  <div id="app">
    <div id="page-content" class="account-list-page">
      <div class="page-header">
        <h1 class="page-title">Accounts</h1>
      </div>
      <span>Net Total</span>
      <span class="total" v-text="netTotal"/>
      <div id="account-list">
        <Account v-for="(account, index) in accounts" :key="account._id" :account="account"
                 :account-index="index" v-on:edit-account="updateEditForm"/>
      </div>
      <AccountForm :available-banks="availableBanks" :existing-account="editAccount"
                   v-on:account-saved="addAccount" v-if="editAccountIndex"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Account from '../components/account/Account.vue';
import AccountForm from '../components/account/AccountForm.vue';

export default {
  name: 'Accounts',
  data: () => ({
    availableBanks: [],
    editAccountIndex: null,
    editAccount: [],
  }),
  computed: {
    ...mapState({}),
    netTotal() {
      return Object.values(this.totals)
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2);
    },
  },
  methods: {
    updateEditForm(newIndex) {
      this.editAccountIndex = newIndex;
      this.editAccount = this.accounts[newIndex];
    },
    addAccount(data) {
      this.accounts[this.editAccountIndex] = data;
      this.updateEditForm(this.editAccountIndex);
    },
  },
  components: {
    Account,
    AccountForm,
  },
};
</script>
