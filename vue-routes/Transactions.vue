<template>
    <div id="app">
        <Navigation/>
        <div id="page-content" class="transaction-list">
            <div class="page-header">
                <h1 class="page-title">Transactions</h1>
                <div class="controls">
                    <button class="button button-submit" type="submit" form="transaction-form">Save</button>
                </div>
            </div>
            <form id="transaction-form" action="/transactions/categorize" method="POST" encType="multipart/form-data">
                <fieldset name="categories" class="transaction-table">
                    <div class="header">
                        <span class="column">Date</span>
                        <span class="column wide">Reason</span>
                        <span class="column narrow">Type</span>
                        <span class="column narrow">Amount</span>
                        <span class="column">Category</span>
                    </div>
                    <Transaction v-for="item in transactions" :key="item.IdString" :item="item"
                                 :flatCategories="flatCategories"/>
                </fieldset>
            </form>
        </div>
    </div>
</template>

<script>
  import Transaction from './components/transaction/Transaction.vue';
  import Navigation from './components/Navigation.vue';

  export default {
    name: 'Transactions',
    data: () => {
      return {
        newCount: Number,
        transactions: Array,
        flatCategories: [Array, Object],
      };
    },
    components: {
      Navigation,
      Transaction,
    },
  };
</script>
