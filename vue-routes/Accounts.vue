<template>
    <div id="app">
        <Navigation/>
        <div id="page-content" class="account-list-page">
            <div class="page-header">
                <h1 class="page-title">Accounts</h1>
            </div>
            <div id="account-list">
                <Account v-for="(account, index) in accounts" :account="account" :account-index="index"
                         v-on:edit-account="updateEditForm"/>
            </div>
            <AccountForm :available-banks="availableBanks" :existing-account="editAccount"
                         v-on:account-saved="addAccount"/>
        </div>
    </div>
</template>

<script>
  import Navigation from './components/Navigation.vue';
  import Account from './components/account/Account.vue';
  import AccountForm from './components/account/AccountForm.vue';

  export default {
    name: 'Accounts',
    data: () => {
      return {
        accounts: [],
        availableBanks: [],
        editAccountIndex: null,
        editAccount: [],
      };
    },
    methods: {
      updateEditForm: function (newIndex) {
        this.editAccountIndex = newIndex;
        this.editAccount = this.accounts[newIndex];
      },
      addAccount: function (data) {
        this.accounts[this.editAccountIndex] = data;
        this.updateEditForm(this.editAccountIndex);
      },
    },
    components: {
      Navigation,
      Account,
      AccountForm,
    },
  };
</script>
