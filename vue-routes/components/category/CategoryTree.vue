<template>
    <div class="category-tree-wrapper">
        <li class="cat-tree-branch" :class="'level-' + level" v-for="(item, index) in items">
            <span class="cat-name" v-text="item.Name"/>
            <span v-text="index"></span>
            <i class="material-icons md-18 cat-delete" @click="deleteCategory(item.IdString, index)">delete_outline</i>
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
      return {};
    },
    methods: {
      deleteCategory: function(categoryId, index) {
        $.post('/categories/delete', { categoryId }, () => {
          Vue.delete(this.items, index);
        }).fail(() => {
          alert('Failed to delete category!');
        });
      },
    },
    props: {
      items: [Array, Object],
      level: Number,
    },
  };
</script>
