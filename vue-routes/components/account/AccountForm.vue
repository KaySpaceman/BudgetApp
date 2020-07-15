<template>
    <div class="account-create-form-wrapper">
        <form action="account/new" class="account-create-form" method="POST" @submit="createNewAccount">
            <h2 class="account-new-heading">Create A New Account</h2>
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
        accountName: null,
        accountNumber: null,
        accountBank: null,
      };
    },
    props: {
      availableBanks: [Object, Array],
    },
    methods: {
      createNewAccount: function (e) {
        e.preventDefault();

        $.post('/account/new', this.createAccountObject(), (data) => {
          this.$emit('account-saved', data);
        })
          .fail((res) => alert(`Failed to create a new account. ${res.responseText}`));
      },
      createAccountObject: function () {
        return {
          Name: this.accountName,
          Number: this.accountNumber,
          Bank: this.accountBank,
        };
      },
    },
    components: {
      BankSelect,
    },
  };
</script>
