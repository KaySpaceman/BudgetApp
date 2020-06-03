<template>
    <div class="transaction-list">
        <form action="/transactions/categorize" method="POST" encType="multipart/form-data">
            <div class="controls">
                <button class="button button-large" type="submit">Save</button>
            </div>
            <fieldset name="categories" class="transaction-table">
                <div class="header">
                    <span>Date</span>
                    <span>Reason</span>
                    <span>Type</span>
                    <span>Amount</span>
                    <span>Category</span>
                </div>
                <Transaction v-for="item in transactions" :key="item.IdString" :item="item"
                             :flatCategories="flatCategories"/>
            </fieldset>
        </form>
    </div>
</template>

<script>
  import Transaction from './components/transaction/Transaction.vue';

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
      Transaction,
    },
  };
</script>
