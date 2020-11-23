<template>
  <v-treeview class="category-tree" :items="shownCategories" item-text="Name" item-key="id"
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
import {
  mapActions, mapMutations, mapGetters, mapState,
} from 'vuex';

export default {
  name: 'CategoryTree',
  data: () => ({}),
  props: {
    spending: Boolean,
    income: Boolean,
  },
  computed: {
    ...mapGetters(['allCategories']),
    ...mapState({
      spendingCategories: (state) => state.categories.spendingCategories,
      incomeCategories: (state) => state.categories.incomeCategories,
    }),
    shownCategories() {
      if (this.spending || this.income) {
        return this.spending ? this.spendingCategories : this.incomeCategories;
      }

      return this.allCategories;
    },
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
