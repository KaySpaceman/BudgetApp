<template>
  <div class="transaction-list">
    <div class="header">
      <span class="column wide">Reason</span>
      <span class="column">Date</span>
      <span class="column">Amount</span>
      <span class="column">Category</span>
      <span class="column">Actions</span>
    </div>
    <Transaction v-for="transaction in transactionList" :transaction="transaction"
                 :key="transaction.id"/>
    <div class="pagination">
      <h2>Soon</h2>
    </div>
  </div>
</template>

<script>
import Transaction from './Transaction.vue';

export default {
  name: 'TransactionList',
  data: () => ({}),
  props: {
    transactionList: Array,
  },
  components: {
    Transaction,
  },
};
</script>
