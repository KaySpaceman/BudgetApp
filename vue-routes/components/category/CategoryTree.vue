<template>
    <div class="category-tree-wrapper">
        <li class="cat-tree-branch" v-for="(item, index) in items">
            <span class="cat-name" v-text="item.Name"></span>
            <button class="cat-delete" @click="deleteCategory(item.IdString, index)">Delete</button>
            <ul class="cat-tree-subtree" v-if="item.Children">
                <CategoryTree :items="item.Children" :level="level + 1"/>
            </ul>
        </li>
    </div>
</template>

<script>
  export default {
    name: 'CategoryTree',
    data: () => {
      return {
        deleteCategory: function(categoryId, index) {
          $.post('/categories/delete', { Id: categoryId }, () => {
            Vue.delete(this.items, index);
          }).fail(() => {
            alert('Failed to delete category!');
          });
        }
      };
    },
    props: {
      items: [Array, Object],
      level: Number,
    },
  };
</script>
