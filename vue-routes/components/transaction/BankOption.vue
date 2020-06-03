<template>
    <option class="bank-option" :value="item.id" v-text="item.Name"/>
</template>

<script>
  export default {
    name: 'BankOption',
    data: () => {
      return {};
    },
    props: {
      item: Object,
    },
  };
</script>
