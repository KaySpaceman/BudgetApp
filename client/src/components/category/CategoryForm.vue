<template>
  <div class="category-form">
    <div class="fields">
      <div class="column">
        <text-field v-model.number="formData.Name" label="Name" wide/>
      </div>
      <div class="column row">
        <category-select-field v-model="formData.Parent" label="Parent" allow-all-levels/>
        <btn class="tree-toggle" square>
          <img class="icon" src="@/assets/TreeIcon.svg" alt="Show category tree"
               @click="showTree = !showTree"/>
        </btn>
      </div>
<!--  TODO: Add income and spending category type toggle  -->
    </div>
    <div class="controls">
      <btn row @click="submitForm">Save</btn>
      <btn row clear outlined @click="clearForm">Clear</btn>
    </div>
    <category-tree v-if="showTree"/>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import TextField from '../inputs/TextField.vue';
import CategorySelectField from '../inputs/CategorySelectField.vue';
import Btn from '../inputs/Btn.vue';
import CategoryTree from './CategoryTree.vue';

export default {
  name: 'CategoryForm',
  data: () => ({
    formData: {},
    showTree: false,
  }),
  computed: {
    ...mapState({ selectedCategory: (state) => state.categories.selectedCategory }),
  },
  watch: {
    selectedCategory(category) {
      this.formData = {
        id: category.id,
        Name: category.Name,
        Parent: category.Parent ? category.Parent.id : null,
      };
    },
  },
  methods: {
    ...mapActions(['upsertCategory']),
    ...mapMutations(['selectCategory']),
    submitForm() {
      if (this.validateForm()) {
        this.upsertCategory(this.formData);
        this.clearForm();
      }
    },
    validateForm() {
      return typeof this.formData.Name === 'string'
        && (!this.formData.Parent || typeof this.formData.Parent === 'string');
    },
    clearForm() {
      this.selectCategory({});
    },
  },
  components: {
    CategoryTree,
    TextField,
    CategorySelectField,
    Btn,
  },
};
</script>

<style lang="scss" scoped>
.category-form {
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
