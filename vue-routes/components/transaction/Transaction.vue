<template>
    <div class="transaction" :class="{ 'un-categorized': !item.Category }">
        <span class="column" v-text="item.DateString"/>
        <span class="column wide" v-text="item.Note"/>
        <span class="column narrow" v-text="item.Direction"/>
        <span class="column narrow" v-text="item.Amount"/>
        <CategorySelect class="column" :categories="flatCategories" :identifier="item.IdString" :current="item.CategoryIdString"
                        :onlyLastLevel="true" :currentName="item.CategoryName" v-model="selectedCategory"/>
    </div>
</template>

<script>
  import CategorySelect from '../category/CategorySelect.vue';

  export default {
    name: 'Transaction',
    data: () => {
      return {
        selectedCategory: null,
      };
    },
    props: {
      item: Object,
      flatCategories: [Array, Object],
    },
    components: {
      CategorySelect,
    },
  };
</script>
