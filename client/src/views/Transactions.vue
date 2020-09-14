<template>
  <div id="app">
    <div id="page-content" class="transaction-list">
      <div class="page-header">
        <h1 class="page-title">Transactions</h1>
        <div class="controls">
          <button class="button" @click="toggleCreateForm">New</button>
          <button class="button button-submit" type="submit" form="transaction-form">Save</button>
        </div>
      </div>
      <TransactionForm :available-accounts="availableAccounts"
                       :available-categories="flatCategories"
                       v-on:transaction-saved="addTransaction" v-if="showCreateForm"/>
      <form id="transaction-form">
        <fieldset name="categories" class="transaction-table">
          <div class="header">
            <span class="column">Date</span>
            <span class="column wide">Reason</span>
            <span class="column narrow">Type</span>
            <span class="column narrow">Amount</span>
            <span class="column">Category</span>
          </div>
          <Transaction v-for="item in transactions" :key="item.id" :item="item"
                       :flatCategories="flatCategories"/>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script>
import Transaction from '../components/transaction/Transaction.vue';
import TransactionForm from '../components/transaction/TransactionForm.vue';

export default {
  name: 'Transactions',
  data: () => ({
    newCount: Number,
    transactions: Array,
    flatCategories: [Array, Object],
    showCreateForm: false,
  }),
  computed: {
    availableAccounts() {
      // TODO: Create id => Name array of all accounts for select options
      return [];
    },
  },
  methods: {
    toggleCreateForm() {
      this.showCreateForm = !this.showCreateForm;
    },
    addTransaction(transaction) {
      // TODO: Implement once save is improved
      return transaction;
    },
  },
  components: {
    TransactionForm,
    Transaction,
  },
};
</script>
