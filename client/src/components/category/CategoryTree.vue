<template>
    <div class="category-tree">
      <v-treeview :items="allCategories" item-text="Name" item-key="id" item-children="Children"
                  dense>
        <template v-slot:append="{ item }">
          <img class="icon" src="@/assets/Delete.svg" alt="delete"
               @click="deleteCategory(item.id)"/>
          <img class="icon" src="@/assets/ToEdit.svg" alt="edit"
               @click="selectCategory(item)"/>
        </template>
      </v-treeview>
    </div>
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

<style lang="scss" scoped>
.category-tree {
}
</style>
