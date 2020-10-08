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
import { mapActions, mapState } from 'vuex';
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
    ...mapActions(['fetchAccountList']),
    uploadStatement() {
      // TODO: Upload statement
    },
    validateForm() {
      // TODO: Validate
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
