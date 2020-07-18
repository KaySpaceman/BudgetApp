<template>
    <div id="app">
        <Navigation/>
        <div id="page-content" class="statement-upload-page">
            <div class="page-header">
                <h1 class="page-title">Statement Upload</h1>
            </div>
            <form class="statement-form" action="upload-action" method="POST" encType="multipart/form-data">
                <AccountSelect :accounts="availableAccounts" is-required="true"/>
                <input id="statement-file" class="file-upload-input" type="file" name="statement-file">
                <button class="button button-submit" type="submit">Send</button>
            </form>
            <BankForm :date-formats="dateFormats" v-on:bank-saved="updateAvailableBanks"/>
            <div class="create-account">
                <h2 class="account-new-heading">Create A New Account</h2>
                <AccountForm :available-banks="availableBanks" v-on:account-saved="updateAvailableAccounts"/>
            </div>
        </div>
    </div>
</template>

<script>
  import Navigation from './components/Navigation.vue';
  import BankForm from './components/bank/BankForm.vue';
  import AccountForm from './components/account/AccountForm.vue';
  import AccountSelect from './components/account/AccountSelect.vue';

  export default {
    name: 'StatementUpload',
    data: () => {
      return {
        availableAccounts: [],
        availableBanks: [],
        dateFormats: [],
      };
    },
    methods: {
      updateAvailableBanks: function (data) {
        this.availableBanks.push({
          name: data.Name,
          value: data._id,
        });
      },
      updateAvailableAccounts: function (data) {
        this.availableAccounts.push({
          name: data.Name,
          value: data._id,
        });
      },
    },
    components: {
      AccountSelect,
      AccountForm,
      Navigation,
      BankForm,
    },
  };
</script>
