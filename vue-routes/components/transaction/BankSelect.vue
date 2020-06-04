<template>
    <select id="statement-bank-select" name="bank">
        <option v-for="item in items" class="bank-option" :value="item.id" v-text="item.Name"/>
    </select>
</template>

<script>
  export default {
    name: 'BankSelect',
    data: () => {
      return {};
    },
    props: {
      items: [Array, Object],
    },
    mounted: function () {
      $('#statement-bank-select')
        .select2({
          width: '100px',
        });
    },
  };
</script>
