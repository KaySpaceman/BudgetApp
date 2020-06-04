<template>
    <div id="app">
        <Navigation/>
        <div id="page-content" class="category-wrapper">
            <h1>Transaction Categories</h1>
            <div class="cat-tree">
                <ul class="cat-tree-subtree level-0">
                    <CategoryTree :items="categoryTree" :level="1"/>
                </ul>
            </div>
            <div class="cat-create-form-wrapper">
                <form action="categories/new" class="cat-create-form" method="POST">
                    <h3 class="cat-new-heading">Add a new category</h3>
                    <label class="cat-label" for="cat-new-name">Name</label>
                    <input id=cat-new-name type="text" name="name">
                    <CategorySelect :categories="flatCategories" :identifier="'create'" :onlyLastLevel="false"
                                    :label="Parent"/>
                    <span class="cat-parent-notice">Leave empty for root category</span>
                    <button class="cat-new-submit" type="submit">Add</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
  import CategoryTree from './components/category/CategoryTree.vue';
  import CategorySelect from './components/category/CategorySelect.vue';
  import Navigation from './components/Navigation.vue';

  export default {
    data: () => {
      return {
        categoryTree: [],
        flatCategories: [],
      };
    },
    components: {
      Navigation,
      CategoryTree,
      CategorySelect,
    },
  };
</script>
