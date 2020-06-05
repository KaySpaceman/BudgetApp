<template>
    <div class="bank-select-wrapper">
        <label class="bank-label" for="statement-bank-select">Bank</label>
        <select id="statement-bank-select" class="bank-select" name="bank">
            <option v-for="item in items" class="bank-option" :value="item.id" v-text="item.Name"/>
        </select>
    </div>
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
