<template>
  <div class="transaction-form">
    <button-toggle v-model="formData.Type" :options="types" @change="formData.Category = null"/>
    <div class="fields">
      <div class="column">
        <date-field v-model="formData.Date" label="Date" appendIcon wide/>
        <text-field v-model.number="formData.Amount" label="Amount" type="number"
                    :rules="[validateAmount]"/>
        <category-select-field v-model="formData.Category" label="Category"
                               :category-type="categoryType" wide
                               v-if="['SPENDING', 'INCOME'].includes(formData.Type)"/>
      </div>
      <div class="column">
        <select-field v-model="formData.Account" label="Account" text-property="Name"
                      :options="accountsList" value-property="id"
                      v-if="['SPENDING', 'INCOME'].includes(formData.Type)" wide/>
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
import { mapActions, mapMutations, mapState } from 'vuex';
import ButtonToggle from '../inputs/ButtonToggle.vue';
import DateField from '../inputs/DateField.vue';
import TextField from '../inputs/TextField.vue';
import TextareaField from '../inputs/TextareaField.vue';
import CategorySelectField from '../inputs/CategorySelectField.vue';
import Btn from '../inputs/Btn.vue';
import SelectField from '../inputs/SelectField.vue';

export default {
  name: 'TransactionForm',
  data: () => ({
    formData: {},
    showDatePicker: false,
    types: [
      { value: 'SPENDING', text: 'Spending' },
      { value: 'INCOME', text: 'Income' },
      { value: 'SAVINGS', text: 'Savings' },
      { value: 'INVESTMENT', text: 'Investment' },
    ],
  }),
  computed: {
    ...mapState({
      selectedTransaction: (state) => state.transactions.selectedTransaction,
      accountsList: (state) => state.accounts.accountsList,
    }),
    categoryType() {
      return this.formData.Type === 'INCOME' ? 'INCOME' : 'SPENDING';
    },
  },
  watch: {
    selectedTransaction(transaction) {
      this.formData = {
        ...transaction,
        Account: transaction.Account ? transaction.Account.id : null,
        Category: transaction.Category ? transaction.Category.id : null,
        Type: transaction.Type || 'SPENDING',
      };
    },
  },
  methods: {
    ...mapMutations(['selectTransaction']),
    ...mapActions(['fetchAccountList', 'upsertTransaction']),
    validateAmount() {
      const amount = this.formData.Amount;

      return ((!!Number.parseFloat(amount) && amount > 0) || !amount)
        || 'Must be a positive number!';
    },
    submitForm() {
      if (this.validateForm()) {
        this.upsertTransaction(this.formData);
        this.clearForm();
      }
    },
    validateForm() {
      // TODO: Validate data with JOI
      // eslint-disable-next-line object-curly-newline
      const { Date, Type, Note, Account } = this.formData;

      return typeof Date === 'string' && typeof Note === 'string' && this.validateAmount() === true
        && this.types.map((cur) => cur.value).includes(Type)
        && this.accountsList.map((cur) => cur.id).includes(Account);
    },
    clearForm() {
      this.selectTransaction({});
      this.selectedType = 'SPENDING';
    },
  },
  created() {
    if (!this.accountsList || this.accountsList.length === 0) {
      this.fetchAccountList();
    }
  },
  components: {
    ButtonToggle,
    DateField,
    TextField,
    TextareaField,
    SelectField,
    CategorySelectField,
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
      display: flex;
      flex-flow: column;
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
