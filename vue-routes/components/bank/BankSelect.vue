<template>
    <div class="bank-select-wrapper">
        <label class="bank-label" for="bank-select">Bank</label>
        <select id="bank-select" class="bank-select" name="bank">
            <option v-for="bank in banks" class="bank-option" :value="bank.id" v-text="bank.Name"/>
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
      banks: [Array, Object],
    },
    mounted: function () {
      $('#bank-select')
        .select2({
          width: '100px',
        });
    },
  };
</script>
