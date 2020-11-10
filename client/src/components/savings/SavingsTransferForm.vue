<template>
  <div class="savings-transfer-form">
    <div class="fields">
      <div class="column">
        <select-field v-model="formData.Account" label="Account" text-property="Name"
                      :options="accountsList" value-property="id" wide/>
        <text-field v-model.number="formData.Amount" label="Amount" type="number"
                    :rules="[validateAmount]"/>
      </div>
      <div class="column">
        <select-field v-model="formData.Type" label="Type" :options="types" wide/>
        <div class="balances">
          <span class="balance">Available: {{ selectedAccount.Available }}</span>
          <span class="balance">In Savings: {{ selectedAccount.Savings }}</span>
        </div>
      </div>
    </div>
    <div class="controls">
      <btn row @click="submitForm">Save</btn>
      <btn row clear outlined @click="clearForm">Clear</btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import TextField from '../inputs/TextField.vue';
import Btn from '../inputs/Btn.vue';
import SelectField from '../inputs/SelectField.vue';

export default {
  name: 'SavingsTransferForm',
  data: () => ({
    formData: {
      Account: '',
      Amount: 0,
      Type: 'OUTGOING',
    },
    types: [
      { value: 'OUTGOING', text: 'Withdrawal' },
      { value: 'INCOMING', text: 'Deposit' },
    ],
  }),
  computed: {
    ...mapState({ accountsList: (state) => state.accounts.accountsList }),
    selectedAccount() {
      return this.accountsList.filter((acc) => acc.id === this.formData.Account)[0] || {};
    },
  },
  methods: {
    ...mapActions(['fetchAccountList']),
    submitForm() {
      if (this.validateForm()) {
        // TODO: Submit
      }
    },
    validateAmount() {
      const { Amount, Type } = this.formData;
      const { Available, Savings } = this.selectedAccount;

      return !!Number.parseFloat(Amount) && Amount > 0
        && ((Type === 'OUTGOING' && Amount <= Savings)
          || (Type === 'INCOMING' && Amount <= Available)
          || this.selectedAccount === {}
        );
    },
    validateForm() {
      return this.formData !== {} && this.validateAmount()
        && this.accountsList.map((cur) => cur.id).includes(this.formData.Account);
    },
    clearForm() {
      this.formData = {
        Account: '',
        Amount: 0,
        Type: 'OUTGOING',
      };
    },
  },
  created() {
    if (!this.accountsList || this.accountsList.length === 0) {
      this.fetchAccountList();
    }
  },
  components: {
    SelectField,
    TextField,
    Btn,
  },
};
</script>

<style lang="scss" scoped>
.savings-transfer-form {
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

      &.row {
        flex-flow: row;
      }

      &:first-of-type {
        margin-right: 10px;
      }

      &:last-of-type {
        margin-left: 10px;
      }

      .balance {
        display: block;
        margin: 5px;
        color: $c-cadet-blue-crayola;
        font-weight: $fw-bold;
        font-size: 12px;
        line-height: 12px;
        text-transform: uppercase;
      }
    }
  }

  .controls {
    display: flex;
  }
}
</style>
