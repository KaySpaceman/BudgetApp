<template>
  <div class="vault-form">
    <div class="fields">
      <div class="column">
        <text-field v-model="formData.Name" label="Name" wide/>
      </div>
      <div class="column row">
        <text-field v-model.number="formData.Goal" label="Goal" type="number"
                    :rules="[validateGoal]" no-margin/>
        <color-picker v-model="formData.Color" label="Color" no-margin/>
      </div>
    </div>
    <div class="sub-goals">
      <sub-goal v-for="subGoal in selectedVault.Children" :key="subGoal.id" :sub-goal="subGoal"/>
      <img class="icon" src="@/assets/Plus.svg" alt="add sub-goal"/>
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
import ColorPicker from '../inputs/ColorPicker.vue';
import SubGoal from './SubGoal.vue';

export default {
  name: 'VaultForm',
  data: () => ({
    formData: {
      Color: '#0295FF',
    },
  }),
  computed: {
    ...mapState({
      selectedVault: (state) => state.vaults.selectedVault,
    }),
  },
  watch: {
    selectedVault(vault) {
      const { Balance, ...formData } = vault;
      this.formData = {
        ...formData,
        Color: formData.Color || '#0295FF',
      };
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
    validateGoal() {
      const goal = this.formData.Goal;

      return (!!Number.parseFloat(goal) && goal > 0) || this.formData === {};
    },
    validateForm() {
      return this.formData !== {} && this.validateGoal();
    },
    clearForm() {
      this.selectVault({});
    },
  },
  components: {
    SubGoal,
    ColorPicker,
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

  .sub-goals {
    .icon {
      display: block;
      margin: auto;
    }
  }

  .controls {
    display: flex;
  }
}
</style>
