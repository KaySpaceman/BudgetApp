<template>
  <div class="transaction" :class="{ 'un-categorized': !transaction.Category }">
    <span class="column wide" v-text="transaction.Note"/>
    <span class="column" v-text="transaction.Date"/>
    <span class="column narrow" v-text="transaction.Amount"/>
    <span class="column narrow" v-text="(transaction.Category && transaction.Category.Name) || ''"/>
  </div>
</template>

<script>
export default {
  name: 'Transaction',
  data: () => ({}),
  props: {
    transaction: Object,
  },
};
</script>
