<template>
  <div class="transaction" :class="{ 'un-categorized': !transaction.Category }">
    <span class="column wide font-small" v-text="transaction.Note"/>
    <span class="column" v-text="formattedDate"/>
    <span class="column font-bold" :class="{ 'income': transaction.Type === 'INCOME' }">
      EUR {{transaction.Amount}}
    </span>
    <span class="column" v-text="(transaction.Category && transaction.Category.Name) || ''"/>
    <span class="column">
      <img class="icon" src="@/assets/Delete.svg" alt="delete"/>
      <img class="icon" src="@/assets/ToEdit.svg" alt="edit"
           @click="selectTransaction(transaction)"/>
    </span>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { DateTime } from 'luxon';

export default {
  name: 'Transaction',
  data: () => ({}),
  props: {
    transaction: Object,
  },
  methods: {
    ...mapMutations(['selectTransaction']),
  },
  computed: {
    formattedDate() {
      return DateTime.fromISO(this.transaction.Date)
        .toLocaleString(DateTime.DATE_SHORT);
    },
  },
};
</script>

<style lang="scss" scoped>
 .transaction {
   background-color: $c-white;
   display: flex;
   flex-direction: row;
   flex-wrap: nowrap;
   align-items: center;
   justify-content: space-evenly;
   min-height: 30px;
   margin-bottom: 1px;
   width: 100%;
   padding: 5px 10px;

   &.un-categorized {
     border-left: 2px solid $c-dodger-blue;
   }

   .column {
     text-align: center;
     color: $c-cadet-blue-crayola;
     flex-basis: 15%;
     font-weight: $fw-bold;
     font-size: 10px;
     line-height: 14px;

     &.wide {
       flex-basis: 30%;
     }

     &.font-small {
       font-weight: $fw-semi-bold;
       font-size: 9px;
       line-height: 12px;
     }

     &.font-bold {
       font-weight: $fw-bold;
       font-size: 12px;
       line-height: 16px;
     }

     &.income {
       color: $c-sheen-green;
     }

     .icon {
       height: 15px;
       margin: 0 10px;

       &:hover {
         filter: brightness(0%);
         cursor: pointer;
       }
     }
   }
 }
</style>
