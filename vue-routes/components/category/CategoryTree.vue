<template>
    <div class="category-tree-wrapper">
        <template v-for="item in items">
            <li class="cat-tree-branch">
                <span class="cat-name" v-text="item.Name"></span>
                <button class="cat-delete" data-id="item._id">Delete</button>
                <ul class="cat-tree-subtree" v-if="item.Children">
                    <CategoryTree :items="item.Children" :level="level + 1"/>
                </ul>
            </li>
        </template>
    </div>
</template>

<script>
  export default {
    name: 'CategoryTree',
    data: () => {
      return {};
    },
    props: {
      categories: Array,
      items: [Array, Object],
      level: Number,
    },
  };
</script>
