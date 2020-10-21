<template>
  <div class="transaction-form">
    <div class="fields">
      <div class="column">
        <text-field v-model.number="formData.Name" label="Name" wide/>
      </div>
      <div class="column">
        <category-select-field v-model="formData.Category" label="Parent"/>
      </div>
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
import CategorySelectField from '../inputs/CategorySelectField.vue';
import Btn from '../inputs/Btn.vue';

export default {
  name: 'CategoryForm',
  data: () => ({
    formData: {},
  }),
  computed: {
    ...mapState({}),
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([]),
    submitForm() {
      if (this.validateForm()) {
        this.upsertTransaction(this.formData);
        this.clearForm();
      }
    },
    validateForm() {
      // TODO: Implement
    },
    clearForm() {
      this.formData = {};
    },
  },
  components: {
    TextField,
    CategorySelectField,
    Btn,
  },
};
</script>

<style lang="scss" scoped>
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
