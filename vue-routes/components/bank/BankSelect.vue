<template>
    <div class="bank-select-wrapper">
        <label class="bank-label" for="bank-select">Bank</label>
        <select id="bank-select" class="bank-select" name="bank" :required="isRequired"
                v-on:change="emitValue($event.target.value)">
            <option v-for="bank in banks" class="bank-option" :value="bank.value" v-text="bank.name"/>
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
      isRequired: false,
    },
    methods: {
      emitValue: function (value) {
        this.$emit('input', value);
      },
    },
  };
</script>
