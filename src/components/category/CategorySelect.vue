<template>
  <div :id="'category-wrapper-' + identifier" class="category-wrapper">
    <label class="cat-label" :for="'cat-sel-' + identifier" v-text="label" v-if="label"/>
    <div :id="'select-wrapper-'+ identifier" class="select-wrapper"
         v-if="!current || selectIsShown">
      <select :id="'cat-sel-' + identifier" class="category-select" :name="identifier"
              v-model="selectedValue" :disabled="!!current && !selectIsShown">
        <option value="" disabled hidden>Select a category</option>
        <CategoryOption v-for="item in categories" :item="item" :key="item.id"
                        :disabled="onlyLastLevel ? categoryHasChildren(item) : false"/>
      </select>
    </div>
    <template v-else>
      <span class="category-current" v-text="currentName"/>
      <button type="button" class="button button-tiny" @click="showSelect(identifier)">
        Edit
      </button>
    </template>
  </div>
</template>

<script>
import CategoryOption from './CategoryOption.vue';

export default {
  name: 'CategorySelect',
  data() {
    return {
      selectIsShown: false,
      selectedValue: '',
    };
  },
  props: {
    categories: [Array, Object],
    identifier: String,
    onlyLastLevel: Boolean,
    current: String,
    currentName: String,
    label: String,
  },
  watch: {
    selectedValue(newValue) {
      this.emitValue(newValue);
    },
  },
  methods: {
    showSelect() {
      this.selectIsShown = true;
    },
    categoryHasChildren(category) {
      if (!category.Children) return false;
      if (Array.isArray(category.Children)) return category.Children.length > 0;

      return Object.keys(category.Children).length > 0;
    },
    emitValue(value) {
      this.$emit('input', value);
    },
  },
  mounted() {
    if (this.current) {
      this.selectedValue = this.current;
    }
  },
  components: {
    CategoryOption,
  },
};
</script>
