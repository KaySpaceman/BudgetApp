<template>
  <div class="transaction-form" data-app>
    <button-toggle v-model="selectedType" :options="types"/>
    <div class="fields">
      <div class="column">
        <date-field v-model="formData.Date" label="Date" appendIcon wide/>
        <text-field v-model="formData.Amount" label="Amount" :rules="[validateAmount]"/>
        <select-field v-model="formData.Category" label="Category" :options="spendingCategories"/>
      </div>
      <div class="column">
        <textarea-field v-model="formData.Note" label="Reason" fill-height wide/>
      </div>
    </div>
    <div class="controls">
      <btn row @click="submitForm">Save</btn>
      <btn row clear outlined @click="clearForm">Clear</btn>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import ButtonToggle from '../inputs/ButtonToggle.vue';
import DateField from '../inputs/DateField.vue';
import TextField from '../inputs/TextField.vue';
import TextareaField from '../inputs/TextareaField.vue';
import SelectField from '../inputs/SelectField.vue';
import Btn from '../inputs/Btn.vue';

export default {
  name: 'TransactionForm',
  data: () => ({
    showDatePicker: false,
    spendingCategories: [
      { text: 'One', value: 'o' },
      { text: 'Two', value: 'tw' },
      { text: 'Three', value: 'th' },
      { text: 'Four', value: 'f' },
    ],
    types: [
      { value: 'SPENDING', text: 'Spending' },
      { value: 'INCOME', text: 'Income' },
      { value: 'SAVINGS', text: 'Savings' },
      { value: 'INVESTMENT', text: 'Investment' },
    ],
    selectedType: 'SPENDING',
    formData: {},
  }),
  computed: {
    ...mapState({
      selectedTransaction: (state) => state.transactions.selectedTransaction,
    }),
    transactionCategory: {
      // TODO: Change once category select is implemented
      get() {
        return this.formData.Category ? this.formData.Category.id : null;
      },
      set(newId) {
        this.formData.Category.id = newId;
      },
    },
  },
  watch: {
    selectedTransaction(transaction) {
      this.formData = { ...transaction };
    },
  },
  methods: {
    ...mapMutations(['selectTransaction']),
    validateAmount() {
      return (
        (!!Number.parseFloat(this.formData.Amount) && this.formData.Amount > 0)
        || !this.formData.Amount)
        || 'Must be a positive number!';
    },
    submitForm() {
      // TODO: Submit data and add now transaction to list
    },
    clearForm() {
      this.selectTransaction({});
      this.selectedType = 'SPENDING';
    },
  },
  components: {
    ButtonToggle,
    DateField,
    TextField,
    TextareaField,
    SelectField,
    Btn,
  },
};
</script>

<style lang="scss" scoped>
.transaction-form {
  background: $c-white;
  border-radius: 4px;
  display: flex;
  flex-flow: column;
  max-width: 310px;
  margin: 30px 0;
  padding: 15px 20px;

  .fields {
    display: flex;
    flex-direction: row;
    margin: auto auto 15px;

    .column {
      flex-basis: 50%;

      &:first-of-type {
        margin-right: 10px;
      }

      &:last-of-type {
        margin-left: 10px;
      }
    }
  }

  .controls {
    display: flex;
  }
}
</style>
