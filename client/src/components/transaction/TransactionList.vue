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
    <div class="pagination-bar">
      <v-pagination class="pagination" :value="page" @input="changePage" :length="pageCount"
                    total-visible="10" prev-icon="mdi-menu-left" next-icon="mdi-menu-right"/>
      <div class="x-of-x-counter">
        <span>{{ (page - 1) * perPage + 1 }}-{{ page * perPage }} of {{ count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Transaction from './Transaction.vue';

export default {
  name: 'TransactionList',
  data: () => ({}),
  computed: {
    ...mapState({
      transactionList: (state) => state.transactions.transactionList,
      page: (state) => state.transactions.page,
      perPage: (state) => state.transactions.perPage,
      count: (state) => state.transactions.count,
    }),
    pageCount() {
      return Number.parseInt((this.count / this.perPage).toFixed(0), 10);
    },
  },
  methods: {
    ...mapActions(['fetchTransactionList', 'fetchTransactionCount']),
    ...mapMutations(['setTransactionPage', 'setTransactionPerPage', 'invalidateTransactionCache']),
    changePage(page) {
      this.setTransactionPage(page);
      this.fetchTransactionList();
    },
    changePerPage(perPage) {
      this.setTransactionPerPage(perPage);
      this.invalidateTransactionCache();
      this.fetchTransactionList();
      this.fetchTransactionCount();
    },
  },
  created() {
    if (!this.transactionList || this.transactionList.length === 0 || this.count <= 0) {
      this.fetchTransactionList();
      this.fetchTransactionCount();
    }
  },
  components: {
    Transaction,
  },
};
</script>

<style lang="scss">
.transaction-list {
  display: flex;
  flex-direction: column;
  margin: 30px;

  .header {
    background-color: $c-white;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-evenly;
    height: 30px;
    margin-bottom: 1px;

    .column {
      text-align: center;
      text-transform: uppercase;
      color: $c-cadet-blue-crayola;
      flex-basis: 15%;
      font-weight: $fw-bold;
      font-size: 9px;
      line-height: 12px;

      &.wide {
        flex-basis: 30%;
      }
    }
  }

  .pagination-bar {
    background-color: $c-white;
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: nowrap;

    .pagination {
      flex-grow: 1;
    }

    .v-pagination__item,
    .v-pagination__navigation,
    .v-pagination__more {
      box-shadow: none;
      color: $c-cadet-blue-crayola;
      font-weight: $fw-semi-bold;
      font-size: 9px;
      padding: 0;
      margin: 0 5px;
      min-width: auto;
      width: auto;

      .v-icon {
        font-size: 20px;
      }
    }

    .v-pagination__item--active {
      border: none;
      background-color: transparent !important;
      color: $c-cadet-blue-crayola;
      font-weight: $fw-extra-bold;
    }

    .x-of-x-counter {
      align-items: center;
      display: inline-flex;
      list-style-type: none;
      justify-content: center;
      margin-right: 15px;

      > span {
        font-size: 9px;
        font-weight: $fw-semi-bold;
        line-height: 12px;
        color: $c-cadet-blue-crayola;
      }
    }
  }
}
</style>
