<template>
  <div id="page">
    <div class="content">
      <TransactionList/>
    </div>
    <div class="sidebar">
      <TransactionForm/>
      <StatementUpload/>
      <CategoryForm/>
    </div>
  </div>
</template>

<script>
import TransactionList from '../components/transaction/TransactionList.vue';
import TransactionForm from '../components/transaction/TransactionForm.vue';
import StatementUpload from '../components/transaction/StatementUpload.vue';
import CategoryForm from '../components/category/CategoryForm.vue';

export default {
  name: 'Transactions',
  data: () => ({}),
  components: {
    CategoryForm,
    StatementUpload,
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
    flex-grow: 1;
  }

  .sidebar {
    padding-right: 30px;
  }
}
</style>
