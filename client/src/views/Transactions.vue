<template>
  <div id="transaction-page">
    <div class="content">
      <TransactionList :transactionList="transactionList"/>
    </div>
    <div class="sidebar">
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TransactionList from '../components/transaction/TransactionList.vue';

export default {
  name: 'Transactions',
  data: () => ({}),
  computed: {
    ...mapState({
      transactionList: (state) => state.transactions.transactionList,
    }),
  },
  mounted() {
    this.fetchTransactionList();
  },
  methods: {
    ...mapActions(['fetchTransactionList']),
  },
  components: {
    TransactionList,
  },
};
</script>
