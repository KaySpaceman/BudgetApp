<template>
  <div class="bank-create-form-wrapper">
    <form class="bank-create-form" @submit="createNewBank">
      <h2 class="bank-new-heading">Create A New Bank</h2>
      <fieldset>
        <legend>Details</legend>
        <label for="bank-name">Name</label>
        <input id=bank-name type="text" name="bank-name" required v-model="bankName">
        <label for="bank-separator">Separator</label>
        <input id=bank-separator type="text" name="bank-separator" required v-model="bankSeparator">
      </fieldset>
      <fieldset>
        <legend>Columns</legend>
        <label for="date-column">Date</label>
        <input id="date-column" type="number" name="date-column" required v-model="dateColumn">
        <DateFormatSelect :date-formats="dateFormats"/>
        <label for="reference-column">Reference</label>
        <input id="reference-column" type="number" name="reference-column" required
               v-model="referenceColumn">
        <fieldset>
          <legend>Amount</legend>
          <label for="amount-is-combined">Combined</label>
          <input id="amount-is-combined" type="checkbox" name="amount-is-combined"
                 v-model="amountIsCombined">
          <span
            class="input-explanation">Are incoming and outgoing amounts shown in one column?</span>
          <fieldset v-if="amountIsCombined">
            <label for="amount-column">Column</label>
            <input id="amount-column" type="number" name="amount-column" required
                   v-model="amountColumn">
          </fieldset>
          <fieldset v-else>
            <label for="incoming-amount-column">Incoming</label>
            <input id="incoming-amount-column" type="number" name="incoming-amount-column" required
                   v-model="incomingAmountColumn">
            <label for="outgoing-amount-column">Outgoing</label>
            <input id="outgoing-amount-column" type="number" name="outgoing-amount-column" required
                   v-model="outgoingAmountColumn">
          </fieldset>
        </fieldset>
      </fieldset>
      <fieldset>
        <legend>Skipped rows</legend>
        <label for="skip-rows">Skip</label>
        <input id="skip-rows" type="checkbox" name="amount-is-combined" v-model="skipRows">
        <span class="input-explanation">Are there rows that don't contain transactions</span>
        <fieldset :disabled="!skipRows" v-if="skipRows">
          <label for="skip-from-top">Top</label>
          <input id=skip-from-top type="number" name="skip-from-top" v-model="skipFromTop">
          <label for="skip-from-bottom">Bottom</label>
          <input id=skip-from-bottom type="number" name="skip-from-bottom" v-model="skipFromBottom">
        </fieldset>
      </fieldset>
      <button class="bank-new-submit button" type="submit">Create</button>
    </form>
  </div>
</template>

<script>
import DateFormatSelect from './DateFormatSelect.vue';

export default {
  name: 'BankForm',
  data: () => ({
    bankName: '',
    bankSeparator: ';',
    dateColumn: null,
    dateFormat: null,
    referenceColumn: null,
    amountIsCombined: true,
    amountColumn: null,
    incomingAmountColumn: null,
    outgoingAmountColumn: null,
    skipRows: true,
    skipFromTop: null,
    skipFromBottom: null,
  }),
  props: {
    dateFormats: [Object, Array],
  },
  methods: {
    createNewBank(e) {
      e.preventDefault();

      // TODO: Replace with Axios
      // $.post('/account/bank/new', this.createBankObject(), (data) => {
      //   this.$emit('bank-saved', data);
      // })
      //   .fail(() => alert('Failed to create a new bank'));
    },
    createBankObject() {
      const bankObject = {
        Name: this.bankName,
        Separator: this.bankSeparator,
        Columns: {
          Date: this.dateColumn,
          DateFormat: this.dateFormat,
          Reference: this.referenceColumn,
          Amount: {},
        },
      };

      if (this.amountIsCombined) {
        bankObject.Columns.Amount.Combined = this.amountColumn;
      } else {
        bankObject.Columns.Amount = {
          Incoming: this.incomingAmountColumn,
          Outgoing: this.outgoingAmountColumn,
        };
      }

      if (this.skipRows) {
        bankObject.Padding = {};

        if (this.skipFromTop) {
          bankObject.Padding.Top = this.skipFromTop;
        }

        if (this.skipFromBottom) {
          bankObject.Padding.Bottom = this.skipFromBottom;
        }
      }

      return bankObject;
    },
  },
  components: {
    DateFormatSelect,
  },
};
</script>
