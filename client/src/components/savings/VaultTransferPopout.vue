<template>
  <v-menu class="vault-transfer-popout" v-on="$listeners" v-model="isOpen"
          :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs"/>
    </template>
    <div class="transfer-form">
      <text-field v-model.number="amount" type="number" label="Amount" :rules="[validateAmount]"
                  no-margin/>
      <div class="controls">
        <btn row @click="submitForm">{{ this.withdrawal ? 'Withdraw' : 'Fund' }}</btn>
      </div>
    </div>
  </v-menu>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Btn from '../inputs/Btn.vue';
import TextField from '../inputs/TextField.vue';

export default {
  name: 'VaultTransferPopout',
  data: () => ({
    amount: 0,
    isOpen: false,
  }),
  props: {
    id: String,
    balance: Number,
    withdrawal: Boolean,
  },
  computed: {
    ...mapState({ unassignedSavings: (state) => state.users.UnassignedSavings }),
    formData() {
      return {
        id: this.id,
        amount: this.amount,
        direction: this.withdrawal ? 'OUTGOING' : 'INCOMING',
      };
    },
  },
  methods: {
    ...mapActions(['createVaultTransfer']),
    submitForm() {
      if (this.validateForm()) {
        this.createVaultTransfer({ formData: this.formData, selectResult: true });
        this.amount = 0;
        this.isOpen = false;
      }
    },
    validateAmount() {
      return !!Number.parseFloat(this.amount) && this.amount > 0
      && (this.withdrawal ? this.amount <= this.balance : this.amount <= this.unassignedSavings);
    },
    validateForm() {
      return this.id && this.validateAmount();
    },
  },
  components: {
    TextField,
    Btn,
  },
};
</script>

<style lang="scss" scoped>
.transfer-form {
  background: $c-white;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  padding: 10px;

  .controls {
    margin: auto auto auto 15px;
  }
}
</style>
