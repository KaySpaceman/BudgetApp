<template>
  <div id="app">
    <div id="page-content" class="category-page">
      <div class="page-header">
        <h1 class="page-title">Categories</h1>
      </div>
      <div class="category-view-wrapper">
        <div class="cat-tree">
          <ul class="cat-tree-subtree level-0">
            <CategoryTree :items="categoryTree" :level="0"/>
          </ul>
        </div>
        <div class="cat-create-form-wrapper">
          <form class="cat-create-form">
            <h2 class="cat-new-heading">Add a new category</h2>
            <label class="cat-new-label" for="cat-new-name">Name</label>
            <input id=cat-new-name type="text" name="name">
            <CategorySelect class="cat-new-parent-select" :categories="flatCategories"
                            :identifier="'create'" :onlyLastLevel="false" :label="Parent"/>
            <button class="cat-new-submit button" type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryTree from '../components/category/CategoryTree.vue';
import CategorySelect from '../components/category/CategorySelect.vue';

export default {
  data: () => ({
    categoryTree: [],
    flatCategories: [],
  }),
  components: {
    CategoryTree,
    CategorySelect,
  },
};
</script>
