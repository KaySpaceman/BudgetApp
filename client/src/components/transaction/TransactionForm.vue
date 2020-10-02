<template>
  <div class="transaction-form" data-app>
    <button-toggle :options="types" v-model="selectedType"/>
    <div class="fields">
      <div class="column">
        <v-menu v-model="showDatePicker" :close-on-content-click="false"
                transition="scale-transition" offset-y min-width="290px">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field label="Date" class="wide" :value="formattedDate" readonly v-on="on"
                          :attrs="attrs" append-icon="mdi-calendar" placeholder=" "/>
          </template>
          <v-date-picker v-model="formData.Date" @input="showDatePicker = false" no-title/>
        </v-menu>
        <v-text-field label="Amount" v-model="formData.Amount" placeholder=" "
                      :rules="[
                          () => ((!!Number.parseFloat(formData.Amount) && formData.Amount > 0)
                                || !this.formData.Amount) || 'Must be a positive number!',
                      ]"
        />
        <v-select label="Category" v-model="transactionCategory" :items="spendingCategories"
                  placeholder=" " dense/>
      </div>
      <div class="column">
        <v-textarea label="Reason" class="wide fill-height" v-model="formData.Note" placeholder=" "
                    no-resize/>
      </div>
    </div>
    <div class="controls">
      <v-btn class="button primary save" depressed @click="submitForm">Save</v-btn>
      <v-btn class="button clear" outlined depressed @click="clearForm">Clear</v-btn>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { DateTime } from 'luxon';
import ButtonToggle from '../inputs/ButtonToggle.vue';

export default {
  name: 'TransactionForm',
  data: () => ({
    showDatePicker: false,
    spendingCategories: [
      { text: 'One', value: 1 },
      { text: 'Two', value: 2 },
      { text: 'Three', value: 3 },
      { text: 'Four', value: 4 },
    ],
    types: [
      { value: 'SPENDING', text: 'Spending' },
      { value: 'INCOME', text: 'Income' },
      { value: 'SAVINGS', text: 'Savings' },
      { value: 'INVESTMENT', text: 'Investment' },
    ],
    selectedType: 'SPENDING',
  }),
  computed: {
    ...mapState({
      selectedTransaction: (state) => state.transactions.selectedTransaction,
    }),
    formData() {
      return {
        Date: this.selectedTransaction.Date,
        Note: this.selectedTransaction.Note,
        Amount: this.selectedTransaction.Amount ? Math.abs(this.selectedTransaction.Amount) : '',
        Category: this.selectedTransaction.Category,
      };
    },
    transactionCategory: {
      get() {
        return this.formData.Category ? this.formData.Category.id : null;
      },
      set(newId) {
        this.formData.Category.id = newId;
      },
    },
    formattedDate: {
      cache: false,
      get() {
        if (!this.formData.Date) {
          return '';
        }

        return DateTime.fromISO(this.formData.Date)
          .toLocaleString(DateTime.DATE_SHORT);
      },
    },
  },
  methods: {
    ...mapMutations(['selectTransaction']),
    submitForm() {
      // TODO: Submit data and add now transaction to list
    },
    clearForm() {
      this.selectTransaction({});
      this.type = 'SPENDING';
    },
  },
  components: {
    ButtonToggle,
  },
};
</script>

<style lang="scss">
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

  .v-input {
    width: 80px;
    height: 40px;
    margin-bottom: 15px;
    margin-top: 0;
    padding-top: 14px;

    &:last-of-type {
      margin-bottom: 0;
    }

    input,
    textarea {
      height: 25px;
    }

    &.wide {
      width: 125px;
    }

    &.fill-height {
      height: 100%;

      input,
      textarea,
      .v-input__control,
      .v-input__slot,
      .v-text-field__slot {
        height: 100%;
      }
    }

    &.error--text {
      .v-input__slot {
        border-color: $c-red-pigment;
        border-width: 2px;
      }
    }

    .v-input__slot {
      border: 1px solid $c-cadet-blue-crayola;
      box-sizing: border-box;
      border-radius: 2px;
      margin: 0;

      &:before,
      &:after {
        display: none;
      }

      & > div {
        .v-label {
          color: $c-cadet-blue-crayola;
          font-family: $f-open-sans;
          font-weight: $fw-bold;
          font-size: 12px;
          line-height: 12px;
          text-transform: uppercase;
          margin-left: -7px;
          top: 1px
        }

        input,
        textarea,
        .v-select__selection {
          color: $c-cadet-blue-crayola;
          font-family: $f-open-sans;
          font-weight: $fw-bold;
          font-size: 12px;
          line-height: 12px;
          padding: 5px;
          margin: auto;
        }
      }
    }

    .v-input__control {
      .v-messages {
        display: none;
      }
    }

    .v-input__icon {
      height: 16px;
      min-width: 16px;
      width: 20px;

      > .v-icon {
        color: $c-cadet-blue-crayola;
        font-size: 16px;
      }
    }
  }

  .controls {
    display: flex;

    .button.v-btn {
      height: 25px;
      margin: auto 10px;
      flex-grow: 1;

      &:first-of-type {
        margin-left: 0;
      }

      &:last-of-type {
        margin-right: 0;
      }

      &.primary {
        background-color: $c-dodger-blue;
        color: $c-white;
      }

      &.clear {
        background-color: transparent;
        color: $c-cadet-blue-crayola;
      }

      .v-btn__content {
        font-family: $f-open-sans;
        font-weight: $fw-bold;
        font-size: 10px;
        line-height: 10px;
      }
    }
  }
}
</style>
