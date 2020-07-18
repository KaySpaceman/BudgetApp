<template>
    <div class="account-create-edit-form-wrapper">
        <form action="account/new-edit" class="account-create-edit-form" method="POST" @submit="submitForm">
            <input type="hidden" :value="accountId"/>
            <label for="account-name">Name</label>
            <input id=account-name type="text" name="account-name" required v-model="accountName">
            <label for="account-number">Number</label>
            <input id=account-number type="text" name="account-number" v-model="accountNumber">
            <BankSelect :banks="availableBanks" v-model="accountBank"/>
            <span class="warning" v-if="!accountBank">Only manual entry is supported for accounts without a selected bank!</span>
            <button class="account-new-submit button" type="submit">Create</button>
        </form>
    </div>
</template>

<script>
  import BankSelect from '../bank/BankSelect.vue';

  export default {
    name: 'AccountForm',
    data: () => {
      return {
        accountId: null,
        accountName: null,
        accountNumber: null,
        accountBank: null,
      };
    },
    props: {
      availableBanks: [Object, Array],
      existingAccount: [Object, Array],
    },
    computed: {
      account: function () {
        return {
          _id: this.accountId,
          Name: this.accountName,
          Number: this.accountNumber,
          Bank: this.accountBank,
        };
      },
    },
    watch: {
      existingAccount: function () {
        this.preFillForm();
      },
    },
    mounted: function () {
      this.preFillForm();
    },
    methods: {
      preFillForm: function () {
        if (this.existingAccount) {
          this.accountId = this.existingAccount._id;
          this.accountName = this.existingAccount.Name;
          this.accountNumber = this.existingAccount.Number;
          this.accountBank = this.existingAccount.Bank;
        }
      },
      submitForm: function (e) {
        e.preventDefault();

        $.post('/account/new-edit', this.account, (data) => {
          this.$emit('account-saved', data);
        })
          .fail((res) => alert(`Failed to create a new account. ${res.responseText}`));
      },
    },
    components: {
      BankSelect,
    },
  };
</script>
