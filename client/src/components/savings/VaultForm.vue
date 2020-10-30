<template>
  <div class="vault-form">
    <div class="fields">
      <div class="column">
        <text-field v-model.number="formData.Name" label="Name" wide/>
      </div>
      <div class="column row">
        <text-field v-model.number="formData.Amount" label="Amount" type="number"
                    :rules="[validateAmount]"/>
        <div class="color-picker">
          <!--TODO: Replace with color select once component is created-->
          <span>Soon</span>
        </div>
      </div>
    </div>
    <div class="sub-goals">
      <!--TODO: List sub-goals with edit/position functions-->
    </div>
    <div class="controls">
      <btn row @click="submitForm">Save</btn>
      <btn row clear outlined @click="clearForm">Clear</btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import TextField from '../inputs/TextField.vue';
import Btn from '../inputs/Btn.vue';

export default {
  name: 'VaultForm',
  data: () => ({
    formData: {},
  }),
  computed: {
    ...mapState({
      selectedVault: (state) => state.vaults.selectedVault,
    }),
  },
  watch: {
    selectedVault(vault) {
      this.formData = { ...vault };
    },
  },
  methods: {
    ...mapMutations(['selectVault']),
    ...mapActions(['upsertVault']),
    submitForm() {
      if (this.validateForm()) {
        this.upsertVault(this.formData);
        this.clearForm();
      }
    },
    validateAmount() {
      const amount = this.formData.Amount;

      return ((!!Number.parseFloat(amount) && amount > 0) || !amount)
        || 'Must be a positive number!';
    },
    validateForm() {
      // TODO: Validate data with JOI
    },
    clearForm() {
      this.selectVault({});
    },
  },
  components: {
    TextField,
    Btn,
  },
};
</script>

<style lang="scss" scoped>
.vault-form {
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
    }
  }

  .controls {
    display: flex;
  }
}
</style>
