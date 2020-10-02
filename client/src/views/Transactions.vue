<template>
  <div id="page">
    <div class="content">
      <TransactionList :transactionList="transactionList"/>
    </div>
    <div class="sidebar">
      <TransactionForm></TransactionForm>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TransactionList from '../components/transaction/TransactionList.vue';
import TransactionForm from '../components/transaction/TransactionForm.vue';

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
    TransactionForm,
  },
};
</script>

<style lang="scss" scoped>
#page {
  display: flex;
  flex-direction: row;

  .content {
    flex-basis: 60%;
  }

  .sidebar {
    flex-basis: 40%;
  }
}
</style>
