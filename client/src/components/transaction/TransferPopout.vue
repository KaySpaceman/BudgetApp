<template>
  <v-menu content-class="transfer-popout" v-on="$listeners" :close-on-content-click="false"
          offset-y>
    <template v-slot:activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs"/>
    </template>
    <div class="transfer-form">
      <select-field v-model="destination" label="Account" text-property="Name"
                    :options="accountsList" value-property="id" no-margin/>
      <toggle-switch v-model="incoming" label="Incoming"/>
      <toggle-switch v-model="createCopy" label="Create Copy"/>
      <div class="controls">
        <btn row @click="submitForm">Save</btn>
      </div>
    </div>
  </v-menu>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ToggleSwitch from '../inputs/ToggleSwitch.vue';
import SelectField from '../inputs/SelectField.vue';
import Btn from '../inputs/Btn.vue';

export default {
  name: 'TransferPopout',
  data: () => ({
    destination: null,
    createCopy: false,
    incoming: false,
  }),
  props: {
    transaction: Object,
  },
  computed: {
    ...mapState({ accountsList: (state) => state.accounts.accountsList }),
    formData() {
      const { Direction, __typename, ...transaction } = this.transaction;
      return {
        transaction: {
          ...transaction,
          Type: 'TRANSFER',
          Account: this.transaction.Account.id,
        },
        destination: this.destination ?? null,
        createCopy: !!this.createCopy,
        direction: this.incoming ? 'INCOMING' : 'OUTGOING',
      };
    },
  },
  methods: {
    ...mapActions(['fetchAccountList', 'createTransferTransaction']),
    submitForm() {
      if (this.validateForm()) {
        this.createTransferTransaction(this.formData);
      }
    },
    validateForm() {
      const { destination, createCopy } = this.formData;

      return typeof destination === 'string' && typeof createCopy === 'boolean'
        && this.accountsList.map((cur) => cur.id).includes(destination);
    },
  },
  created() {
    if (!this.accountsList || this.accountsList.length === 0) {
      this.fetchAccountList();
    }
  },
  components: {
    SelectField,
    ToggleSwitch,
    Btn,
  },
};
</script>

<style lang="scss">
.transfer-popout {
  contain: none;
  overflow: visible;

  .transfer-form {
    background: $c-white;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    padding: 10px;

    .controls {
      margin: auto;
    }
  }
}
</style>
