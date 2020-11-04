<template>
  <div class="account-create-edit-form-wrapper">
    <form class="account-create-edit-form" @submit="submitForm">
      <input type="hidden" :value="accountId"/>
      <label for="account-name">Name</label>
      <input id=account-name type="text" name="account-name" required v-model="accountName">
      <label for="account-number">Number</label>
      <input id=account-number type="text" name="account-number" v-model="accountNumber">
      <BankSelect :banks="availableBanks" v-model="accountBank"/>
      <span class="warning" v-if="!accountBank">
        Only manual entry is supported for accounts without a selected bank!
      </span>
      <button class="account-new-submit button" type="submit">Create</button>
    </form>
  </div>
</template>

<script>
import BankSelect from '../bank/BankSelect.vue';

export default {
  name: 'AccountForm',
  data: () => ({
    accountId: null,
    accountName: null,
    accountNumber: null,
    accountBank: null,
  }),
  props: {
    availableBanks: [Object, Array],
    existingAccount: [Object, Array],
  },
  computed: {
    account() {
      const account = {
        _id: this.accountId,
        Name: this.accountName,
        Number: this.accountNumber,
        Bank: this.accountBank,
      };

      Object.keys(account)
        .forEach((key) => (account[key] == null || account[key] === '') && delete account[key]);

      return account;
    },
  },
  watch: {
    existingAccount() {
      this.preFillForm();
    },
  },
  mounted() {
    this.availableBanks.unshift({
      value: null,
      name: 'None',
    });
    this.preFillForm();
  },
  methods: {
    preFillForm() {
      if (this.existingAccount) {
        this.accountId = this.existingAccount.id;
        this.accountName = this.existingAccount.Name;
        this.accountNumber = this.existingAccount.Number;
        this.accountBank = this.existingAccount.Bank;
      }
    },
    submitForm(e) {
      e.preventDefault();

      // TODO: Replace with Axios
      // $.post('/account/new-edit', this.account, (data) => {
      //   this.$emit('account-saved', data);
      // })
      //   .fail((res) => alert(`Failed to create a new account. ${res.responseText}`));
    },
  },
  components: {
    BankSelect,
  },
};
</script>
