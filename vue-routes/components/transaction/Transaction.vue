<template>
    <div class="transaction" :class="{ 'un-categorized': !item.Category }">
        <span v-text="item.DateString"/>
        <span v-text="item.Note"/>
        <span v-text="item.Direction"/>
        <span v-text="item.Amount"/>
        <CategorySelect :categories="flatCategories" :identifier="item.IdString" :current="item.CategoryIdString"
                        :onlyLastLevel="true" :currentName="item.CategoryName"/>
    </div>
</template>

<script>
  import CategorySelect from '../category/CategorySelect.vue';

  export default {
    name: 'Transaction',
    data: () => {
      return {};
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
