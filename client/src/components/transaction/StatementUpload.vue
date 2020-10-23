<template>
  <div class="statement-upload">
    <div class="fields">
      <div class="column">
        <file-upload v-model="statementFile" label="Statement" accept=".csv" wide/>
      </div>
      <div class="column">
        <select-field v-model="account" label="Account" text-property="Name" :options="accountsList"
                      value-property="id" wide/>
      </div>
    </div>
    <div class="controls">
      <btn row @click="uploadStatement">Upload</btn>
      <btn row clear outlined @click="clearForm">Clear</btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import axios from 'axios';
import Btn from '../inputs/Btn.vue';
import SelectField from '../inputs/SelectField.vue';
import FileUpload from '../inputs/FileUpload.vue';

export default {
  name: 'StatementUpload',
  data: () => ({
    account: null,
    statementFile: null,
  }),
  computed: {
    ...mapState({ accountsList: (state) => state.accounts.accountsList }),
  },
  methods: {
    ...mapActions(['fetchAccountList', 'fetchTransactionList']),
    ...mapMutations(['invalidateTransactionCache', 'setTransactionPage']),
    uploadStatement() {
      if (!this.validateForm()) {
        return;
      }

      const { href } = window.location;
      const baseURL = `${href.substring(0, href.lastIndexOf(':'))}:4000`;
      const formData = new FormData();

      formData.append('statementFile', this.statementFile);
      formData.append('account', this.account);

      axios.post('/upload', formData, { baseURL })
        .then((res) => {
          this.clearForm();
          this.invalidateTransactionCache();
          this.setTransactionPage(1);
          this.fetchTransactionList();

          console.log(`New transaction count: ${res.data.newCount || 0}`);
        })
        .catch((err) => {
          console.log(`Upload error: ${err}`);
        });
    },
    validateForm() {
      return !!this.statementFile && typeof this.account === 'string';
    },
    clearForm() {
      this.account = null;
      this.statementFile = null;
    },
  },
  created() {
    if (!this.accountsList || this.accountsList.length === 0) {
      this.fetchAccountList();
    }
  },
  components: {
    FileUpload,
    SelectField,
    Btn,
  },
};
</script>

<style lang="scss" scoped>
.statement-upload {
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
