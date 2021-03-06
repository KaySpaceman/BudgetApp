<template>
  <div class="vault-form">
    <div class="fields">
      <div class="column">
        <text-field v-model="formData.Name" label="Name" wide/>
      </div>
      <div class="column row">
        <text-field v-model.number="formData.Goal" label="Goal" type="number"
                    :rules="[validateGoal]" no-margin
                    :disabled="formData.Children.length > 0"/>
        <color-picker v-model="formData.Color" label="Color" no-margin/>
      </div>
    </div>
    <div class="sub-goals">
      <sub-goal v-for="(subGoal, index) in formData.Children" :key="subGoal.id"
                v-model="formData.Children[index]" @delete="setDeletedSubGoal(index)"/>
      <img class="icon" src="@/assets/Plus.svg" alt="add sub-goal" @click="addNewSubGoal()"/>
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
      Children: [],
    },
    deletedSubGoals: [],
  }),
  computed: {
    ...mapState({ selectedVault: (state) => state.vaults.selectedVault }),
  },
  watch: {
    selectedVault(vault) {
      const { Balance, ...formData } = vault;
      this.formData = {
        ...formData,
        Color: formData.Color || '#0295FF',
        Children: Array.isArray(formData.Children) ? [...formData.Children] : [],
      };
    },
  },
  methods: {
    ...mapMutations(['selectVault']),
    ...mapActions(['upsertVault', 'deleteVault']),
    submitForm() {
      if (this.validateForm()) {
        const cleanData = {
          ...this.formData,
          Children: this.formData.Children.map((child) => ({
            id: child.id,
            Name: child.Name,
            Goal: child.Goal,
          })),
        };

        this.deletedSubGoals.forEach((id) => this.deleteVault(id));
        this.upsertVault({ formData: cleanData, selectResult: true });
        this.deletedSubGoals = [];
      }
    },
    addNewSubGoal() {
      this.formData.Children.push({
        Name: 'New Sub-Goal',
        Goal: 100,
        Balance: 0,
      });
    },
    setDeletedSubGoal(index) {
      const { id } = this.formData.Children[index];

      if (id) this.deletedSubGoals.push(id);
      this.formData.Children.splice(index, 1);
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
    margin-bottom: 10px;

    .icon {
      display: block;
      margin: auto;
      cursor: pointer;
    }
  }

  .controls {
    display: flex;
  }
}
</style>
