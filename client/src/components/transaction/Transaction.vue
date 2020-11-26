<template>
  <div class="transaction" :class="{
    'highlighted': !transaction.Category && !['TRANSFER', 'SAVINGS'].includes(transaction.Type)}"
  >
    <span class="column wide font-small" v-text="transaction.Note"/>
    <span class="column" v-text="formattedDate"/>
    <span class="column font-bold" :class="{ 'income': transaction.Type === 'INCOME' }">
      EUR {{ transaction.Direction === 'INCOMING' ? '+' : '-' }} {{ transaction.Amount }}
    </span>
    <span class="column" v-text="(
        (transaction.Category && transaction.Category.Name)
        || (transaction.Type === 'TRANSFER' && 'Transfer')
        || (transaction.Type === 'SAVINGS' && 'Savings')
      ) || ''"/>
    <span class="column">
      <img class="icon" src="@/assets/Delete.svg" alt="delete"
           @click="deleteTransaction(transaction.id)"/>
      <transfer-popout :transaction="transaction" v-slot="slot">
        <img class="icon" src="@/assets/Transfer.svg" alt="transfer" v-on="slot.on"/>
      </transfer-popout>
      <img class="icon" src="@/assets/ToEdit.svg" alt="edit"
           @click="selectTransaction(transaction)"/>
    </span>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { DateTime } from 'luxon';
import TransferPopout from './TransferPopout.vue';

export default {
  name: 'Transaction',
  data: () => ({}),
  props: {
    transaction: Object,
  },
  methods: {
    ...mapMutations(['selectTransaction']),
    ...mapActions(['deleteTransaction']),
  },
  computed: {
    formattedDate() {
      return DateTime.fromISO(this.transaction.Date)
        .toLocaleString(DateTime.DATE_SHORT);
    },
  },
  components: {
    TransferPopout,
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

  &.highlighted {
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
      margin: 0 5px;

      &:hover {
        filter: brightness(0%);
        cursor: pointer;
      }
    }
  }
}
</style>
