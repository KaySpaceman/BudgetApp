<template>
    <div :id="'category-wrapper-' + identifier" class="category-wrapper">
        <label class="cat-label" :for="'cat-sel-' + identifier" v-text="label" v-if="label"></label>
        <div :id="'select-wrapper-'+ identifier" class="select-wrapper" v-if="!current">
            <treeselect name="create" :searchable="true" :options="categories" v-model="current"
                        :normalizer="normalizeCategories"/>
        </div>
        <button type="button" class="button button-small" :data-transaction="identifier" v-else>
            Edit
        </button>
    </div>
</template>

<script>
  // import '@riophae/vue-treeselect/dist/vue-treeselect.css';

  export default {
    name: 'CategorySelect',
    data: () => {
      return {
        normalizeCategories: (category) => {
          return {
            id: category.IdString,
            label: category.Name,
            children: category.Children,
          }
        },
      };
    },
    props: {
      categories: [Array, Object],
      identifier: String,
      flat: Boolean,
      current: String,
      label: String,
    },
    created: function () {

      debugger;
      this.component('treeselect', VueTreeselect.Treeselect)
    }
    // components: {
      // 'TreeSelect': VueTreeselect.Treeselect,
    // },
  };
</script>
