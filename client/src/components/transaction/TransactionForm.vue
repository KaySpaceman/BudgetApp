<template>
  <div class="transaction-create-form-wrapper">
    <form @submit="submitForm">
      <AccountSelect :accounts="availableAccounts" :is-required="true"
                     v-model="transactionAccount"/>
      <label for="transaction-date">Date</label>
      <input id="transaction-date" type="date" name="date" required v-model="transactionDate"/>
      <label for="transaction-direction">Direction</label>
      <select id="transaction-direction" name="direction" required v-model="transactionDirection">
        <option value="OUT">OUT</option>
        <option value="IN">IN</option>
      </select>
      <label for="transaction-amount">Amount</label>
      <input id=transaction-amount type="number" step="0.01" name="amount" required
             v-model="transactionAmount">
      <label for="transaction-note">Note</label>
      <input id=transaction-note type="text" name="note" required v-model="transactionNote">
      <CategorySelect :categories="availableCategories" :onlyLastLevel="true" :label="'Category'"
                      v-model="transactionCategory"/>
      <button class="transaction-new-submit button" type="submit">Create</button>
    </form>
  </div>
</template>

<script>
import AccountSelect from '../account/AccountSelect.vue';
import CategorySelect from '../category/CategorySelect.vue';

export default {
  name: 'TransactionForm',
  data: () => ({
    transactionAccount: null,
    transactionDate: null,
    transactionDirection: null,
    transactionAmount: null,
    transactionNote: null,
    transactionCategory: null,
  }),
  props: {
    availableAccounts: [Array, Object],
    availableCategories: [Array, Object],
  },
  computed: {
    transaction() {
      return {
        Date: this.transactionDate,
        Direction: this.transactionDirection,
        Note: this.transactionNote,
        Amount: this.transactionAmount,
        Category: this.transactionCategory,
        Account: this.transactionAccount,
      };
    },
  },
  mounted() {
    this.preFillForm();
  },
  methods: {
    preFillForm() {
      // eslint-disable-next-line prefer-destructuring
      this.transactionDate = new Date().toISOString()
        .split('T')[0];
      this.transactionDirection = 'OUT';
      this.transactionAccount = this.availableAccounts[0].value;
    },
    submitForm(e) {
      e.preventDefault();

      // TODO: Replace with Axios
      // $.post('/transactions/new', this.transaction, (data) => {
      //   this.$emit('transaction-saved', data);
      // })
      //   .fail((res) => alert(`Failed to create a new transaction. ${res.responseText}`));
    },
  },
  components: {
    CategorySelect,
    AccountSelect,
  },
};
</script>
