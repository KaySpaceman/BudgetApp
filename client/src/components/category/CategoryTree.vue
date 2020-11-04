<template>
  <v-treeview class="category-tree" :items="allCategories" item-text="Name" item-key="id"
              item-children="Children" dense>
    <template v-slot:append="{ item }">
      <img class="icon" src="@/assets/Delete.svg" alt="delete"
           @click="deleteCategory(item.id)"/>
      <img class="icon" src="@/assets/ToEdit.svg" alt="edit"
           @click="selectCategory(item)"/>
    </template>
  </v-treeview>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'CategoryTree',
  data: () => ({}),
  computed: {
    ...mapGetters(['allCategories']),
  },
  methods: {
    ...mapMutations(['selectCategory']),
    ...mapActions(['deleteCategory']),
  },
};
</script>

<style lang="scss">
.category-tree {
  .v-treeview-node__root {
    min-height: 20px;
  }

  .v-treeview-node__content {
    color: $c-cadet-blue-crayola;
    font-family: $f-open-sans;
    font-weight: $fw-bold;
    font-size: 12px;
    line-height: 12px;

    .icon {
      display: none;
      margin: 0 3px;
      cursor: pointer;
      height: 12px;
      width: 12px;

      &:hover {
        filter: brightness(0%);
      }
    }

    &:hover .icon {
      display: inline;
    }
  }

  .v-treeview-node__toggle {
    transform: rotate(-90deg);

    &.v-treeview-node__toggle--open {
      transform: none;
    }
  }
}
</style>
